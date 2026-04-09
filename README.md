# Famulor OpenClaw Plugin

Plugin für die [Famulor AI-Telefonplattform](https://famulor.de) in [OpenClaw](https://openclaw.ai).

## Features

- **17 API Tools** für Assistant-Management, Lookups, Knowledge Bases und Webhooks
- **Native TypeScript** Integration in OpenClaw
- **Branchenspezifisches Wissen** in `references/nischen_intelligenz.md`

## Installation

```bash
# Clone
git clone https://github.com/kokosnuss7777/famulor-plugin-openclaw.git ~/.openclaw/extensions/famulor

# Dependencies installieren
cd ~/.openclaw/extensions/famulor
npm install
```

## Konfiguration

```bash
# API Key setzen
export FAMULOR_API_KEY="dein-api-key"
```

Oder in `~/.openclaw/openclaw.json`:

```json
{
  "plugins": {
    "entries": {
      "famulor": {
        "enabled": true,
        "config": {
          "apiKey": "dein-api-key"
        }
      }
    }
  }
}
```

API Key: https://app.famulor.de → API Keys

## Tools

### Assistant Management

| Tool | Beschreibung |
|------|--------------|
| `famulor_create_assistant` | Neuen KI-Assistenten erstellen |
| `famulor_update_assistant` | Assistent aktualisieren |
| `famulor_list_assistants` | Alle Assistenten auflisten |
| `famulor_get_assistant` | Details eines Assistenten |

### Lookup

| Tool | Beschreibung |
|------|--------------|
| `famulor_get_languages` | Verfügbare Sprachen |
| `famulor_get_voices` | Verfügbare Stimmen |
| `famulor_get_models` | LLM Modelle |
| `famulor_get_phone_numbers` | Telefonnummern |
| `famulor_get_synthesizer_providers` | TTS-Anbieter |
| `famulor_get_transcriber_providers` | STT-Anbieter |

### Knowledge Bases

| Tool | Beschreibung |
|------|--------------|
| `famulor_create_knowledgebase` | Wissensdatenbank erstellen |
| `famulor_list_knowledgebases` | Alle Wissensdatenbanken |
| `famulor_create_document` | Dokument hinzufügen |

### Webhooks & Testing

| Tool | Beschreibung |
|------|--------------|
| `famulor_enable_webhook` | Webhook aktivieren |
| `famulor_enable_conversation_ended_webhook` | Post-Call Webhook |
| `famulor_create_test_conversation` | Testanruf starten |
| `famulor_send_test_message` | Testnachricht senden |

## Struktur

```
famulor-plugin-openclaw/
├── index.ts                    # Plugin Entry Point
├── openclaw.plugin.json        # Plugin Manifest
├── package.json
├── tsconfig.json
├── src/
│   ├── api-client.ts           # TypeScript API Client
│   └── tools/
│       ├── assistant-tools.ts
│       ├── lookup-tools.ts
│       ├── knowledge-tools.ts
│       └── webhook-tools.ts
├── references/
│   └── nischen_intelligenz.md  # Branchenwissen
└── scripts/
    └── famulor_client.py       # Python Client (Reference)
```

## Python Client

Das Original `famulor_client.py` wird als Reference aus dem [Original Repo](https://github.com/bekservice/Famulor-Skill) bereitgehalten.

Bei API-Updates im Original Repo: `scripts/famulor_client.py` aktualisieren.

## Lizenz

MIT
