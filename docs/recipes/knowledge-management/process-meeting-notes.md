# Process Meeting Notes from M365 Copilot

Turn raw, repetitive M365 Copilot meeting summaries into structured, deduplicated artefacts (action items, decisions, RFI sections) in the Knowledge Platform.

## When to use this recipe

M365 Copilot meeting summaries are verbose and often repeat the same points multiple times. This recipe covers how to:

1. Import the raw meeting note into the inbox
2. Strip PII using the `.pii-rules.csv` replacement
3. Deduplicate and structure the content
4. Classify output artefacts (action items, decisions, RFI sections) as Track B items

## Required Extensions / Tools

- **M365 Copilot** — source of the meeting summary
- **Foam for VSCode** — for manual note editing
- **A.D.A.M. MCP server** (`examples/adam-server/`) — for `ingest-knowledge` tool (Phase 2+: meeting-notes processing tool)
- **PII replacement script** (`scripts/strip-pii.ts`) — Phase 2+

## Instructions

### Step 1: Export from M365

From M365 Copilot meeting recap, copy the full meeting summary to a new file. Save it to `docs/inbox/` with a descriptive name:

```
docs/inbox/YYYY-MM-DD-meeting-title.md
```

### Step 2: PII strip (required before processing)

> **IMPORTANT**: Do not classify or store the raw M365 content until PII has been stripped.

In Phase 2+, the inbox file-watch trigger runs the PII script automatically. Until then:

- Manually review the note for names, email addresses, phone numbers, sensitive project references
- The `.pii-rules.csv` file (user-maintained, never committed, chmod 600) contains your PII replacement rules

Replace PII hits with placeholders like `[PERSON_A]`, `[CLIENT_ORG]`, `[PROJECT_CODE]`.

### Step 3: Deduplicate

M365 meeting notes often repeat the same action items or decisions 2–3 times. Review and consolidate:

- Keep one canonical version of each action item
- Remove duplicate paragraphs
- Preserve the context/discussion around each unique point

### Step 4: Extract structured artefacts

Identify the distinct artefact types in the cleaned note:

| What you found | Artifact Type | Set in system as |
|----------------|---------------|------------------|
| Task someone needs to do | `action-item` | assignee + dueDate |
| A decision that was made | `decision` | — |
| A section of an RFI/proposal | `rfi-section` | percentDone = 0 to start |
| An overall status update | `status-report` | domain |

### Step 5: Classify each artefact

For each extracted artefact:

- Set `track: "task-bundle"`
- Set `domain` (which project area does this belong to?)
- Set `artifactType` (from table above)
- Set `status: "processed"` (after PII strip + dedup)
- Set `clientFacing: true/false`

### Step 6: Assign to dashboard

Once classified, artefacts with `artifactType: "rfi-section"` appear on the **RFI timeline** in the Status Dashboard. The `percentDone` field drives the visual progress indicators.

## M365 Note Deduplication Patterns

Common repetition patterns in M365 summaries:

- Same action item listed under multiple speakers
- Decision summary repeated in both "meeting highlights" and "action items" sections
- Agenda items reiterated as follow-up bullets

**Strategy**: Anchor on the most specific/actionable version of each item. If M365 says the same thing twice, keep the one with a named assignee or concrete due date.

## How to contribute

See [`how-to-write-recipes.md`](../how-to-write-recipes.md) for the recipe contribution guide.
