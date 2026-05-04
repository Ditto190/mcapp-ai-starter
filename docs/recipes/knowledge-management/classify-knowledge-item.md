# Classify a Knowledge Item

Assign the correct **track**, **phase/domain**, **status**, and **tags** to a raw note so it becomes discoverable in the Knowledge Browser and feeds the correct workflow.

## When to use this recipe

Use this recipe every time you ingest a new note — whether from a Foam note, GitHub issue, Sublime Text import, or M365 meeting summary. Classification transforms a `raw` item into a `processed` one that the dashboard, RFI timeline, and tag editor can surface.

## Required Extensions / Tools

- **[Foam for VSCode](https://marketplace.visualstudio.com/items?itemName=foam.foam-vscode)** — for note authoring and wikilinks
- **A.D.A.M. MCP server** (`examples/adam-server/`) — for tool-based classification via `ingest-knowledge`
- **Wasp Knowledge Platform** (`knowledge-platform/`) — for visual classification via Tag Editor UI (Phase 2+)

## Instructions

### Step 1: Determine the track

Every knowledge item must belong to one of two tracks:

| Track | When to use |
|-------|-------------|
| `capability` | The note relates to AI Architecture methodology, consulting deliverables, or a Dynamic Capabilities phase (Sensing/Seizing/Transforming/Integrative Learning) |
| `task-bundle` | The note comes from a meeting, contains action items/decisions, or is scoped to a specific domain (delivery, architecture, staffing, etc.) |

**Tip**: If the note feeds a client deliverable or describes architectural thinking → `capability`. If it came from a meeting or contains to-dos → `task-bundle`.

### Step 2: Assign phase (Track A) or domain (Track B)

**Track A — Capability Phase:**

| Phase | Assign when the note is about... |
|-------|----------------------------------|
| `sensing` | Scanning the environment, identifying opportunities or threats, weak signals |
| `seizing` | Making decisions, committing resources, designing solutions |
| `transforming` | Changing processes/teams, re-configuring capabilities, organisational shifts |
| `integrative-learning` | Retrospectives, synthesis, patterns to reuse in future work |

**Track B — Domain:**

Assign one of your project domains: `delivery`, `architecture`, `staffing`, `pricing`, `client-engagement`, or a custom string.

### Step 3: Set the status

| Status | Meaning |
|--------|---------|
| `raw` | Just ingested — has not been reviewed or cleaned |
| `processed` | Reviewed, classified, PII-stripped, tags assigned |
| `deliverable` | Ready for use in a deliverable, presentation, or client artefact |

> **PII rule**: A note must have `piisStripped: true` before it can move from `raw` → `processed`. The `.pii-rules.csv` replacement script handles this automatically when notes come through the inbox pipeline.

### Step 4: Assign tags

Add free-form tags for discoverability:

- Project names (`acme-q3`, `internal-tooling`)
- Technology area (`azure`, `ai-governance`, `mcp`)
- Topic (`pricing-model`, `sprint-review`, `architecture-decision`)

### Step 5: Record an artifact type (Track B only)

If the item is a structured Track B output, set `artifactType`:

| Value | Use when |
|-------|----------|
| `rfi-section` | This is a section of an RFI or proposal document |
| `action-item` | This is a specific task assigned to someone |
| `decision` | This records a formal decision made in a meeting |
| `status-report` | This is a domain status snapshot |
| `deliverable` | This is a finished client or internal deliverable |

### Step 6: Set `clientFacing`

Set `clientFacing: true` if this item will be shared with or presented to a client. This controls dashboard visibility and access controls in Phase 2+.

## Via A.D.A.M. MCP Tool

```typescript
// Call from any MCP-connected agent:
ingest-knowledge({
  title: "Azure Architecture Review — Sensing Phase",
  content: "...",
  type: "doc",
  tags: ["azure", "sensing", "acme-q3"],
  // Additional metadata (Phase 2 — A.D.A.M. server extended):
  // track: "capability",
  // capabilityPhase: "sensing",
  // status: "raw",
  // source: "foam-note"
})
```

## How to contribute

See [`how-to-write-recipes.md`](../how-to-write-recipes.md) for the recipe contribution guide.
