---
name: famulor-api
description: Build and manage assistants, campaigns, knowledge bases, webhooks, and messaging workflows on famulor.io. Use this skill when users ask to create, configure, or optimize Famulor phone bots, chat assistants, outbound calling campaigns, WhatsApp/SMS flows, lead operations, or API integrations. Trigger on terms like "Famulor", "famulor.io", "assistant setup", "campaign", "knowledge base", "webhook", or "Famulor API". This skill executes real API calls with the user's FAMULOR_API_KEY.
---

# Famulor API Builder

## What This Skill Does

This skill turns Claude into a hands-on builder for the Famulor AI platform. Instead of just providing documentation, Claude actually executes API calls to create and configure assistants, campaigns, knowledge bases, mid-call tools, and more on the user's behalf.

The Famulor platform powers AI phone bots (inbound/outbound), chat widgets, WhatsApp bots, and SMS messaging. Users come here to build and fine-tune their AI assistants through conversation with Claude.

## Getting Started

Before making any API calls, you need the user's API key. Check if `FAMULOR_API_KEY` is set as an environment variable. If not, ask the user for their key and set it:

```bash
export FAMULOR_API_KEY="their-key-here"
```

**Where to get the key:** Users create API keys at https://app.famulor.de under the API Keys section.

Once the key is available, use the `famulor_client.py` script in `scripts/` to interact with the API. The script path is relative to this skill's directory.

## Core Workflow

When a user wants to build something on Famulor, follow this general approach:

1. **Understand what they want to build** (assistant, campaign, knowledge base, etc.)
2. **Gather required configuration** through conversation (don't dump all options at once; ask progressively)
3. **Fetch available options** from the API (models, voices, languages, phone numbers) so the user can pick
4. **Create the resource** via API call
5. **Iterate on configuration** based on user feedback (update system prompts, tweak voice settings, etc.)

## Building Assistants

Assistants are the core of Famulor. They handle phone calls, chat conversations, and WhatsApp messages.

### Step 1: Determine the type

Ask the user what kind of assistant they need:
- **Inbound phone bot**: Answers incoming calls
- **Outbound phone bot**: Makes calls to leads (used in campaigns)
- **Chat widget**: Handles text conversations on websites
- **WhatsApp bot**: Responds to WhatsApp messages

### Step 2: Gather the basics

Required fields for every assistant:
- **name**: A descriptive name
- **type**: `inbound` or `outbound`
- **mode**: `pipeline` (most common, uses separate LLM + TTS), `multimodal` (end-to-end), or `dualplex` (hybrid)
- **language_id**: Fetch available languages first with `get_languages`
- **voice_id**: Fetch available voices with `get_voices` (can filter by mode)
- **timezone**: e.g. `Europe/Berlin`
- **initial_message**: What the assistant says first (max 200 chars)
- **system_prompt**: The core instructions for the AI

For `pipeline` mode, also need `llm_model_id` (fetch with `get_models`).
For `multimodal`/`dualplex` mode, need `multimodal_model_id`.

### Step 3: Write the system prompt

This is where Claude adds the most value. Help the user craft an effective system prompt by:
- Understanding their use case (customer support, appointment booking, sales, etc.)
- Defining the assistant's personality and tone
- Specifying what information to collect (using `post_call_schema` variables)
- Setting up conversation flow and decision logic
- Adding guardrails (what the bot should/shouldn't do)

### Step 4: Create and iterate

Create the assistant via API, then help the user refine it:
- Test with a test conversation (`create_conversation` with `type: "test"`)
- Adjust system prompt based on test results
- Fine-tune voice settings (`voice_stability`, `voice_similarity`, `speech_speed`)
- Configure advanced features (interruptions, fillers, noise cancellation, etc.)

### Advanced Assistant Configuration

Read `references/api_reference.md` for the full list of configuration options. Key advanced features:

**Voice & Speech**: `tts_emotion_enabled`, `voice_stability` (0-1), `voice_similarity` (0-1), `speech_speed` (0.7-1.2), `synthesizer_provider_id`, `transcriber_provider_id`

**Call Behavior**: `allow_interruptions`, `fillers`, `record`, `enable_noise_cancellation`, `max_duration` (20-1200s), `max_silence_duration` (1-360s), `ambient_sound` (off/office/city/forest/cafe/nature)

**Detection**: `endpoint_type` (vad/ai), `endpoint_sensitivity` (0-5), `interrupt_sensitivity` (0-5), `min_interrupt_words` (0-10)

**Webhooks**: `is_webhook_active`, `webhook_url`, `send_webhook_only_on_completed`, `include_recording_in_webhook`

**Post-Call Evaluation**: `post_call_evaluation`, `post_call_schema` (array of `{name, type, description}` objects defining what data to extract from calls)

**Chat-Specific**: `conversation_inactivity_timeout` (1-1440 min), `conversation_ended_retrigger`, `chat_llm_fallback_id`

## Building Campaigns

Campaigns are outbound calling workflows that dial through a list of leads using an outbound assistant.

### Setup flow:
1. Create or select an **outbound** assistant
2. Create the campaign with scheduling parameters
3. Add leads to the campaign
4. Start the campaign

### Key campaign settings:
- `max_calls_in_parallel` (1-10)
- `allowed_hours_start_time` / `allowed_hours_end_time` (H:i format)
- `allowed_days` (array of weekdays)
- `max_retries` (1-5), `retry_interval` (10-4320 minutes)
- `retry_on_voicemail`, `retry_on_goal_incomplete`
- `goal_completion_variable` (links to post_call_schema)

## Managing Knowledge Bases

Knowledge bases give assistants access to documents for RAG (retrieval-augmented generation).

### Flow:
1. Create a knowledge base (`create_knowledgebase`)
2. Add documents: website URLs, PDFs, TXT, or DOCX files (`create_document`)
3. Attach to an assistant via `knowledgebase_id` during create/update
4. Set `knowledgebase_mode`: `function_call` (assistant decides when to search) or `prompt` (always included)

Document types:
- **website**: Provide `url` or `links` array, optionally set `relative_links_limit` (1-50)
- **pdf/txt/docx**: Upload file (max 20MB) via multipart/form-data

Documents are processed asynchronously. Check status with `get_document`.

## Mid-Call Tools

Mid-call tools let assistants make HTTP requests during calls (e.g., check appointment availability, look up customer data, book appointments).

### Creating a tool:
- `name`: lowercase_with_underscores
- `description`: What the tool does (max 255 chars, this is what the AI reads to decide when to use it)
- `endpoint`: The API URL to call
- `method`: GET, POST, PUT, PATCH, or DELETE
- `timeout`: 1-30 seconds (default 10)
- `headers`: Array of `{name, value}` pairs
- `schema`: Parameter definitions `{name, type, description}` where type is string/number/boolean

After creating, attach to an assistant via `tool_ids` in create/update assistant.

## WhatsApp Integration

### Sending messages:
- **Template messages**: Use pre-approved templates (required to initiate conversations). Need `sender_id`, `template_id`, `recipient_phone`.
- **Freeform messages**: Send any text, but only within a 24-hour window after customer contact. Need `sender_id`, `recipient_phone`, `message`.

### Setup:
1. Get available senders: `get_whatsapp_senders`
2. Get templates for a sender: `get_whatsapp_templates`
3. Check session status before sending freeform: `get_whatsapp_session_status`

Rate limit: 5 requests/second for template messages.

## SMS

Send SMS via `send_sms`. Requires:
- `from_number_id`: Phone number ID (must be SMS-capable)
- `to`: Recipient in international format
- `body`: Message content (max 300 chars)

## Webhooks

Two webhook types:

**Post-Call Webhook**: Fired after a call ends. Contains `id`, `customer_phone`, `assistant_phone`, `duration`, `status`, `extracted_variables`, `transcript`, `recording_url`, lead and campaign data.

**Conversation Ended Webhook**: Fired after a chat conversation ends. Contains `conversation_id`, `assistant_id`, `type`, `transcript`, `extracted_variables`, `customer_name`, `customer_phone`.

Enable/disable webhooks per assistant via the webhook endpoints.

## API Reference

For detailed endpoint specifications (all request/response fields, error codes, etc.), read `references/api_reference.md`. It covers every endpoint in the Famulor API organized by category.

## Using the Client Script

The `scripts/famulor_client.py` provides a `FamulorClient` class with methods for every API endpoint. Basic usage:

```python
from famulor_client import FamulorClient

client = FamulorClient()  # reads FAMULOR_API_KEY from env

# List assistants
assistants = client.list_assistants()

# Create an assistant
result = client.create_assistant(
    name="Support Bot",
    voice_id=1,
    language_id=1,
    type="inbound",
    mode="pipeline",
    timezone="Europe/Berlin",
    initial_message="Hello! How can I help?",
    system_prompt="You are a helpful support agent...",
    llm_model_id=1
)

# Test the assistant
conv = client.create_conversation(assistant_id="uuid-here", type="test")
response = client.send_message(conv["conversation_id"], "Hi, I need help")
```

You can also run it from the command line:
```bash
python3 scripts/famulor_client.py list_assistants
python3 scripts/famulor_client.py create_conversation <assistant_id> test
```

## Pricing Notes (for user reference)

- Widget chat messages: $0.01 per user message
- Test conversations: Free
- Phone calls and SMS: Balance-based
- Phone numbers: Monthly subscription
