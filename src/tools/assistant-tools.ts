/**
 * Famulor Tools — Assistant Management
 */

import { Type } from "@sinclair/typebox";
import { FamulorApiClient, getConfigFromEnv } from "../api-client";

// Tool: Create Assistant
export const createAssistantTool = {
  name: "famulor_create_assistant",
  description: "Erstellt einen neuen KI-Telefonassistenten bei Famulor. WICHTIG: POST /user/assistant (singular, nicht /assistants). Alle Pflichtfelder müssen vorhanden sein.",
  parameters: Type.Object({
    name: Type.String({ description: "Name des Assistenten (z.B. 'Max - Friseursalon Weber')" }),
    voice_id: Type.Number({ description: "Voice ID: 13 = weiblich (Susi), 1994 = männlich (Christian)" }),
    language_id: Type.Number({ description: "Sprach-ID aus get_languages()" }),
    type: Type.Union([Type.Literal("inbound"), Type.Literal("outbound")], {
      description: "Inbound = eingehende Anrufe beantworten, Outbound = aktiv anrufen"
    }),
    mode: Type.Union([
      Type.Literal("pipeline"),
      Type.Literal("multimodal"),
      Type.Literal("dualplex")
    ], { description: "Pipeline=empfohlen, Multimodal=natürlicher aber teurer, Dualplex=Schnellste+beste Qualität" }),
    system_prompt: Type.String({ description: "System-Prompt für den Assistenten" }),
    initial_message: Type.Optional(Type.String({ description: "Begrüßungsnachricht (max 200 Zeichen)" })),
    timezone: Type.Optional(Type.String({ default: "Europe/Berlin" })),
    llm_model_id: Type.Optional(Type.Number({ default: 2, description: "LLM Model ID (2 = GPT-4.1-mini)" })),
    allow_interruptions: Type.Optional(Type.Boolean({ default: true })),
    fillers: Type.Optional(Type.Boolean({ default: true })),
    enable_noise_cancellation: Type.Optional(Type.Boolean({ default: true })),
    record: Type.Optional(Type.Boolean({ default: true })),
    post_call_evaluation: Type.Optional(Type.Boolean({ default: true })),
    post_call_schema: Type.Optional(Type.Array(Type.Object({
      name: Type.String({ description: "Feldname (max 16 Zeichen!)" }),
      description: Type.Optional(Type.String()),
      type: Type.Union([Type.Literal("bool"), Type.Literal("string"), Type.Literal("int"), Type.Literal("float")])
    }))),
    ambient_sound: Type.Optional(Type.String({ description: "Hintergrundgeräusch: office, cafe, off" })),
    synthesizer_provider_id: Type.Optional(Type.Number({ default: 1, description: "1 = ElevenLabs" })),
    secondary_language_ids: Type.Optional(Type.Array(Type.Number())),
    knowledgebase_id: Type.Optional(Type.Number()),
    knowledgebase_mode: Type.Optional(Type.Union([Type.Literal("function_call"), Type.Literal("prompt")])),
    tools: Type.Optional(Type.Array(Type.Object({
      type: Type.String(),
      data: Type.Record(Type.String(), Type.Unknown())
    })))
  }),
  execute: async (params: Record<string, unknown>) => {
    const client = new FamulorApiClient(getConfigFromEnv());
    const result = await client.createAssistant(params as any);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
};

// Tool: Update Assistant
export const updateAssistantTool = {
  name: "famulor_update_assistant",
  description: "Aktualisiert einen existierenden Famulor Assistenten.",
  parameters: Type.Object({
    assistant_id: Type.Number({ description: "ID des Assistenten" }),
    // Partial update - all fields optional
    name: Type.Optional(Type.String()),
    voice_id: Type.Optional(Type.Number()),
    language_id: Type.Optional(Type.Number()),
    type: Type.Optional(Type.Union([Type.Literal("inbound"), Type.Literal("outbound")])),
    mode: Type.Optional(Type.Union([Type.Literal("pipeline"), Type.Literal("multimodal"), Type.Literal("dualplex")])),
    system_prompt: Type.Optional(Type.String()),
    initial_message: Type.Optional(Type.String()),
    // ... more optional fields
  }),
  execute: async (params: Record<string, unknown>) => {
    const { assistant_id, ...payload } = params as any;
    const client = new FamulorApiClient(getConfigFromEnv());
    const result = await client.updateAssistant(assistant_id, payload);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
};

// Tool: List Assistants
export const listAssistantsTool = {
  name: "famulor_list_assistants",
  description: "Listet alle Assistenten des Famulor Accounts auf.",
  parameters: Type.Object({
    per_page: Type.Optional(Type.Number({ default: 100 })),
    page: Type.Optional(Type.Number({ default: 1 }))
  }),
  execute: async (params: Record<string, unknown>) => {
    const client = new FamulorApiClient(getConfigFromEnv());
    const result = await client.listAssistants(
      (params.per_page as number) || 100,
      (params.page as number) || 1
    );
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
};

// Tool: Get Assistant Details
export const getAssistantTool = {
  name: "famulor_get_assistant",
  description: "Liefert Details zu einem bestimmten Assistenten.",
  parameters: Type.Object({
    assistant_id: Type.Number()
  }),
  execute: async (params: Record<string, unknown>) => {
    const client = new FamulorApiClient(getConfigFromEnv());
    const result = await client.getAssistant(params.assistant_id as number);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
};
