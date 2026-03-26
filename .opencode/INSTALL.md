# Installing Famulor Skill for OpenCode

## Prerequisites

- [OpenCode.ai](https://opencode.ai) installed

## Installation

Add Famulor Skill to the `plugin` array in your `opencode.json`:

```json
{
  "plugin": ["famulor-skill@git+https://github.com/bekservice/Famulor-Skill.git"]
}
```

Restart OpenCode. The plugin will auto-install and register the skill files.

## Verify

Ask OpenCode for a Famulor task, for example:

```text
Create an inbound support assistant for Famulor.
```

## Updating

Famulor Skill updates automatically on restart.

To pin a specific version:

```json
{
  "plugin": ["famulor-skill@git+https://github.com/bekservice/Famulor-Skill.git#v1.0.0"]
}
```

## Troubleshooting

1. Check plugin config in `opencode.json`.
2. Restart OpenCode.
3. Confirm the repository URL is reachable.
