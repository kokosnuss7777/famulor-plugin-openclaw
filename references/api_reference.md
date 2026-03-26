# Famulor API Reference

## Base URL
`https://app.famulor.de/api`

## Authentication
All requests require: `Authorization: Bearer YOUR_API_KEY`

API keys are created at https://app.famulor.de under API Keys. Keys cannot be retrieved after creation, so store them securely.

---

## Table of Contents
1. [AI Chatbot](#ai-chatbot) (Conversations & Messages)
2. [AI Replies](#ai-replies) (Standalone reply generation)
3. [Assistants](#assistants) (Create, update, delete, configure)
4. [Calls](#calls) (Make calls, list, delete)
5. [Campaigns](#campaigns) (Outbound calling campaigns)
6. [Conversations](#conversations) (List & filter all conversations)
7. [Knowledge Bases](#knowledge-bases) (RAG document management)
8. [Leads](#leads) (Campaign contact management)
9. [Mid-Call Tools](#mid-call-tools) (HTTP tools for assistants)
10. [Phone Numbers](#phone-numbers) (Search, purchase, manage)
11. [SMS](#sms) (Send text messages)
12. [User](#user) (Account info, call details)
13. [Webhooks](#webhooks) (Post-call & conversation-ended)
14. [WhatsApp](#whatsapp) (Templates, freeform, sessions)

---

## AI Chatbot

### Create Conversation
`POST /conversations`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| assistant_id | string (UUID) | Yes | Assistant to handle the conversation |
| type | string | No | `widget` (paid, $0.01/msg) or `test` (free). Default: `widget` |
| variables | object | No | Custom context variables, accessible as `{{variable_name}}` in prompts |

**Response:** `{ status, conversation_id (UUID), history: [{role, content}] }`

### Get Conversation
`GET /conversations/{uuid}`

Returns full message history: `{ status, history: [{role, content, function_calls?}] }`

### Send Message
`POST /conversations/{uuid}/messages`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| message | string | Yes | User message (max 2000 chars) |

**Response:** `{ status, message (assistant reply), function_calls?: [{name, arguments, result}] }`

---

## AI Replies

### Generate AI Reply
`POST /replies/generate`

Generates a standalone AI reply using an assistant, keyed by customer identifier. Useful for integrating Famulor AI into external messaging channels.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| assistant_id | integer | Yes | Assistant ID |
| customer_identifier | string | Yes | Unique customer ID (phone, email, CRM ID, etc., max 255 chars). Use consistent format per customer |
| message | string | Yes | Customer's message |
| variables | object | No | Context data merged with existing conversation variables |

**Response:** `{ success, conversation_id, customer_identifier, reply, function_calls, ai_disabled }`

**Rate limit:** 5 requests/minute per API token.

---

## Assistants

### List Assistants
`GET /user/assistants/get`

| Param | Type | Description |
|-------|------|-------------|
| per_page | integer | 1-100, default 10 |
| page | integer | Default 1 |

**Response:** Paginated `{ data: [assistant objects], current_page, per_page, total, last_page }`

### Create Assistant
`POST /user/assistants`

**Required fields:**

| Field | Type | Description |
|-------|------|-------------|
| name | string | Max 255 chars |
| voice_id | integer | From GET voices endpoint |
| language_id | integer | From GET languages endpoint |
| type | string | `inbound` or `outbound` |
| mode | string | `pipeline`, `multimodal`, or `dualplex` |
| timezone | string | e.g. `Europe/Berlin` |
| initial_message | string | First message (max 200 chars) |
| system_prompt | string | AI instructions |

**Mode-specific required:**

| Field | Required for |
|-------|-------------|
| llm_model_id (integer) | `pipeline` mode |
| multimodal_model_id (integer) | `multimodal`, `dualplex` modes |

**Optional fields:**

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| secondary_language_ids | int[] | | Additional languages |
| knowledgebase_id | integer | | Attach a knowledge base |
| knowledgebase_mode | string | | `function_call` or `prompt` |
| phone_number_id | integer | | Assign phone number |
| tool_ids | int[] | | Mid-call tool IDs |
| tools | array | | Built-in tools (call_transfer, warm_call_transfer, end_call, dtmf_input, collect_keypad, calendar_integration) |
| tts_emotion_enabled | boolean | true | Emotional TTS |
| voice_stability | number | 0.70 | 0-1 range |
| voice_similarity | number | 0.50 | 0-1 range |
| speech_speed | number | 1.00 | 0.7-1.2 range |
| llm_temperature | number | 0.10 | 0-1 range |
| synthesizer_provider_id | integer | | TTS provider |
| transcriber_provider_id | integer | | STT provider |
| allow_interruptions | boolean | true | Allow caller to interrupt |
| fillers | boolean | false | Use filler words (pipeline only) |
| filler_config | object | | Filler word configuration |
| record | boolean | false | Record calls |
| enable_noise_cancellation | boolean | true | Background noise filter |
| wait_for_customer | boolean | false | Wait for customer to speak first |
| max_duration | integer | 600 | Call timeout in seconds (20-1200) |
| max_silence_duration | integer | 40 | Max silence before hangup (1-360s) |
| max_initial_silence_duration | integer | | Initial silence timeout (1-120s) |
| ringing_time | integer | 30 | Ring duration (1-60s) |
| reengagement_interval | integer | 30 | Re-engage after silence (7-600s) |
| reengagement_prompt | string | | Custom re-engagement text (max 1000) |
| end_call_on_voicemail | boolean | true | Hang up on voicemail |
| voice_mail_message | string | | Voicemail message (max 1000) |
| endpoint_type | string | vad | `vad` or `ai` |
| endpoint_sensitivity | number | 0.5 | 0-5 range |
| interrupt_sensitivity | number | 0.5 | 0-5 range |
| min_interrupt_words | integer | | 0-10 |
| ambient_sound | string | off | off/office/city/forest/crowded_room/cafe/nature |
| ambient_sound_volume | number | 0.5 | 0-1 range |
| is_webhook_active | boolean | false | Enable post-call webhook |
| webhook_url | string | | Required if webhook active |
| send_webhook_only_on_completed | boolean | true | Only fire on completed calls |
| include_recording_in_webhook | boolean | true | Include recording URL |
| post_call_evaluation | boolean | true | Extract variables after call |
| post_call_schema | array | | `[{name, type, description}]` for variable extraction |
| variables | object | | Custom key-value pairs |
| conversation_inactivity_timeout | integer | 30 | Chat timeout in minutes (1-1440) |
| conversation_ended_retrigger | boolean | false | Re-trigger on new message after end |
| conversation_ended_webhook_url | string | | Webhook for chat end |
| chat_llm_fallback_id | integer | | Fallback LLM for chat |
| turn_detection_threshold | number | | 0-1 range |

**Response (201):** `{ message, data: {id, name, status, type, mode} }`

### Update Assistant
`PATCH /user/assistants/{id}`

All fields from Create are optional. Same field definitions apply.

**Response (200):** `{ message: "Assistant updated successfully", data: {id, name, status, type, mode} }`

### Delete Assistant
`DELETE /user/assistants/{uuid}`

### Get Outbound Assistants
`GET /user/assistants/outbound`

Returns only assistants with type `outbound`.

### Retrieve Available Models
`GET /user/assistants/models`

### Retrieve Available Languages
`GET /user/assistants/languages`

### Retrieve Available Voices
`GET /user/assistants/voices`

Optional query param `mode` to filter by assistant mode.

### Retrieve Available Phone Numbers
`GET /user/assistants/phone-numbers`

### List Synthesizer Providers
`GET /user/assistants/synthesizer-providers`

### List Transcriber Providers
`GET /user/assistants/transcriber-providers`

### Webhook Management

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/user/assistants/{uuid}/webhook` | POST | Enable post-call webhook (body: `webhook_url`) |
| `/user/assistants/{uuid}/webhook` | DELETE | Disable post-call webhook |
| `/user/assistants/{uuid}/inbound-webhook` | POST | Enable inbound webhook |
| `/user/assistants/{uuid}/inbound-webhook` | DELETE | Disable inbound webhook |
| `/user/assistants/{uuid}/conversation-ended-webhook` | POST | Enable conversation-ended webhook (body: `webhook_url`) |
| `/user/assistants/{uuid}/conversation-ended-webhook` | DELETE | Disable conversation-ended webhook |

---

## Calls

### Make a Call
`POST /user/make_call`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| phone_number | string | Yes | E.164 format (e.g. +4915123456789) |
| assistant_id | integer | Yes | Assistant to use |
| variables | object | No | Context variables (customer_name, email, etc.) |

**Response:** `{ message, call_id, status: "initiated" }`

### List Calls
`GET /user/calls`

| Param | Type | Description |
|-------|------|-------------|
| status | string | initiated/ringing/busy/in-progress/ended/completed/ended_by_customer/ended_by_assistant/no-answer/failed |
| type | string | inbound/outbound/web |
| phone_number | string | Filter by client phone |
| assistant_id | integer | Filter by assistant |
| campaign_id | integer | Filter by campaign |
| date_from | string | YYYY-MM-DD |
| date_to | string | YYYY-MM-DD |
| per_page | integer | 1-100, default 15 |
| page | integer | Default 1 |

**Response:** Paginated with call objects containing: id, assistant_name, campaign_name, type, duration, status, transcript, variables, evaluation, recording_url, carrier_cost, total_cost, timestamps.

### Get Call
`GET /user/calls/{id}`

### Delete Call
`DELETE /user/calls/{id}`

---

## Campaigns

### Create Campaign
`POST /user/campaigns`

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| name | string | Yes | | Max 255 chars |
| assistant_id | integer | Yes | | Must be outbound assistant |
| timezone | string | No | Account tz | |
| max_calls_in_parallel | integer | No | 3 | 1-10 |
| allowed_hours_start_time | string | No | "00:00" | H:i format |
| allowed_hours_end_time | string | No | "23:59" | H:i format |
| allowed_days | array | No | All 7 | Weekday names |
| max_retries | integer | No | 3 | 1-5 |
| retry_interval | integer | No | 60 | 10-4320 minutes |
| retry_on_voicemail | boolean | No | | |
| retry_on_goal_incomplete | boolean | No | | |
| goal_completion_variable | string | No | | Max 255, links to post_call_schema |
| mark_complete_when_no_leads | boolean | No | true | Auto-complete when no leads left |
| phone_number_ids | array | No | | Phone number IDs to use |

**Response (201):** `{ message, data: {id, name, status, ...settings} }`

### List Campaigns
`GET /user/campaigns`

### Update Campaign Status
`PATCH /user/campaigns/{id}/status`

Body: `{ status: "active" | "paused" }`

---

## Conversations

### List Conversations
`GET /user/conversations`

Uses cursor-based pagination.

| Param | Type | Description |
|-------|------|-------------|
| type | string | test/widget/whatsapp/api |
| assistant_id | integer | Filter by assistant |
| customer_phone | string | Exact match |
| whatsapp_sender_phone | string | Exact match |
| external_identifier | string | Filter by external ID |
| per_page | integer | 1-100, default 15 |
| cursor | string | Pagination cursor |

**Response:** `{ data: [conversation objects], next_cursor, prev_cursor, per_page }`

---

## Knowledge Bases

### Create Knowledge Base
`POST /user/knowledgebases`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Max 255 chars |
| description | string | No | Max 255 chars |

**Response (201):** `{ message, data: {id, name, description, status, created_at, updated_at} }`

### Get Knowledge Base
`GET /user/knowledgebases/{id}`

### List Knowledge Bases
`GET /user/knowledgebases`

### Update Knowledge Base
`PATCH /user/knowledgebases/{id}`

### Delete Knowledge Base
`DELETE /user/knowledgebases/{id}`

### Create Document
`POST /user/knowledgebases/{knowledgebaseId}/documents`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Max 255 chars |
| type | string | Yes | `website`, `pdf`, `txt`, or `docx` |
| description | string | No | Max 255 chars |
| url | string | Conditional | Website URL (for type=website, if no links) |
| links | array | Conditional | Specific URLs to scrape (for type=website, if no url) |
| relative_links_limit | integer | No | 1-50, default 10 |
| file | file | Conditional | Required for pdf/txt/docx (max 20MB, multipart/form-data) |

Processing is async. Check status with Get Document.

### Get Document
`GET /user/knowledgebases/{knowledgebaseId}/documents/{documentId}`

### List Documents
`GET /user/knowledgebases/{knowledgebaseId}/documents`

### Update Document
`PATCH /user/knowledgebases/{knowledgebaseId}/documents/{documentId}`

Body: `name` and/or `description`

### Delete Document
`DELETE /user/knowledgebases/{knowledgebaseId}/documents/{documentId}`

---

## Leads

### Create Lead
`POST /user/leads`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| phone_number | string | Yes | E.164 format |
| campaign_id | integer | Yes | Target campaign |
| variables | object | No | Custom data (customer_name, email, etc.) |
| allow_dupplicate | boolean | No | Allow duplicates in same campaign (default false) |
| secondary_contacts | array | No | Additional contacts with phone_number and variables |

**Response:** `{ message, data: {id, campaign_id, phone_number, variables, status, campaign, secondary_contacts} }`

### List Leads
`GET /user/leads`

### Update Lead
`PATCH /user/leads/{id}`

### Delete Lead
`DELETE /user/leads/{id}`

---

## Mid-Call Tools

### Create Mid-Call Tool
`POST /user/mid-call-tools`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Lowercase + underscores, starts with letter |
| description | string | Yes | Max 255 chars (AI reads this to decide when to use the tool) |
| endpoint | string | Yes | API URL to call |
| method | string | Yes | GET/POST/PUT/PATCH/DELETE |
| timeout | integer | No | 1-30 seconds, default 10 |
| headers | array | No | `[{name, value}]` |
| schema | array | No | `[{name, type, description}]` where type is string/number/boolean |

**Response (201):** `{ message, data: {id, name, description, endpoint, method, timeout, headers, schema} }`

Plan limit: 5 tools per account.

### Get Mid-Call Tool
`GET /user/mid-call-tools/{id}`

### List Mid-Call Tools
`GET /user/mid-call-tools`

### Update Mid-Call Tool
`PATCH /user/mid-call-tools/{id}`

### Delete Mid-Call Tool
`DELETE /user/mid-call-tools/{id}`

---

## Phone Numbers

### Search Available Phone Numbers
`GET /user/phone-numbers/search`

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| country_code | string | DE | ISO 3166-1 alpha-2. Supported: DE, US, CA, GB, AU, IL, PL, FI, NL, DK, IT |
| contains | string | | Filter by digits (max 10 numeric chars) |

**Response:** `{ data: [{phone_number, phone_number_formatted, country_code, price, stripe_price_id, address_requirements, sms_capable}] }`

### Purchase Phone Number
`POST /user/phone-numbers/purchase`

Body: `{ phone_number: "+14155551234" }` (E.164, must come from Search)

Requires valid payment method. Creates monthly subscription.

**Response (201):** `{ message, data: {id, phone_number, country_code, type, sms_capable} }`

### List Phone Numbers
`GET /user/phone-numbers`

### Release Phone Number
`DELETE /user/phone-numbers/{id}`

Cancels subscription.

---

## SMS

### Send SMS
`POST /user/sms`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| from | integer | Yes | Phone number ID (must be SMS-capable) |
| to | string | Yes | Recipient in international format |
| body | string | Yes | Message content (max 300 chars) |

**Response:** `{ message, data: {sms_id, from, to, body, segments, cost, currency, status} }`

---

## User

### Get User Information
`GET /user/me`

Returns authenticated user profile.

---

## Webhooks

### Post-Call Webhook Payload

Sent as POST to your webhook URL after a call ends.

| Field | Type | Description |
|-------|------|-------------|
| id | integer | Call ID |
| customer_phone | string | E.164 or null |
| assistant_phone | string | E.164 or null |
| duration | integer | Seconds |
| status | string | completed, busy, failed, etc. |
| extracted_variables | object | Variables from post_call_schema |
| input_variables | object | Variables provided before call |
| transcript | string | Full conversation text |
| recording_url | string | Download link (if enabled) |
| created_at | string | ISO 8601 |
| finished_at | string | ISO 8601 |
| lead | object | Campaign lead data (if applicable) |
| campaign | object | Campaign data (if applicable) |

### Conversation Ended Webhook Payload

Sent as POST after a chat conversation ends.

| Field | Type | Description |
|-------|------|-------------|
| conversation_id | string (UUID) | |
| assistant_id | string (UUID) | |
| type | string | widget or whatsapp |
| message_count | integer | Total messages |
| status | string | Always "ended" |
| transcript | array | `[{role, content}]` |
| formatted_transcript | string | Human-readable version |
| extracted_variables | object | From post_call_schema |
| input_variables | object | Pre-chat/automation data |
| customer_name | string | From pre-chat form or null |
| customer_phone | string | WhatsApp only |
| sender | object | WhatsApp sender info or null |
| created_at | string | ISO 8601 |
| ended_at | string | ISO 8601 |

Retry policy: 30s, 60s, 120s, then marked failed.

---

## WhatsApp

### Get WhatsApp Senders
`GET /user/whatsapp/senders`

### Get WhatsApp Templates
`GET /user/whatsapp/templates/{senderId}`

### Send Template Message
`POST /user/whatsapp/send`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| sender_id | integer | Yes | From Get Senders |
| template_id | integer | Yes | From Get Templates |
| recipient_phone | string | Yes | International format |
| recipient_name | string | No | Max 255 chars |
| variables | object | No | Template placeholder values |

**Response:** `{ success, conversation_id, message_id, whatsapp_message_id, message_sid, status }`

Error codes: INSUFFICIENT_BALANCE, SENDER_NOT_FOUND, TEMPLATE_NOT_FOUND, SENDER_OFFLINE, TEMPLATE_NOT_APPROVED, INVALID_PHONE

Rate limit: 5 req/sec.

### Send Freeform Message
`POST /user/whatsapp/send-freeform`

Only works within 24-hour window after customer contact.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| sender_id | integer | Yes | |
| recipient_phone | string | Yes | International format |
| message | string | Yes | Max 4096 chars |

**Response:** `{ success, conversation_id, message_id, whatsapp_message_id, message_sid, session_status: {is_open, can_send_freeform, requires_template, minutes_remaining, expires_at} }`

### Get Session Status
`GET /user/whatsapp/session-status`

Query params: `sender_id`, `recipient_phone`

Returns session window status including whether freeform messages are allowed.
