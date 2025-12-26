# Documentation Versioning

This document describes how to create a new versioned snapshot of the documentation.

## When to Create a Version

Create a new version when making a major release (e.g., v1, v2, v3). This preserves the documentation state at that point in time, allowing users to access historical documentation.

## Prerequisites

- Node.js installed (check `.nvmrc` for required version)
- npm dependencies installed (`npm ci`)

## Steps to Create a New Version

### 1. Determine the Version Name

Use a simple version identifier like `v1`, `v2`, etc. This will be used in folder names and configuration.

### 2. Create the Versioned Docs Directory

Copy the current `docs/` directory to a versioned directory:

```bash
VERSION="v2"  # Replace with your version
mkdir -p "versioned_docs/version-${VERSION}"
cp -r docs/* "versioned_docs/version-${VERSION}/"
```

### 3. Create the Versioned Sidebar

Export the current sidebar configuration to JSON format:

```bash
VERSION="v2"  # Replace with your version
mkdir -p versioned_sidebars
node -e "const s = require('./sidebars.js'); console.log(JSON.stringify(s, null, 2));" > "versioned_sidebars/version-${VERSION}-sidebars.json"
```

### 4. Update versions.json

Add the new version to `versions.json`. The order matters - newer versions should come first:

```json
["v2", "v1"]
```

If `versions.json` doesn't exist, create it:

```bash
VERSION="v2"
echo "[\"$VERSION\"]" > versions.json
```

Or if it already exists, prepend the new version:

```bash
VERSION="v2"
jq --arg v "$VERSION" '. = [$v] + .' versions.json > versions.json.tmp && mv versions.json.tmp versions.json
```

### 5. Update docusaurus.config.js

Add the new version to the `versions` configuration in `docusaurus.config.js`:

```javascript
docs: {
  // ... other config
  versions: {
    current: {
      label: 'Latest',
      path: '',
    },
    v2: {
      label: 'v2',
      path: 'v2',
    },
    v1: {
      label: 'v1',
      path: 'v1',
    },
  },
},
```

### 6. Verify the Build

Run a local build to ensure everything works:

```bash
npm run build
```

### 7. Commit the Changes

Commit all the new versioned files:

```bash
git add versions.json versioned_docs/ versioned_sidebars/ docusaurus.config.js
git commit -m "docs: create version ${VERSION}"
```

## File Structure

After creating a version, you should have:

```
├── docs/                              # Current (latest) documentation
├── versioned_docs/
│   ├── version-v1/                    # v1 documentation snapshot
│   └── version-v2/                    # v2 documentation snapshot
├── versioned_sidebars/
│   ├── version-v1-sidebars.json       # v1 sidebar configuration
│   └── version-v2-sidebars.json       # v2 sidebar configuration
├── versions.json                      # List of all versions
└── docusaurus.config.js               # Version labels and paths
```

## Notes

- The `version-` prefix is required by Docusaurus for versioned directories and sidebar files
- The version dropdown will appear in the navbar automatically once versions are configured
- Users can switch between versions using the dropdown
- Links within versioned docs remain relative to that version
