export function DashboardPage() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>foam-modme Knowledge Platform</h1>
      <h2>Status Dashboard</h2>
      <p>
        <strong>Track A (Dynamic Capabilities):</strong> Sensing / Seizing / Transforming / Integrative Learning
      </p>
      <p>
        <strong>Track B (Project Delivery):</strong> Meeting notes → RFI sections, action items, decisions, status reports
      </p>
      <nav>
        <ul>
          <li><a href="/knowledge">Knowledge Browser</a></li>
          <li><a href="/inbox">Inbox</a></li>
          <li><a href="/tags">Tag Editor</a></li>
        </ul>
      </nav>
      <p style={{ color: '#888', fontSize: '0.9rem', marginTop: '2rem' }}>
        Phase 1 scaffold — AI Card dashboard and RFI timeline coming in Phase 2.
      </p>
    </div>
  )
}
