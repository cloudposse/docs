<!--
## Sync Impact Report
- Version change: 0.0.0 → 1.0.0 (initial ratification)
- Added principles:
  - I. Content Source Fidelity
  - II. Link Integrity (NON-NEGOTIABLE)
  - III. MDX-First Content
  - IV. No File Bloat
  - V. Build Verification
- Added sections:
  - Content Standards
  - Development Workflow
  - Governance
- Templates requiring updates:
  - .specify/templates/plan-template.md — ✅ reviewed, Constitution Check section aligns with principles
  - .specify/templates/spec-template.md — ✅ reviewed, scope/requirements alignment confirmed
  - .specify/templates/tasks-template.md — ✅ reviewed, task categorization compatible
  - .specify/templates/commands/*.md — ✅ no command files present
- Follow-up TODOs: none
-->

# Cloud Posse Reference Architecture Documentation Constitution

## Core Principles

### I. Content Source Fidelity

This repo is NOT always the source of truth. Content flows from multiple upstream sources:

- Atmos workflows and GitHub Action workflows originate in `refarch-scaffold/`
- Component docs are auto-generated from `cloudposse-terraform-components/`
- Module docs are auto-generated from `cloudposse/terraform-aws-*` repos
- GitHub Actions docs are auto-generated from `cloudposse/github-action-*` repos
- Only layer guides, tutorials, and editorial content are authored directly in this repo

All contributors MUST verify the correct source of truth before making changes.
Before editing snippets or workflows in `examples/`, changes MUST be made in the
upstream source first. Auto-generated content MUST NOT be modified in-place; changes
MUST flow through the generation pipeline from the upstream repository.

### II. Link Integrity (NON-NEGOTIABLE)

Broken links fail the deployment build. Every page move, rename, or removal MUST include:

1. Updated internal references — grep and fix all links within the repo
2. Redirect entries in `plugins/staticRedirects/redirects/` for external references
3. Verification that `npm run build` passes without broken link errors

URL conventions MUST be followed:
- Directory index pages use the `{dir}/{dir}.mdx` pattern
- Links MUST use `/layers/foo/`, not `/layers/foo/foo/`
- Doc IDs (used in `sidebars.js`) differ from URLs — never use a doc ID as a link target

### III. MDX-First Content

All documentation uses MDX (Markdown + JSX). Content MUST:

- Include proper frontmatter with `title`, `sidebar_label`, and `description` fields
- Use project React components from `src/components/` for interactive elements
- Pass the MDX linter: `npx docusaurus-mdx-checker --cwd docs`
- Be structured for business stakeholders and DevOps practitioners, not framework internals
- Avoid implementation-level details unless documenting specific technical procedures

### IV. No File Bloat

Contributors MUST prefer editing existing files over creating new ones. Documentation
files (`.md`, `.mdx`) MUST NOT be created unless explicitly required by the task.
Features, refactors, and improvements beyond what was requested MUST NOT be added.
Snippets and examples SHOULD reference upstream sources rather than duplicating content.

### V. Build Verification

Every change MUST be verifiable with `npm run build`. The production build is the
final gatekeeper — if it fails, the change MUST NOT ship. For UI or frontend changes,
contributors MUST run `npm start` and verify behavior in a browser before reporting
completion. Type checking and test suites verify code correctness, not feature
correctness — visual and functional verification is required.

## Content Standards

Redirect configuration lives in `plugins/staticRedirects/redirects/` and is split
across purpose-specific files:

- `docs.json` — general documentation redirects
- `refarch.json` — reference architecture path redirects
- `deprecated.json` — deprecated content redirects
- `legacy_setup_docs.json` — legacy setup documentation
- `components-migration.json` — component path migrations

Navigation structure is defined in `sidebars.js`. Site configuration lives in
`docusaurus.config.js`. Static assets are stored in `static/`. Python scripts in
`scripts/docs-collator/` handle rendering auto-generated library docs from upstream
repositories.

## Development Workflow

Local development:

- `npm install` — install dependencies
- `npm start` — start dev server at localhost:3000
- `npm run build` — production build
- `npm run serve` — serve production build locally

Validation:

- `make lint` or `npx docusaurus-mdx-checker --cwd docs` — MDX syntax validation
- `npm run build` — full build verification including link checking

Pull requests MUST target the `master` branch.

## Governance

This constitution supersedes ad-hoc documentation practices. All pull requests
MUST verify compliance with the following gates before merge:

1. No broken links introduced
2. Redirects added for any moved or removed pages
3. MDX linter passes
4. Content authored in the correct source of truth (auto-generated content not modified)
5. Production build succeeds (`npm run build`)

Amendments to these principles require:

- Written documentation of the proposed change
- Team review and approval
- Version increment of this constitution
- Update of any dependent templates or guidance that reference changed principles

**Version**: 1.0.0 | **Ratified**: 2026-04-15 | **Last Amended**: 2026-04-15
