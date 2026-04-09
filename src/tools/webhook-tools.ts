/**
 * Famulor Tools — Webhooks & Testing
 */

import { Type } from "@sinclair/typebox";
import { FamulorApiClient, getConfigFromEnv } from "../api-client";

// Tool: Enable Webhook
export const enableWebhookTool = {
  name: "famulor_enable_webhook",
  description: "Aktiviert einen Webhook für einen Assistenten (Eingehende Events).",
  parameters: Type.Object({
    assistant_uuid: Type.String({ description: "UUID des Assistenten" }),
    webhook_url: Type.String({ description: "URL die aufgerufen wird bei Events" })
  }),
  execute: async (params: Record<string, unknown>) => {
    const client = new FamulorApiClient(getConfigFromEnv());
    const result = await client.enableWebhook(
      params.assistant_uuid as string,
      params.webhook_url as string
    );
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
};

// Tool: Enable Conversation Ended Webhook
export const enableConversationEndedWebhookTool = {
  name: "famulor_enable_conversation_ended_webhook",
  description: "Aktiviert einen Webhook der nach Gesprächsende aufgerufen wird (für Post-Call-Analytics).",
  parameters: Type.Object({
    assistant_uuid: Type.String({ description: "UUID des Assistenten" }),
    webhook_url: Type.String({ description: "URL die nach Gesprächsende aufgerufen wird" })
  }),
  execute: async (params: Record<string, unknown>) => {
    const client = new FamulorApiClient(getConfigFromEnv());
    const result = await client.enableConversationEndedWebhook(
      params.assistant_uuid as string,
      params.webhook_url as string
    );
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
};

// Tool: Create Test Conversation
export const createTestConversationTool = {
  name: "famulor_create_test_conversation",
  description: "Startet einen kostenlosen Testanruf mit einem Assistenten.",
  parameters: Type.Object({
    assistant_id: Type.Number({ description: "ID des Assistenten" })
  }),
  execute: async (params: Record<string, unknown>) => {
    const client = new FamulorApiClient(getConfigFromEnv());
    const result = await client.createTestConversation(params.assistant_id as number);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
};

// Tool: Send Test Message
export const sendTestMessageTool = {
  name: "famulor_send_test_message",
  description: "Sendet eine Textnachricht in einen bestehenden Testanruf.",
  parameters: Type.Object({
    conversation_id: Type.String({ description: "ID des Testanrufs" }),
    message: Type.String({ description: "Nachrichtentext" })
  }),
  execute: async (params: Record<string, unknown>) => {
    const client = new FamulorApiClient(getConfigFromEnv());
    const result = await client.sendTestMessage(
      params.conversation_id as string,
      params.message as string
    );
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
};
