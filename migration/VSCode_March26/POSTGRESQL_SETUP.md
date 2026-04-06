# PostgreSQL Setup for Windows

Follow these steps to install PostgreSQL and create the n8n database:

## Step 1: Run PostgreSQL Installer

The PostgreSQL 16 installer was downloaded. To complete installation:

1. Open Windows File Explorer or Run dialog (Win+R)
2. Paste this path and press Enter:  
   ```
   %APPDATA%\Local\Packages\<your-winget-cache>\PostgreSQL
   ```
   OR search in `%TEMP%` for `postgresql-installer.exe`

3. **Double-click the installer** to launch the GUI wizard
4. Follow the prompts:
   - **Installation Directory**: Use default (`C:\Program Files\PostgreSQL\16`)
   - **Port**: Keep default `5432`
   - **Superuser Password**: Set to `postgres` (or your choice - remember this!)
   - **Locale**: Leave as default
   - Click **Next/Finish** through remaining steps

5. Wait for installation to complete, then click **Finish**

## Step 2: Verify PostgreSQL Installation

Open PowerShell and run:
```powershell
psql --version
```

Should output: `psql (PostgreSQL) 16.x.x`

If not found, manually add PostgreSQL to PATH:
1. Right-click "This PC" → Properties
2. Click "Advanced system settings"
3. Click "Environment Variables"
4. Click "Edit" on PATH
5. Add: `C:\Program Files\PostgreSQL\16\bin`
6. Restart PowerShell

## Step 3: Create n8n Database and User

Open PowerShell and run these commands:

```powershell
# Connect to PostgreSQL as superuser
psql -U postgres

# In the psql prompt (psql=#), run:
CREATE USER n8n_user WITH PASSWORD 'n8n_secure_password_123';
CREATE DATABASE n8n_db OWNER n8n_user;
GRANT ALL PRIVILEGES ON DATABASE n8n_db TO n8n_user;
\q
```

Replace `'n8n_secure_password_123'` with your own secure password.

## Step 4: Update Workspace .env File

Edit `.env` in your workspace root and uncomment the PostgreSQL section:

```env
DB_TYPE=postgresdb
DB_POSTGRESDB_DATABASE=n8n_db
DB_POSTGRESDB_HOST=localhost
DB_POSTGRESDB_PORT=5432
DB_POSTGRESDB_USER=n8n_user
DB_POSTGRESDB_PASSWORD=n8n_secure_password_123
```

## Step 5: Restart n8n

Stop and restart n8n for the database changes to take effect:
```powershell
pm2 stop n8n
pm2 start n8n
```

## Test Connection

Verify PostgreSQL is running:
```powershell
psql -U n8n_user -d n8n_db -c "\dt"
```

Should connect without errors.

## Troubleshooting

**psql command not found:**
- Add `C:\Program Files\PostgreSQL\16\bin` to your PATH (see Step 2)

**Connection refused:**
- Ensure PostgreSQL service is running: Press Win+R, type `services.msc`, find "postgresql-x64-16", right-click → Start

**Cannot create user:**
- Verify you're connected as superuser (postgres): `psql -U postgres`

**n8n still uses SQLite:**
- Check `.env` file: ensure DB_TYPE=postgresdb is not commented
- Restart n8n: `pm2 stop n8n && pm2 start n8n`
- Check logs: `pm2 logs n8n`
