# PII Rules Guide

The `.pii-rules.csv` file is the user-maintained PII (Personally Identifiable Information) blocklist that prevents sensitive data from entering the knowledge management system.

---

## Why this file exists

Meeting notes, especially from M365 Copilot, frequently contain:

- Real names of colleagues, clients, and third parties
- Organisation names under NDA or confidentiality agreements
- Project codes, pricing details, and sensitive commercial information
- Email addresses, phone numbers, and reference identifiers

The `.pii-rules.csv` replacement pass runs **before** any note is stored, classified, or passed to any AI model.

---

## File format

The file uses standard CSV format:

```csv
pattern,replacement,type
John Smith,[PERSON_A],literal
jane.doe@example.com,[EMAIL_A],literal
Acme Corp,[CLIENT_ORG_A],literal
Project[- ]Alpha,[PROJECT_A],regex
```

| Column | Description |
|--------|-------------|
| `pattern` | The text to match (literal string or regex) |
| `replacement` | The placeholder to substitute (e.g., `[PERSON_A]`, `[CLIENT_B]`) |
| `type` | `literal` for exact match, `regex` for regular expression |

---

## File location and permissions

```bash
# Create the file (you manage this — agents must not read it):
touch /home/wsl-vm/projects/foam-modme/.pii-rules.csv
chmod 600 /home/wsl-vm/projects/foam-modme/.pii-rules.csv
```

> **Security**: `chmod 600` makes the file readable and writable only by the file owner. VS Code, GitHub Copilot agents, A.D.A.M., and any other process running as a different user cannot read it.

---

## Agent access restriction

This file is intentionally agent-unreadable. The following rules are enforced:

1. **`.gitignore`**: `.pii-rules.csv` is listed — it is never committed to version control
2. **`AGENTS.md` APM_RULES**: Explicitly states agents must NOT attempt to read `.pii-rules.csv`
3. **File permissions**: `chmod 600` restricts access to the file owner
4. **Design principle**: The PII script is the only process that reads this file; it runs in an isolated, non-agent execution context

---

## How the replacement works (Phase 2+)

The ingestion pipeline runs:

```typescript
// scripts/strip-pii.ts (Phase 2+)
// Reads .pii-rules.csv and applies replacements to input text
// Returns the sanitised string without revealing the PII rules
```

For Phase 1, manual review and replacement is required before ingesting notes.

---

## Maintaining your PII rules

Suggested workflow:

1. After each new project or client engagement begins, add their names/orgs to the CSV
2. Use consistent placeholder naming: `[PERSON_A]`, `[PERSON_B]`, `[CLIENT_ORG_A]`, `[PROJECT_A]`
3. Prefer regex patterns for email addresses and phone numbers
4. Review and rotate placeholders when projects close

---

## Do not share this file

- Never commit `.pii-rules.csv` to any repository
- Never paste contents into AI chat interfaces
- Never include it in documentation or screenshots
- Keep it at `chmod 600` at all times
