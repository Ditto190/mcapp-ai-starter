export function InboxPage() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Inbox</h1>
      <p>Raw notes and files staged for classification and processing.</p>
      <p>
        <strong>Triggers:</strong> file-watch on <code>docs/inbox/</code>, MCP tool call (<code>ingest-knowledge</code>), manual CLI script.
      </p>
      <p>
        <strong>PII blocking:</strong> <code>.pii-rules.csv</code> replacement runs before any note is classified.
      </p>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #ccc' }}>
            <th style={{ textAlign: 'left', padding: '0.5rem' }}>Filename</th>
            <th style={{ textAlign: 'left', padding: '0.5rem' }}>Source</th>
            <th style={{ textAlign: 'left', padding: '0.5rem' }}>PII Stripped</th>
            <th style={{ textAlign: 'left', padding: '0.5rem' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: '0.5rem', color: '#888' }} colSpan={4}>
              Phase 1 scaffold — inbox queue wired up in Phase 2.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
