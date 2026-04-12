# AGENTS.md — SOW Knowledge Base Onboarding Guide
/ #ToDo create a template for #foam-templates based on this @AGENTS.md  and create an agent onboarding template for project managememt activity reports (i.e. end of day, mid-day,continuous updates, post-meeting, start of day, weekly, priority)
## Project-tree

project-files/
├── 00_indexes/
│   ├── project_file_navigation_index.md
│   └── project_file_navigation_index.txt
│
├── 01_system_and_orchestration/
│   ├── system-instruction.txt
│   ├── first-ask.prompt.md
│   ├── create-agentsmd-prompt.md.prompt.txt
│   └── AGENT.md Creation Guide.txt
│
├── 02_section_prompts/
│   ├── 1.1-summary-prompt.txt
│   ├── 1.2_Inscope_Services.txt
│   ├── 1.3_OutofScopeServices.txt
│   ├── 1.4_ClientDependencies_and_Inputs.txt
│   ├── 1.6_ProjectAssumptions.txt
│   ├── 2_Deliverables_prompt.txt
│   ├── 2.1_DeliverablesAcceptanceCriteria_prompt.txt
│   ├── 3_PricingModelandFees_prompt.txt
│   └── Section4_Roles-and-responsibilities.txt
│
├── 03_sow_core_docs/
│   ├── SOW_Currentdraft01-04-deIID.txt
│   └── strategy & consulting operating manual to upload to chatgpt_v3.docx
│
├── 04_reference_decks_and_playbooks/
│   ├── 05-01_e2open_Sales&Solutioning_Proposal Template_SI_V1.1.pptx
│   ├── deploy 01 - deployment playbook.pptx
│   └── session 04 - workplanning and dependency management v1.2.pptx
│
└── 05_csv_data_and_mappings/
    ├── 05a_methods_and_approaches/
    │   └── adm-methods-approaches.csv
    │
    ├── 05b_workpackage_and_scope_mapping/
    │   ├── proposalareas-risks-assumptions.csv
    │   ├── proposalsummaryworkpackages.csv
    │   └── workpackages_heatmap.csv
    │
    ├── 05c_role_mapping/
    │   ├── resource-profile-roles-validated.csv
    │   ├── resourceprofile-deiid.csv
    │   ├── roles-draft-targets.csv
    │   └── roles-list-official-source.csv
    │
    └── 05d_crosswalk_notes/
        └── [reserved for future derived mapping files]

## Purpose
This workspace is a document-first operating environment for generating, reviewing, repairing, and assembling contract-ready Statements of Work (SOWs) and adjacent consulting outputs. Treat it as a knowledge base for SOW orchestration, proposal support, workplanning, role mapping, and milestone-based delivery design.

This file is written to onboard an agent seeing the workspace for the first time and to reduce unnecessary searching. Trust this file first, then the project index, and only search further when these instructions are incomplete or the task needs deeper evidence.

---

## Start-of-Conversation Warm Start
At the start of every new conversation, do this in order:

1. Read `AGENTS.md`.
2. Read `MEMENTO.md` for recent working context and lessons learned.
3. Read `project_file_navigation_index.txt`.
4. Return a short orientation before doing substantive work:
   - source of truth for narrative
   - source of truth for numbers / mappings
   - what is missing or unclear
   - a short file index the user can refer to by name
5. If the task is SOW-related, read `system-instruction.txt` and only the section prompt files needed for that task.
6. If the task is workflow or operating-pattern related, read `enterprise_chatgpt_8_workflows_guide_v2.txt`.
7. If the task is proposal or solutioning related, use the proposal deck and playbooks as references, but do not treat them as contractual source of truth.

---

## Workspace Profile
- Current workspace type: document and dataset pack, not a runnable software repository.
- Main artifact types present: text prompts, one Markdown prompt, CSV mappings, PowerPoint decks, one Word document, and one live SOW draft.
- The pack is organized around a SOW meta-architecture:
  - orchestration instructions
  - section-specific prompts
  - a live SOW draft
  - reference decks and playbooks
  - CSV datasets for workpackages, risks, roles, and staffing
- The operating model is contract-first: services, deliverables, acceptance, pricing, and section boundaries matter more than polished prose.

Important: with the currently uploaded materials, do not assume there is a build, test, lint, or CI pipeline. Validate outputs through source-of-truth checks, section rules, and cross-section consistency instead.

---

## Short Knowledge Base Index
Use this as the default routing map.

### Core orchestration and rules
- `system-instruction.txt` — master SOW orchestration rules, generation order, template assembly order, and optional section inclusion logic.
- `create-agentsmd-prompt.md.prompt.txt` — design brief for what AGENTS.md must cover.
- `AGENT.md Creation Guide.txt` — prior project-specific baseline for SOW-agent onboarding.
- `first-ask.prompt.md` — clarification-first workflow; useful when the task is ambiguous.

### Current working artifact
- `SOW_Currentdraft01-04-deIID.txt` — live working draft of the Modern Airline Retailing SOW; use for current narrative, existing section text, and known structural issues.

### Section prompt library
- `1.1-summary-prompt.txt` — summary rules
- `1.2_Inscope_Services.txt` — in-scope structure and verb-led mapping
- `1.3_OutofScopeServices.txt` — exclusions and boundary setting
- `1.4_ClientDependencies_and_Inputs.txt` — tangible client inputs only
- `1.6_ProjectAssumptions.txt` — measurable, change-triggering assumptions
- `2_Deliverables_prompt.txt` — deliverable definition rules
- `2.1_DeliverablesAcceptanceCriteria_prompt.txt` — objective acceptance criteria
- `3_PricingModelandFees_prompt.txt` — pricing model alignment
- `Section4_Roles-and-responsibilities.txt` — governance-level accountability only

### Data, mapping, and role evidence
- `proposalsummaryworkpackages.csv` — core scope / task / workpackage summary
- `workpackages_heatmap.csv` — milestone and ownership heatmap
- `proposalareas-risks-assumptions.csv` — risks and assumptions by area
- `adm-methods-approaches.csv` — methods, deliverables, and milestone applicability crosswalk
- `resourceprofile-deiid.csv` — milestone-based staffing profile
- `resource-profile-roles-validated.csv` — validated role definitions
- `roles-list-official-source.csv` — official role catalogue
- `roles-draft-targets.csv` — draft target role mapping

### Examples and reference decks
- `05-01_e2open_Sales&Solutioning_Proposal Template_SI_V1.1.pptx` — best reference deck for proposal and solutioning patterns, workplans, governance, testing, deployment, and change management.
- `deploy 01 - deployment playbook.pptx` — deployment reference deck.
- `session 04 - workplanning and dependency management v1.2.pptx` — workplanning and dependency reference deck.
- `strategy & consulting operating manual to upload to chatgpt_v3.docx` — broader consulting operating context.
- `enterprise_chatgpt_8_workflows_guide_v2.txt` — reusable consulting workflow operating system.

---

## Short Filetree
```text
project-files/
├── 00_indexes/
│   └── project_file_navigation_index.txt
├── 01_system_and_orchestration/
│   ├── system-instruction.txt
│   ├── first-ask.prompt.md
│   ├── create-agentsmd-prompt.md.prompt.txt
│   └── AGENT.md Creation Guide.txt
├── 02_section_prompts/
│   ├── 1.1-summary-prompt.txt
│   ├── 1.2_Inscope_Services.txt
│   ├── 1.3_OutofScopeServices.txt
│   ├── 1.4_ClientDependencies_and_Inputs.txt
│   ├── 1.6_ProjectAssumptions.txt
│   ├── 2_Deliverables_prompt.txt
│   ├── 2.1_DeliverablesAcceptanceCriteria_prompt.txt
│   ├── 3_PricingModelandFees_prompt.txt
│   └── Section4_Roles-and-responsibilities.txt
├── 03_sow_core_docs/
│   ├── SOW_Currentdraft01-04-deIID.txt
│   └── strategy & consulting operating manual to upload to chatgpt_v3.docx
├── 04_reference_decks_and_playbooks/
│   ├── 05-01_e2open_Sales&Solutioning_Proposal Template_SI_V1.1.pptx
│   ├── deploy 01 - deployment playbook.pptx
│   └── session 04 - workplanning and dependency management v1.2.pptx
└── 05_csv_data_and_mappings/
    ├── 05a_methods_and_approaches/
    │   └── adm-methods-approaches.csv
    ├── 05b_workpackage_and_scope_mapping/
    │   ├── proposalareas-risks-assumptions.csv
    │   ├── proposalsummaryworkpackages.csv
    │   └── workpackages_heatmap.csv
    └── 05c_role_mapping/
        ├── resource-profile-roles-validated.csv
        ├── resourceprofile-deiid.csv
        ├── roles-draft-targets.csv
        └── roles-list-official-source.csv
```

---

## Source-of-Truth Hierarchy
Use this hierarchy whenever files conflict.

1. `system-instruction.txt`
   - Master rulebook for SOW generation order, assembly order, conditional sections, placeholders, and cross-section validation.
2. Relevant section prompt file(s)
   - Governs how a specific section must be written.
3. `SOW_Currentdraft01-04-deIID.txt`
   - Current state of the client artifact and the closest thing to live narrative truth.
4. Structured CSV datasets
   - Source of truth for workpackages, milestone applicability, roles, and staffing.
5. `project_file_navigation_index.txt`
   - Routing and association index; use to find the right files quickly.
6. Reference decks and playbooks
   - Good for examples, sequencing, and terminology, but not final contractual authority.
7. `AGENT.md Creation Guide.txt`
   - Historical baseline; useful, but subordinate to `system-instruction.txt` and the current draft.

If facts are still unclear after reading the files above, surface the gap explicitly. Do not invent dates, rates, deliverables, client facts, or ownership.

---

## Default Operating Pattern
Use this pattern unless the user explicitly asks for something else.

### 1. Orient first
- Identify the task type:
  - SOW drafting
  - SOW review / critique
  - deliverable repair
  - pricing / role mapping
  - proposal or deck support
  - PMO / workplanning / RAID reporting
  - change management definition or milestone design
- Confirm the source of truth for narrative and numbers before drafting.

### 2. Load only the relevant files
- For SOW section work, do not open everything. Load the master instruction, current draft, and only the section prompts needed.
- For staffing or role work, add the relevant CSVs.
- For deck or workplanning tasks, add the proposal deck, workflow guide, and playbook deck(s).

### 3. Draft in dependency order
For SOW work, generate logically in this order even if the final document assembles differently:
1. Summary
2. In Scope Services
3. Out of Scope Services
4. Client Dependencies and Inputs
5. Project Assumptions
6. Deliverables
7. Deliverable Acceptance Criteria
8. Pricing
9. Roles and Responsibilities
10. Optional technical sections if applicable

### 4. Validate before finalizing
Always check:
- Scope -> Deliverables -> Acceptance -> Pricing traceability
- no responsibilities hidden inside scope
- no dependencies that are actually responsibilities
- no assumptions that are actually exclusions
- no deliverables that are really activities
- no new scope introduced by acceptance criteria
- no unpriced in-scope work

### 5. Only then assemble or export
- Preserve template order and numbering.
- Use placeholders like `[REQUIRED]` or `[TBC]` instead of fabricating missing facts.
- Prefer concise, contract-ready wording.

---

## Core SOW Rules
These rules are non-negotiable in this workspace.

### Contract-first rules
- Services, not outcomes.
- No guarantees, promises of success, or implied business results.
- Keep supplier obligations bounded and testable.

### Section separation rules
- Scope != Responsibilities
- Dependencies != Responsibilities
- Assumptions != Dependencies
- Out of Scope != Responsibilities
- Deliverables != Activities
- Acceptance != New Scope

### Deliverable rules
- Every deliverable must be tangible.
- Every deliverable must have a testable description.
- Every deliverable must map back to in-scope activity.
- Every deliverable should be independently reviewable for acceptance.

### Pricing rules
- Pricing model must match the delivery model.
- No orphan deliverables or activities without commercial treatment.
- For capacity-based work, align fees to resource profile, rate card, and change-control mechanism.

### Language rules
Prefer:
- define
- develop
- prepare
- conduct
- configure
- coordinate
- document
- review

Avoid unless tightly qualified:
- support
- assist
- ensure
- optimize
- guarantee
- drive outcomes

---

## Workflow Routing Guide
Use the workflow guide deliberately.

### If the task is messy or ambiguous
Use `first-ask.prompt.md` and refine before drafting.

### If the task is a consulting workflow rather than a SOW section
Use `enterprise_chatgpt_8_workflows_guide_v2.txt`.
Typical mappings:
- Problem framing and workplan design -> scope shaping, milestone framing, workstream planning
- Research, analysis, and synthesis -> draft review, insight synthesis, current-state assessment
- Storyline, memo, and deck drafting -> proposal sections, solutioning narratives, executive summaries
- Program reporting, RAID, and decisions -> PMO outputs, RAID cleanup, decision logs
- Proposal, POV, and account growth -> proposal blocks, meeting prep, pursuit narratives
- Technology investment profile and rationalization -> application portfolio and role/staffing analysis

### If the task needs proposal or delivery examples
Use the e2open proposal deck first. It contains reference patterns for:
- transformation framing
- phased delivery
- project governance
- testing and deployment
- training and change management
- team structure and commercials

---

## Validation in This Workspace
Because this is not currently a buildable code repository, validation is document-based.

### Always validate against
- `system-instruction.txt`
- relevant section prompt files
- `SOW_Currentdraft01-04-deIID.txt`
- the relevant CSV datasets
- the template-aware structure implied by the current SOW draft

### Consider the output acceptable only when
- wording is contract-ready
- section boundaries are clean
- traceability is intact
- placeholders are used honestly for missing data
- terminology is consistent across sections
- milestone logic is coherent

### If you need stronger confidence
- cross-check the current draft against the workpackage and heatmap CSVs
- cross-check roles against validated role files
- cross-check milestone or change activities against the proposal deck and workflow guide

---

## Practical File Usage Notes
- `project_file_navigation_index.txt` is the fastest routing artifact in the workspace. Read it early.
- Use the current draft for what is already written, not for what is necessarily correct.
- Use the section prompt files to repair the draft, not merely to summarize it.
- Use CSVs to ground structure, coverage, staffing, and milestone logic.
- Use decks to improve framing and delivery sequencing, not to override contractual rules.
- If a slide deck appears hard to parse, treat it as a supporting reference, not a required blocker.

---

## Recent Working Context Snapshot
Load this context at the beginning of related conversations.

- The active artifact is the MAR SOW draft.
- Recent user requests focused on:
  - reviewing the current draft structurally
  - defining change-management terms
  - repairing Business Enablement deliverables
  - clarifying milestone-based deliverable approaches
- Current pain points in the draft have centered on:
  - broken traceability from scope to deliverables to pricing
  - responsibilities mixed into scope
  - dependencies written as programme conditions instead of tangible inputs
  - vague or incomplete deliverable definitions
  - overly generic acceptance logic
  - unclear milestone cadence for Business Enablement outputs
- The user prefers direct, practical, artifact-specific help over generic next-step suggestions.

Read `MEMENTO.md` for fuller recent-context notes before continuing similar work.

---

## Instruction Priority
If there is a conflict, use this order:
1. Direct user instruction
2. `system-instruction.txt`
3. Relevant section prompt
4. `AGENTS.md`
5. `MEMENTO.md`
6. Reference decks, playbooks, and historical guides

If the instructions in this file are incomplete or clearly wrong for the current task, say so and then inspect the next-most-relevant source.

