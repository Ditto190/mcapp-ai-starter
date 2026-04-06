# Extraction Summary

This folder contains non-destructive copies of `.github` artifacts extracted for consolidation review.

| Source | Extraction Copy | Size (bytes) | Notes |
| --- | --- | ---: | --- |
| `.github/agents/typescript-mcp-expert.agent.md` | `extractions/.github/agents/typescript-mcp-expert.agent.md` | 620 | Root canonical agent definition copied for review context. |
| `.github/agents/python-mcp-expert.agent.md` | `extractions/.github/agents/python-mcp-expert.agent.md` | 621 | Root canonical agent definition copied for review context. |
| `.github/agents/task-planner.agent.md` | `extractions/.github/agents/task-planner.agent.md` | 677 | Root canonical agent definition copied for review context. |
| `.github/agents/n8n-workflow-expert.agent.md` | `extractions/.github/agents/n8n-workflow-expert.agent.md` | 572 | Root canonical agent definition copied for review context. |
| `.github/agents/example.agent.md` | `extractions/.github/agents/example.agent.md` | 12298 | Root canonical agent definition copied for review context. |
| `typespec-reference/.github/workflows/ci.yml` | `extractions/typespec-reference/.github/workflows/ci.yml` | 1079 | Nested CI workflow using local composite setup action. |
| `typespec-reference/.github/workflows/merge-release-in-main.yml` | `extractions/typespec-reference/.github/workflows/merge-release-in-main.yml` | 1384 | Warning: creates branches and pushes to origin. |
| `typespec-reference/.github/workflows/website-gh-pages.yml` | `extractions/typespec-reference/.github/workflows/website-gh-pages.yml` | 1185 | Deploys website to GitHub Pages. |
| `typespec-reference/.github/workflows/consistency.yml` | `extractions/typespec-reference/.github/workflows/consistency.yml` | 3241 | Runs changelog, spellcheck, format, lint, and version checks. |
| `typespec-reference/.github/workflows/external-integration.yml` | `extractions/typespec-reference/.github/workflows/external-integration.yml` | 3361 | Runs Azure integration and specs validation workflows. |
| `typespec-reference/.github/workflows/commenter.yml` | `extractions/typespec-reference/.github/workflows/commenter.yml` | 1047 | Posts PR comments from Consistency artifacts. |
| `typespec-reference/.github/workflows/codeql.yml` | `extractions/typespec-reference/.github/workflows/codeql.yml` | 3043 | Runs CodeQL analysis. |
| `typespec-reference/.github/workflows/verify-labels.yml` | `extractions/typespec-reference/.github/workflows/verify-labels.yml` | 561 | Verifies label sync configuration. |
| `typespec-reference/.github/workflows/sync-labels.yml` | `extractions/typespec-reference/.github/workflows/sync-labels.yml` | 605 | Syncs GitHub labels on schedule and push. |
| `typespec-reference/.github/actions/setup/action.yml` | `extractions/typespec-reference/.github/actions/setup/action.yml` | 454 | Composite action that installs pnpm and sets up Node. |
| `typespec-reference/.github/dependabot.yml` | `extractions/typespec-reference/.github/dependabot.yml` | 680 | Dependabot configuration for nested repo. |
| `typespec-reference/.github/CODEOWNERS` | `extractions/typespec-reference/.github/CODEOWNERS` | 2604 | Nested repo ownership rules. |
| `typespec-reference/.github/copilot-instructions.md` | `extractions/typespec-reference/.github/copilot-instructions.md` | 6762 | Nested repo Copilot instructions. |

## Review Notes

- `typespec-reference/.github/workflows/merge-release-in-main.yml` performs `git checkout -b` and `git push --set-upstream origin`; keep this as review-only unless explicitly approved.
- Root `.github` remains canonical. These copies are for comparison and approval before any nested `.github` removal.
