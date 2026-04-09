# Famulor OpenClaw Plugin

Vollständige Integration der [Famulor AI-Telefonplattform](https://famulor.de) in OpenClaw.

## Features

- **Assistant Management**: Erstellen, aktualisieren, auflisten von KI-Telefonassistenten
- **Lookup**: Sprachen, Stimmen, Modelle, Telefonnummern
- **Knowledge Bases**: Wissensdatenbanken erstellen und befüllen
- **Webhooks**: Webhooks aktivieren für Callbacks
- **Testing**: Testanrufe starten und Nachrichten senden

## Installation

### Option 1: Git Clone (Entwickler)

```bash
# Clone in OpenClaw extensions Ordner
git clone https://github.com/bekservice/Famulor-Skill.git ~/.openclaw/extensions/Famulor-Skill

# Dependencies installieren
cd ~/.openclaw/extensions/Famulor-Skill
npm install
```

### Option 2: Symlink (bestehend aus Skills)

```bash
# Falls bereits in ~/.openclaw/skills/Famulor-Skill
ln -s ~/.openclaw/skills/Famulor-Skill ~/.openclaw/extensions/Famulor-Skill
cd ~/.openclaw/extensions/Famulor-Skill
npm install
```

## Konfiguration

### API Key

Setze den Famulor API Key als Environment Variable:

```bash
export FAMULOR_API_KEY="dein-api-key-hier"
```

Oder füge ihn in der OpenClaw Config hinzu (`~/.openclaw/openclaw.json`):

```json
{
  "plugins": {
    "entries": {
      "famulor": {
        "enabled": true,
        "config": {
          "apiKey": "dein-api-key-hier"
        }
      }
    }
  }
}
```

API Key erhältst du unter: https://app.famulor.de → API Keys

## Verfügbare Tools

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
| `famulor_create_document` | Dokument hinzufügen (URL/Links/Text) |

### Webhooks & Testing

| Tool | Beschreibung |
|------|--------------|
| `famulor_enable_webhook` | Webhook aktivieren |
| `famulor_enable_conversation_ended_webhook` | Post-Call Webhook |
| `famulor_create_test_conversation` | Testanruf starten |
| `famulor_send_test_message` | Testnachricht senden |

## Nutzung

Nach der Installation und Konfiguration sind alle Tools automatisch im Chat verfügbar:

```
Du: Erstelle einen neuen Assistenten für Friseursalon Weber
Agent: [nutzt famulor_create_assistant tool]
```

## Struktur

```
Famulor-Skill/
├── openclaw.plugin.json    # Plugin Manifest
├── index.ts                # Plugin Entry Point
├── src/
│   ├── api-client.ts       # Famulor API Client
│   └── tools/              # Tool Registrierungen
│       ├── assistant-tools.ts
│       ├── lookup-tools.ts
│       ├── knowledge-tools.ts
│       └── webhook-tools.ts
├── SKILL.md                # Onboarding Guide (Agent)
└── references/             # Branchenwissen
```

## Weiterentwicklung

Für einen PR an dieses Repository:

1. Fork erstellen
2. Änderungen in `src/` machen
3. TypeScript kompilieren: `npm run typecheck`
4. PR öffnen

## Lizenz

MIT
