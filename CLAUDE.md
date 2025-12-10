# Cloud Posse Reference Architecture Documentation

Public documentation site published to [docs.cloudposse.com](https://docs.cloudposse.com). Built with Docusaurus.

## Content Sources

**Important:** This repo is NOT always the source of truth. Content flows from multiple sources:

| Content Type | Source of Truth | Location in This Repo |
|--------------|----------------|----------------------|
| Atmos workflows (YAML) | `refarch-scaffold/` | `examples/snippets/stacks/workflows/` |
| GitHub Action workflows | `refarch-scaffold/` | `examples/snippets/.github/workflows/` |
| Other snippets (Dockerfile, Makefile) | `refarch-scaffold/` | `examples/snippets/` |
| Component docs | `cloudposse-terraform-components/` | `docs/components/library/` (auto-generated) |
| Module docs | `cloudposse/terraform-aws-*` repos | `docs/modules/library/` (auto-generated) |
| GitHub Actions docs | `cloudposse/github-action-*` repos | `docs/github-actions/library/` (auto-generated) |
| Layer guides, tutorials | **This repo** | `docs/` |

Before editing snippets or workflows in `examples/`, verify changes should be made in `refarch-scaffold/` first.

## Quick Reference

### Development

```bash
npm install          # Install dependencies
npm start            # Start dev server (localhost:3000)
npm run build        # Production build
npm run serve        # Serve production build locally
```

### Linting

```bash
npx docusaurus-mdx-checker --cwd docs    # Check MDX syntax
make lint                                 # Same as above
```

## Redirects

**Critical:** Broken links will fail the deployment. When moving or removing pages, add redirects.

Redirects are configured in `plugins/staticRedirects/redirects/`:

| File | Purpose |
|------|---------|
| `docs.json` | General documentation redirects |
| `refarch.json` | Reference architecture path redirects |
| `deprecated.json` | Deprecated content redirects |
| `legacy_setup_docs.json` | Legacy setup documentation |
| `components-migration.json` | Component path migrations |

### Adding a Redirect

Add to the appropriate JSON file:

```json
{
  "from": "/old/path/",
  "to": "/new/path/"
}
```

### When to Add Redirects

- Moving a page to a new location
- Renaming a file (URL changes)
- Consolidating multiple pages
- Deprecating content (redirect to replacement or deprecated section)

## Fixing Broken Links

When changing a page path, you must:

1. **Update internal references** - Search for and update all links within this repo
2. **Add redirects** - Add redirect for external references

### Workflow

```bash
# 1. Find all internal references to the old path
grep -r "/old/path/" docs/

# 2. Update each reference to the new path

# 3. Add redirect for external links
# Edit plugins/staticRedirects/redirects/<appropriate>.json

# 4. Verify build passes
npm run build
```

### URL Resolution

Directory index pages follow the pattern `{dir}/{dir}.mdx`:
- File: `docs/layers/atmos-pro/atmos-pro.mdx`
- Doc ID (sidebars.js): `layers/atmos-pro/atmos-pro`
- URL (links in MDX): `/layers/atmos-pro/`

Other pages in the directory:
- File: `docs/layers/atmos-pro/setup.mdx`
- Doc ID: `layers/atmos-pro/setup`
- URL: `/layers/atmos-pro/setup/`

**Common mistake:** Using doc ID as URL. Links should use `/layers/atmos-pro/`, not `/layers/atmos-pro/atmos-pro/`

## File Structure

```
docs/
├── docs/                    # Documentation content
│   ├── intro/              # Getting started
│   ├── quickstart/         # DIY quickstart
│   ├── jumpstart/          # Cloud Posse engagement guides
│   ├── learn/              # Learning resources
│   ├── layers/             # Reference architecture layers
│   ├── components/         # Terraform components (auto-generated)
│   ├── modules/            # Terraform modules (auto-generated)
│   ├── github-actions/     # GitHub Actions (auto-generated)
│   └── ...
├── examples/
│   └── snippets/           # From refarch-scaffold
│       ├── .github/workflows/   # GitHub Action workflow examples
│       └── stacks/workflows/    # Atmos workflow examples
├── plugins/
│   └── staticRedirects/    # Redirect configuration
│       └── redirects/      # JSON redirect files
├── src/
│   ├── components/         # React components for MDX
│   └── css/               # Stylesheets
├── scripts/
│   └── docs-collator/     # Python scripts for rendering library docs
├── static/                # Static assets
├── sidebars.js           # Navigation structure
└── docusaurus.config.js  # Site configuration
```

## Documentation Patterns

### MDX Files

All documentation uses MDX (Markdown + JSX). Standard frontmatter:

```mdx
---
title: "Page Title"
sidebar_label: "Sidebar Label"
description: Short description for SEO
---
```

### Deprecation Notices

Add deprecation admonitions to deprecated content (do NOT move files):

```mdx
:::warning Deprecated
This documentation describes the legacy approach using `account-map`.

**The recommended approach now uses:**
- [Atmos Auth](/layers/identity/atmos-auth) for authentication
- [Atmos Pro](/layers/atmos-pro/) for CI/CD automation

This content is preserved for users with existing deployments.
:::
```

### TODO Comments

Use structured TODO comments for tracking documentation updates:

```mdx
{/* TODO:PROJECT-NAME - ACTION - Status: Not Started|In Progress|Done */}
{/*
## Required Updates:
- Update item 1
- Update item 2
*/}
```

## Skills

See `.claude/skills/` for specialized documentation tasks:
- `docs-conventions` - Writing standards, React components, MDX patterns
- `docs-build` - Building, rendering library docs, deployment
