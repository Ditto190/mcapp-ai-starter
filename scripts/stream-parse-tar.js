#!/usr/bin/env node
// Stream-parse a tar.gz archive and write entries to disk while skipping very large files.
// Usage: node scripts/stream-parse-tar.js <input.tar.gz> [--outdir=out] [--max-size=50000000]

import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import tar from 'tar-stream';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

function parseArgs() {
    const args = process.argv.slice(2);
    const opts = { input: null, outdir: 'snapshots-out', maxSize: 50 * 1024 * 1024, upload: false, table: 'mcp_snapshots' };
    for (const a of args) {
        if (!opts.input && !a.startsWith('--')) opts.input = a;
        if (a.startsWith('--outdir=')) opts.outdir = a.split('=')[1];
        if (a.startsWith('--max-size=')) opts.maxSize = Number(a.split('=')[1]);
        if (a === '--upload') opts.upload = true;
        if (a.startsWith('--table=')) opts.table = a.split('=')[1];
    }
    return opts;
}

async function ensureDir(dir) {
    await fs.promises.mkdir(dir, { recursive: true });
}

function drainStream(stream) {
    return new Promise((resolve) => {
        stream.on('end', resolve);
        stream.on('close', resolve);
        stream.resume();
    });
}

async function writeStreamToFile(stream, outPath) {
    await ensureDir(path.dirname(outPath));
    return new Promise((resolve, reject) => {
        const ws = fs.createWriteStream(outPath);
        stream.pipe(ws);
        ws.on('finish', resolve);
        ws.on('error', reject);
        stream.on('error', reject);
    });
}

async function uploadSmallFileToSupabase(table, name, buffer) {
    if (!SUPABASE_URL || !SUPABASE_KEY) {
        throw new Error('SUPABASE_URL and SUPABASE_KEY must be set to use --upload');
    }

    const url = `${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/${encodeURIComponent(table)}`;
    // Prepare a JSON payload with base64 content
    const payload = { filename: name, content_b64: buffer.toString('base64') };

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
            Prefer: 'return=representation'
        },
        body: JSON.stringify(payload)
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Supabase upload failed: ${res.status} ${res.statusText} - ${text}`);
    }
    return res.json();
}

async function run() {
    const opts = parseArgs();
    const { input, outdir, maxSize } = opts;
    if (!input) {
        console.error('Usage: node scripts/stream-parse-tar.js <input.tar.gz> [--outdir=out] [--max-size=50000000]');
        process.exit(2);
    }

    await ensureDir(outdir);

    const extract = tar.extract();

    extract.on('entry', async (header, stream, next) => {
        try {
            const safeName = header.name.replace(/^\/+/, '').replace(/\.\.(?:\/|$)/g, '_');
            const outPath = path.join(outdir, safeName);

            if (header.type === 'file') {
                if (header.size && header.size > maxSize) {
                    // create a small placeholder instead of storing the whole file
                    const placeholder = `${safeName}.placeholder`;
                    const meta = `SKIPPED_LARGE_FILE\nname: ${header.name}\nsize: ${header.size}\nmode: ${header.mode}\n`;
                    await ensureDir(path.dirname(path.join(outdir, placeholder)));
                    await fs.promises.writeFile(path.join(outdir, placeholder), meta, { encoding: 'utf8' });
                    // drain the stream
                    await drainStream(stream);
                    console.log(`skipped large entry: ${header.name} (${header.size} bytes)`);
                } else {
                    // write to disk streaming
                    if (opts.upload) {
                        // buffer into memory then upload (small files only)
                        const chunks = [];
                        for await (const chunk of stream) chunks.push(chunk);
                        const buffer = Buffer.concat(chunks);
                        try {
                            await uploadSmallFileToSupabase(opts.table, header.name, buffer);
                            console.log(`uploaded to supabase: ${header.name}`);
                        } catch (err) {
                            console.error('upload error', err);
                            // fallback: write to disk
                            await fs.promises.mkdir(path.dirname(outPath), { recursive: true });
                            await fs.promises.writeFile(outPath, buffer);
                        }
                    } else {
                        await writeStreamToFile(stream, outPath);
                        console.log(`wrote: ${outPath}`);
                    }
                }
            } else {
                // directories, symlinks, etc. ensure directory and drain
                if (header.type === 'directory') {
                    await ensureDir(outPath);
                }
                await drainStream(stream);
            }
        } catch (err) {
            console.error('entry error', err);
            // try to drain and continue
            try { await drainStream(stream); } catch (e) { }
        }
        next();
    });

    extract.on('finish', () => {
        console.log('extract finished');
    });

    extract.on('error', (err) => {
        console.error('extract error', err);
        process.exit(1);
    });

    const rs = fs.createReadStream(input);
    rs.on('error', (e) => { console.error('read error', e); process.exit(1); });

    rs.pipe(zlib.createGunzip()).pipe(extract);
}

run().catch((err) => { console.error(err); process.exit(1); });
