/**
 * Famulor Tools — Lookup (Languages, Voices, Models, Phone Numbers)
 */

import { Type } from "@sinclair/typebox";
import { FamulorApiClient, getConfigFromEnv } from "../api-client";

// Tool: Get Languages
export const getLanguagesTool = {
  name: "famulor_get_languages",
  description: "Liefert alle verfügbaren Sprachen für Assistenten. Nutze dies um die richtige language_id zu finden.",
  parameters: Type.Object({}),
  execute: async () => {
    const client = new FamulorApiClient(getConfigFromEnv());
    const result = await client.getLanguages();
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
};

// Tool: Get Voices
export const getVoicesTool = {
  name: "famulor_get_voices",
  description: "Liefert alle verfügbaren Stimmen. Optional gefiltert nach Engine-Typ (mode: pipeline, multimodal, dualplex).",
  parameters: Type.Object({
    mode: Type.Optional(Type.Union([
      Type.Literal("pipeline"),
      Type.Literal("multimodal"),
      Type.Literal("dualplex")
    ]))
  }),
  execute: async (params: Record<string, unknown>) => {
    const client = new FamulorApiClient(getConfigFromEnv());
    const result = await client.getVoices(params.mode as string | undefined);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
};

// Tool: Get Models
export const getModelsTool = {
  name: "famulor_get_models",
  description: "Liefert alle verfügbaren LLM Modelle für Assistenten.",
  parameters: Type.Object({}),
  execute: async () => {
    const client = new FamulorApiClient(getConfigFromEnv());
    const result = await client.getModels();
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
};

// Tool: Get Phone Numbers
export const getPhoneNumbersTool = {
  name: "famulor_get_phone_numbers",
  description: "Liefert alle verfügbaren Telefonnummern die zugewiesen werden können.",
  parameters: Type.Object({}),
  execute: async () => {
    const client = new FamulorApiClient(getConfigFromEnv());
    const result = await client.getPhoneNumbers();
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
};

// Tool: Get Synthesizer Providers
export const getSynthesizerProvidersTool = {
  name: "famulor_get_synthesizer_providers",
  description: "Liefert alle TTS-Anbieter (Synthesizer). Standard ist ElevenLabs (ID 1).",
  parameters: Type.Object({}),
  execute: async () => {
    const client = new FamulorApiClient(getConfigFromEnv());
    const result = await client.getSynthesizerProviders();
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
};

// Tool: Get Transcriber Providers
export const getTranscriberProvidersTool = {
  name: "famulor_get_transcriber_providers",
  description: "Liefert alle STT/Transkriptions-Anbieter.",
  parameters: Type.Object({}),
  execute: async () => {
    const client = new FamulorApiClient(getConfigFromEnv());
    const result = await client.getTranscriberProviders();
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
};
