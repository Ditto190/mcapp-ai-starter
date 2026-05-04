export function TagEditorPage() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Tag Editor</h1>
      <p>Manage the taxonomy: tracks, phases, domains, artifact types, and free-form tags.</p>
      <h2>Classification Tracks</h2>
      <ul>
        <li><strong>capability</strong> — Dynamic Capabilities: sensing, seizing, transforming, integrative-learning</li>
        <li><strong>task-bundle</strong> — Project delivery: domains, artifact types, RFI sections</li>
      </ul>
      <h2>Free-form Tags</h2>
      <p style={{ color: '#888' }}>Phase 1 scaffold — tag CRUD wired up in Phase 2.</p>
    </div>
  )
}
