# Famulor.io Skill

Famulor.io skill for AI agents to build and manage assistants, campaigns, knowledge bases, and messaging workflows directly through the Famulor API.

## What This Skill Does

This skill connects an agent directly to the Famulor platform so it can execute tasks, not just explain them:

- Create and configure AI assistants (inbound, outbound, chat, WhatsApp)
- Set up outbound campaigns and manage leads
- Connect knowledge bases and documents
- Create mid-call tools (HTTP tools) for live integrations
- Run WhatsApp and SMS workflows
- Support testing and iterative prompt/voice optimization

## When To Use This Skill

Use this skill when users ask about topics like:

- "Famulor", "famulor.io", "assistant setup", "phone bot"
- Campaigns, leads, outbound calling
- WhatsApp bots, WhatsApp templates, SMS sending
- Knowledge bases, RAG documents, webhooks
- Famulor API integrations

## Requirements

- A valid API key as an environment variable:

```bash
export FAMULOR_API_KEY="your-api-key"
```

- Create your API key at [https://app.famulor.de](https://app.famulor.de) in the API Keys section.

## How It Works

From the first user request, the agent can use this skill to:

- understand the target workflow (assistant, campaign, messaging, or knowledge base)
- load valid Famulor options (models, voices, languages, senders)
- create or update resources through real API calls
- run tests and iterate prompts/settings based on outcomes

## Installation

Installation differs by platform.

### Cursor

In Cursor Agent chat:

```text
/add-plugin https://github.com/bekservice/Famulor-Skill
```

If your workspace setup does not support direct URL plugin install, import `famulor.skill` manually and restart the chat session.

### Codex

Tell Codex:

```text
Fetch and follow instructions from https://raw.githubusercontent.com/bekservice/Famulor-Skill/refs/heads/main/.codex/INSTALL.md
```

### OpenCode

Tell OpenCode:

```text
Fetch and follow instructions from https://raw.githubusercontent.com/bekservice/Famulor-Skill/refs/heads/main/.opencode/INSTALL.md
```

### Gemini CLI

```bash
gemini extensions install https://github.com/bekservice/Famulor-Skill
```

To update:

```bash
gemini extensions update famulor-skill
```

### Universal Manual Installation (Fallback)

1. Download `famulor.skill` from this repository.
2. Import/register it in your coding agent as a custom skill/plugin.
3. Restart the agent session.
4. Set `FAMULOR_API_KEY`.
5. Ask the agent to do a Famulor task.

## Local Developer Quickstart

1. Download or clone this repository.
2. Ensure Python 3.10+ is installed.
3. Set your API key:

```bash
export FAMULOR_API_KEY="your-api-key"
```

4. Run a first check:

```bash
python3 scripts/famulor_client.py list_assistants
```

If your key is valid, you should get a JSON response from the API.

## Verify Installation

Use these checks to confirm everything is working:

- `echo $FAMULOR_API_KEY` returns a non-empty value
- `python3 scripts/famulor_client.py list_assistants` returns API data
- No `401 Unauthorized` error appears

## Skill Structure

- `SKILL.md` - Main instructions for the agent
- `references/api_reference.md` - Endpoint and field reference
- `scripts/famulor_client.py` - Python client with API methods
- `scripts/example.py` - Example usage
- `templates/example_template.txt` - Prompt/template example
- `famulor.skill` - Packaged skill archive built from the source files above
- `.cursor-plugin/plugin.json` - Cursor plugin metadata
- `.codex/INSTALL.md` - Codex installation guide
- `.opencode/INSTALL.md` - OpenCode installation guide
- `.claude-plugin/plugin.json` - Claude plugin metadata
- `gemini-extension.json` and `GEMINI.md` - Gemini extension metadata and context

## Example Workflows

1. **Build an assistant**  
   The agent gathers requirements, loads available voices/models/languages, and creates the assistant.

2. **Start a campaign**  
   The agent selects an outbound assistant, configures time windows and retry logic, adds leads, and starts the campaign.

3. **Enable a knowledge base**  
   The agent creates a knowledge base, imports documents, and links it to an assistant.

## Standard Build Flow

For consistent results, follow this order:

1. Clarify the use case and desired assistant behavior.
2. Load available options (models, voices, languages, numbers).
3. Create or update the resource (assistant/campaign/knowledge base/tool).
4. Run a test conversation or dry-run.
5. Iterate prompt, voice, and webhook settings based on results.

## Troubleshooting

| Issue | Likely Cause | Fix |
|---|---|---|
| `FAMULOR_API_KEY` missing | Env var not set in current shell | Run `export FAMULOR_API_KEY="..."` again |
| `401 Unauthorized` | Invalid or expired API key | Create a new key in Famulor dashboard and retry |
| Empty/failed API response | Temporary API or network issue | Retry request and verify internet connection |
| Assistant creation fails | Incompatible mode/model combination | Re-check mode-specific model requirements in `references/api_reference.md` |
| WhatsApp send error | Sender/template/session mismatch | Fetch valid senders/templates and re-check session status |

## Security Notes

- Never commit API keys to Git.
- Prefer local environment variables or a `.env` file excluded via `.gitignore`.
- Rotate API keys immediately if they were exposed.

## Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Update docs or implementation with clear examples.
4. Open a pull request with a short test/verification note.

## Updating

To update to the latest version:

1. Pull the latest repository changes.
2. Re-import or refresh `famulor.skill` in your agent platform.
3. Start a new session to ensure updated instructions are loaded.

## Support

- Issues: open a GitHub issue in this repository.
- Platform: [https://www.famulor.io](https://www.famulor.io)

## Skill Description Quality Principles

This skill file follows common discoverability best practices:

- Clear trigger keywords from real user requests
- Explicit guidance on when to use the skill
- Concrete actions instead of generic claims
- Short, specific frontmatter description

## License

See `LICENSE`.
