# Claude Skills

This directory contains skills that provide Claude with detailed guidance for specific tasks. Skills are automatically
invoked based on their descriptions when relevant to your request.

## Available Skills

| Skill                   | Description                                                                             |
| ----------------------- | --------------------------------------------------------------------------------------- |
| `developing-components` | Creating new Terraform components, modifying existing ones, setting up catalog defaults |
| `developing-stacks`     | Deploying components via Atmos, configuring stacks, inheritance patterns                |
| `atmos-auth`            | Authenticating with AWS via Atmos, SSO login, troubleshooting permission errors         |
| `atmos-functions`       | Wiring cross-component dependencies with `!terraform.state` or `!terraform.output`      |
| `debugging-atmos`       | Troubleshooting Atmos errors, inspecting resolved configuration with `describe stacks`  |
| `account-map-migration` | Removing account-map dependencies, using static account mappings, bypass pattern        |

## How Skills Work

Skills are **model-invoked** - Claude automatically decides when to use them based on:

1. The skill's `description` field in the YAML frontmatter
2. The context of your request

You don't need to explicitly invoke skills. Just describe what you're trying to do and Claude will use the relevant
skill if applicable.

## Skill Structure

Each skill is a directory containing a `SKILL.md` file:

```
skills/
├── skill-name/
│   └── SKILL.md
```

The `SKILL.md` file has YAML frontmatter with `name` and `description`, followed by detailed instructions in Markdown.

## Adding New Skills

1. Create a new directory under `.claude/skills/`
2. Add a `SKILL.md` file with frontmatter:
   ```yaml
   ---
   name: skill-name
   description: >-
     Brief description of what this skill does and when to use it. Include trigger words that would indicate this skill
     is relevant.
   ---
   ```
3. Add detailed instructions in Markdown
4. Update `CLAUDE.md` to reference the new skill in the Skills table

## References

- [Claude Code Skills Documentation](https://code.claude.com/docs/en/skills)
