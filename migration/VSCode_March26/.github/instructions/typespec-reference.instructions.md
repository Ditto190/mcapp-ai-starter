---
name: TypeSpec Reference Scoped Guidelines
description: Scoped build and test guidance for the `typespec-reference` subtree in this consolidated workspace
applyTo: "typespec-reference/**"
---

# TypeSpec Reference Scoped Instructions

These instructions apply only to files under `typespec-reference/`.

## Scope and intent

- Treat `typespec-reference` as a preserved upstream subtree inside this consolidated workspace.
- Keep root workspace conventions as the default outside this subtree.
- Do not assume TypeSpec-specific commands apply to unrelated folders.

## Build and test expectations (TypeSpec subtree)

- Use `pnpm` for TypeSpec subtree package operations.
- Preferred validation commands in `typespec-reference` context:
  - `pnpm install`
  - `pnpm build`
  - `pnpm test`
  - `pnpm format:check`
  - `pnpm lint`

## Change discipline

- Keep changes in `typespec-reference` minimal and targeted.
- Prefer adapting TypeSpec workflows/config for local consolidation rather than copying upstream automation verbatim.
- Before deleting any preserved upstream config, ensure an equivalent root-level policy/workflow exists if still needed.

## Safety notes

- Do not run branch-creation or auto-push automation copied from upstream workflows in local consolidation by default.
- Keep nested `.github` artifacts as reference until explicit approval is given to remove them.
