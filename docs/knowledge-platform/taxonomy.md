# Knowledge Management Platform — Taxonomy Reference

> This is the canonical classification system for all knowledge items in foam-modme.

---

## Two-Track Classification System

All knowledge items belong to one of two tracks:

| Track | Value | Purpose |
|-------|-------|---------|
| Dynamic Capabilities | `capability` | AI Architecture methodology deliverables |
| Project Delivery | `task-bundle` | Meeting notes → structured artefacts |

---

## Track A — Dynamic Capabilities

**Purpose**: Organise notes, artefacts, and insights that feed into the Dynamic Capabilities AI Architecture methodology.

### Capability Phases

| Phase | `capability_phase` value | Description |
|-------|--------------------------|-------------|
| Sensing | `sensing` | Environmental scanning, weak-signal detection, opportunity/threat identification |
| Seizing | `seizing` | Strategic decision-making, resource allocation, design commitments |
| Transforming | `transforming` | Capability reconfiguration, organisational change, re-alignment |
| Integrative Learning | `integrative-learning` | Reflection, synthesis, knowledge consolidation for future reuse |

### Track A Metadata Fields

| Field | Values | Required |
|-------|--------|---------|
| `track` | `capability` | ✅ |
| `capability_phase` | `sensing` \| `seizing` \| `transforming` \| `integrative-learning` | ✅ |
| `status` | `raw` → `processed` → `deliverable` | ✅ |
| `client_facing` | `true` \| `false` | ✅ |
| `project` | string (project name/code) | recommended |

---

## Track B — Project Delivery

**Purpose**: Process rushed, cross-domain meeting notes (especially from M365 Copilot) into structured, domain-organised project artefacts.

### Source Types

| Source | `source` value | Description |
|--------|---------------|-------------|
| M365 Copilot Meeting | `m365-meeting` | M365 Copilot-structured meeting notes (may be repetitive, need deduplication) |
| Foam Note | `foam-note` | Manual notes written in VS Code / Foam |
| Sublime Text Import | `sublime-import` | Notes imported from Sublime Text (de-PII'd before import) |
| GitHub Issue | `github-issue` | Imported GitHub issues or PRs |

### Domains

Domains are user-defined strings that group artefacts by business area. Common examples:

- `delivery` — Sprint/milestone delivery tracking
- `architecture` — Technical architecture decisions
- `staffing` — Team/resource planning
- `pricing` — Pricing and commercial discussions
- `client-engagement` — Client-facing interactions and commitments
- `internal` — Internal team notes and coordination

### Artifact Types

| Type | `artifact_type` value | Description |
|------|-----------------------|-------------|
| RFI Section | `rfi-section` | Structured section of an RFI/proposal document |
| Action Item | `action-item` | Task assigned to a person with a due date |
| Decision | `decision` | Decision recorded from a meeting or discussion |
| Status Report | `status-report` | Domain status snapshot |
| Deliverable | `deliverable` | Client-facing or internal deliverable artefact |

### Track B Metadata Fields

| Field | Values | Required |
|-------|--------|---------|
| `track` | `task-bundle` | ✅ |
| `domain` | string | ✅ |
| `artifact_type` | `rfi-section` \| `action-item` \| `decision` \| `status-report` \| `deliverable` | ✅ |
| `m365_source` | string (meeting title/date reference) | when from M365 |
| `dashboard_status` | string (per-artefact status) | recommended |

---

## Shared Metadata Fields

These fields apply to **all** knowledge items regardless of track:

| Field | Type | Values | Description |
|-------|------|--------|-------------|
| `track` | enum | `capability` \| `task-bundle` | Primary classification track |
| `status` | enum | `raw` \| `processed` \| `deliverable` | Processing/lifecycle state |
| `source` | enum | `foam-note` \| `github-issue` \| `sublime-import` \| `m365-meeting` | Origin of the note |
| `project` | string | any | Project identifier/code |
| `client_facing` | boolean | `true` / `false` | Whether this is a client-deliverable artefact |
| `tags` | string[] | any | Free-form tags (in addition to structured fields) |

---

## Status Flow

```
raw → processed → deliverable
```

| Stage | Meaning |
|-------|---------|
| `raw` | Just ingested — not yet classified or cleaned |
| `processed` | Tagged, classified, deduped, PII-stripped |
| `deliverable` | Ready for use, publishing, or sharing |

**Inbox items always start as `raw`.** The A.D.A.M. MCP server processes them into `processed`. Human review or automation promotes to `deliverable`.

---

## Dashboard AI Card Schema

Each knowledge item renders as an **AI Card** in the Wasp status dashboard:

```typescript
interface AICard {
  id: string;
  title: string;
  track: 'capability' | 'task-bundle';
  // Track A
  capabilityPhase?: 'sensing' | 'seizing' | 'transforming' | 'integrative-learning';
  // Track B
  domain?: string;
  artifactType?: 'rfi-section' | 'action-item' | 'decision' | 'status-report' | 'deliverable';
  percentDone?: number;   // For rfi-section
  assignee?: string;      // For action-item
  dueDate?: string;       // For action-item ISO date
  // Shared
  status: 'raw' | 'processed' | 'deliverable';
  source: string;
  clientFacing: boolean;
  project?: string;
  tags: string[];
  updatedAt: string;
}
```

**RFI Documents** render as a **visual timeline diagram** — each section appears as a step with a `% complete` overlay badge, showing the overall proposal status at a glance.

---

## Prisma Schema Preview

The following Prisma models implement this taxonomy (to be placed in `knowledge-platform/schema.prisma`):

```prisma
// Track-agnostic knowledge item
model KnowledgeItem {
  id               String    @id @default(cuid())
  title            String
  content          String
  type             String    // "code" | "doc" | "schema" | "workflow"
  track            String    // "capability" | "task-bundle"
  status           String    @default("raw")   // "raw" | "processed" | "deliverable"
  source           String?   // "foam-note" | "github-issue" | "sublime-import" | "m365-meeting"
  // Track A
  capabilityPhase  String?   // "sensing" | "seizing" | "transforming" | "integrative-learning"
  // Track B
  domain           String?
  artifactType     String?   // "rfi-section" | "action-item" | "decision" | "status-report" | "deliverable"
  m365Source       String?
  dashboardStatus  String?
  // Shared
  project          String?
  clientFacing     Boolean   @default(false)
  tags             KnowledgeItemTag[]
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt
}

model Tag {
  id            String             @id @default(cuid())
  name          String             @unique
  items         KnowledgeItemTag[]
}

model KnowledgeItemTag {
  knowledgeItem   KnowledgeItem @relation(fields: [knowledgeItemId], references: [id])
  knowledgeItemId String
  tag             Tag           @relation(fields: [tagId], references: [id])
  tagId           String
  @@id([knowledgeItemId, tagId])
}

model MeetingNote {
  id           String     @id @default(cuid())
  title        String
  content      String     // Raw M365 content (may be repetitive — dedup in processing)
  processed    String?    // Cleaned/deduped content
  domain       String?
  m365Source   String?    // Meeting title/date reference
  artifacts    Artifact[]
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt
}

model Artifact {
  id            String       @id @default(cuid())
  title         String
  artifactType  String       // "rfi-section" | "action-item" | "decision" | "status-report" | "deliverable"
  status        String       @default("draft")
  domain        String?
  percentDone   Int?         // For rfi-section (0–100)
  assignee      String?      // For action-item
  dueDate       DateTime?    // For action-item
  clientFacing  Boolean      @default(false)
  meetingNote   MeetingNote? @relation(fields: [meetingNoteId], references: [id])
  meetingNoteId String?
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt
}
```

---

## Guiding Principles

1. **Classify first, ingest second** — Always assign track + phase/domain before content enters the processed state
2. **PII before everything** — The `.pii-rules.csv` replacement pass runs BEFORE any note is stored or classified
3. **Source matters** — Track origin (`source` field) to enable audit trail and source-specific processing rules
4. **M365 is noisy** — Meeting notes from M365 Copilot are verbose and may repeat; deduplication is mandatory before `status → processed`
5. **Dashboard is the proof** — The Wasp status dashboard (AI Cards + RFI timeline) is the primary deliverable; design all data to serve it
