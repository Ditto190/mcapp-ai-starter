export function KnowledgeBrowserPage() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Knowledge Browser</h1>
      <p>Browse and filter knowledge items by track, phase, domain, and status.</p>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <select disabled>
          <option>Track: All</option>
          <option>capability</option>
          <option>task-bundle</option>
        </select>
        <select disabled>
          <option>Status: All</option>
          <option>raw</option>
          <option>processed</option>
          <option>deliverable</option>
        </select>
        <select disabled>
          <option>Phase: All</option>
          <option>sensing</option>
          <option>seizing</option>
          <option>transforming</option>
          <option>integrative-learning</option>
        </select>
      </div>
      <p style={{ color: '#888' }}>Phase 1 scaffold — live data query wired up in Phase 2.</p>
    </div>
  )
}
