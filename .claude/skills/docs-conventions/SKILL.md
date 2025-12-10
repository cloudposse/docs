---
name: docs-conventions
description: Writing standards, React components, and MDX patterns for docs.cloudposse.com. Use when creating or editing documentation content.
---

# Documentation Conventions

Standards and patterns for writing documentation on docs.cloudposse.com.

## MDX Frontmatter

Every MDX file requires frontmatter:

```mdx
---
title: "Human-Readable Title"
sidebar_label: "Action-Oriented Label"
sidebar_class_name: hidden          # Optional: hide from sidebar
description: Brief description for SEO and previews
---
```

### Sidebar Labels

**IMPORTANT: Sidebar labels should be action-oriented verbs.**

| Good | Bad |
|------|-----|
| `Configure Atmos Auth` | `Atmos Auth` |
| `Deploy Roles` | `IAM Roles` |
| `Login to AWS` | `AWS Login` |
| `Setup Identity Center` | `Identity Center` |
| `Understand Identity` | `Identity Overview` |

Use verbs like: Configure, Deploy, Setup, Create, Manage, Understand, Review, Migrate

## Available React Components

Import components from `@site/src/components/`:

### Steps Component

**IMPORTANT: Always wrap lists and numbered items with the `<Steps>` component.**

For compact lists (preferred for simple items):

```mdx
import Steps from '@site/src/components/Steps';

<Steps>
  1. **First item** — Description of first item
  1. **Second item** — Description of second item
  1. **Third item** — Description of third item
</Steps>
```

For detailed step-by-step instructions with more content:

```mdx
import Steps from '@site/src/components/Steps';
import Step from '@site/src/components/Step';
import StepNumber from '@site/src/components/StepNumber';

<Steps>
  <Step>
    ### <StepNumber/> First Step Title
    Step content here with code blocks, notes, etc.
  </Step>
  <Step>
    ### <StepNumber/> Second Step Title
    More content.
  </Step>
</Steps>
```

Use the compact format for simple lists and the detailed format when steps require code blocks or extensive explanation.

### ActionCard with CTAs

For callout boxes with action buttons:

```mdx
import ActionCard from '@site/src/components/ActionCard';
import PrimaryCTA from '@site/src/components/PrimaryCTA';
import SecondaryCTA from '@site/src/components/SecondaryCTA';

<ActionCard title="What's Next?">
  Description of the next action.
  <div>
    <PrimaryCTA to="/path/to/next/">Primary Action</PrimaryCTA>
    <SecondaryCTA to="/path/to/alt/">Alternative</SecondaryCTA>
  </div>
</ActionCard>
```

### Next Steps Section (Required)

**IMPORTANT: All primary pages should end with a "Next Steps" section using ActionCard.**

The description should provide context by:
1. Acknowledging what was accomplished in the current page
2. Explaining why the next step is needed
3. Describing what the next page will cover

**Pattern:** "Now that [what was accomplished], [why the next step matters]. [What the next page covers]."

**Good examples:**

```mdx
## Next Steps

<ActionCard title="Centralize root access">
  Now that Identity Center and Permission Sets are provisioned, configure centralized root access management. This allows secure, auditable root operations on member accounts without maintaining root credentials.
  <PrimaryCTA to="/layers/identity/centralized-root-access/">Centralize Root Access</PrimaryCTA>
</ActionCard>
```

```mdx
## Next Steps

<ActionCard title="Deploy IAM roles">
  With Permission Sets available for human access, configure IAM roles for machine users. These roles enable GitHub Actions and other CI/CD systems to authenticate via OIDC.
  <PrimaryCTA to="/layers/identity/deploy/">Deploy IAM Roles</PrimaryCTA>
</ActionCard>
```

```mdx
## Next Steps

<ActionCard title="Configure authentication">
  With IAM roles deployed for machine users, configure Atmos Auth to map Permission Sets to user profiles. This enables seamless CLI authentication for your team.
  <PrimaryCTA to="/layers/identity/atmos-auth/">Configure Atmos Auth</PrimaryCTA>
</ActionCard>
```

**Bad examples (too generic):**

```mdx
{/* ❌ Too generic - doesn't explain context */}
<ActionCard title="Configure authentication">
  Learn how to configure Atmos Auth.
  <PrimaryCTA to="/layers/identity/atmos-auth/">Configure Atmos Auth</PrimaryCTA>
</ActionCard>
```

For multiple next steps, use `<div>` to wrap CTAs:

```mdx
## Next Steps

<ActionCard title="Setup Identity Center">
  Start by configuring AWS Identity Center with your IdP and deploying Permission Sets for your team.
  <div>
    <PrimaryCTA to="/layers/identity/aws-sso/">Setup Identity Center</PrimaryCTA>
    <SecondaryCTA to="/layers/identity/how-to-log-into-aws/">How to Log into AWS</SecondaryCTA>
  </div>
</ActionCard>
```

### Other Components

| Component | Use Case |
|-----------|----------|
| `Card` / `CardGroup` | Grid of linked cards |
| `Note` | Highlighted notes |
| `Terminal` | Terminal output display |
| `File` | File content display |
| `CollapsibleText` | Expandable sections |
| `AtmosWorkflow` | Atmos workflow display |
| `TaskList` | Checkbox task lists |
| `KeyPoints` | Key takeaways |
| `PillBox` | Tag/label pills |

## Docusaurus Admonitions

Use built-in admonitions for callouts:

```mdx
:::note
Informational note.
:::

:::tip
Helpful tip.
:::

:::info
General information.
:::

:::warning
Warning about potential issues.
:::

:::danger
Critical warning - data loss, security, etc.
:::
```

## Deprecation Pattern

When deprecating content, add admonition at the top (do NOT move files):

```mdx
:::warning Deprecated
This documentation describes the legacy approach using `[old thing]`.

**The recommended approach now uses:**
- [New Thing A](/path/to/new-a) for X
- [New Thing B](/path/to/new-b) for Y

This content is preserved for users with existing deployments.
:::
```

## Code Blocks

### Basic

```mdx
```bash
atmos terraform apply vpc -s plat-ue1-dev
​```
```

### With Title

```mdx
```hcl title="components/terraform/vpc/main.tf"
module "vpc" {
  source = "..."
}
​```
```

### With Line Highlighting

```mdx
```hcl {2-4}
variable "enabled" {
  type        = bool
  default     = true
  description = "Whether to create resources"
}
​```
```

## Mermaid Diagrams

Mermaid is enabled for diagrams:

```mdx
```mermaid
flowchart LR
    A[Start] --> B{Decision}
    B -->|Yes| C[Action]
    B -->|No| D[End]
​```
```

## Video Embeds

```mdx
import ReactPlayer from "react-player";

<figure>
  <ReactPlayer controls url="https://docs.cloudposse.com/assets/..." />
  <figcaption>Video caption</figcaption>
</figure>
```

## Internal Links

Use absolute paths from site root:

```mdx
[Link Text](/layers/identity/how-to-log-into-aws/)
```

## TODO Comments for Tracking

Track documentation updates with structured comments:

```mdx
{/* TODO:PROJECT-NAME - ACTION - Status: Not Started|In Progress|Done */}
{/*
## Required Updates:
- Update item 1
- Update item 2
*/}
```

## Writing Style

- **Be concise**: Short sentences, clear language
- **Use active voice**: "Deploy the component" not "The component should be deployed"
- **Lead with the action**: Put commands and code first, explanations after
- **Use consistent terminology**: Follow Cloud Posse naming conventions
- **Avoid jargon**: Define terms on first use or link to glossary

## File Naming

- Use kebab-case: `how-to-deploy-vpc.mdx`
- Layer pages: `{layer-name}.mdx` (e.g., `identity.mdx`)
- Tutorials: `how-to-*.mdx`
- Design decisions: `design-decisions/*.mdx`
