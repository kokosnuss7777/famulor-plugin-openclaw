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

// Tool: Enable Webhook with MCC Lead Creation
export const enableWebhookWithMccTool = {
  name: "famulor_enable_webhook_with_mcc",
  description: "Aktiviert Webhook + MCC Lead Creation. Nach Anruf wird automatisch Lead im CRM erstellt.",
  parameters: Type.Object({
    assistant_uuid: Type.String({ description: "UUID des Famulor Assistenten" }),
    webhook_url: Type.Optional(Type.String({ description: "Webhook URL (optional)" })),
    calendly_url: Type.Optional(Type.String({ description: "Calendly URL für Terminbuchung" }))
  }),
  execute: async (params: Record<string, unknown>) => {
    const client = new FamulorApiClient(getConfigFromEnv());
    const webhookUrl = params.webhook_url as string || `https://gateway.openclaw.ai/webhook/famulor/${params.assistant_uuid}`;
    
    const result = await client.enableConversationEndedWebhook(
      params.assistant_uuid as string,
      webhookUrl
    );
    
    return { 
      content: [{ 
        type: "text", 
        text: JSON.stringify({
          webhook_enabled: !result.error,
          webhook_url: webhookUrl,
          calendly_url: params.calendly_url || null,
          message: result.error ? `Fehler: ${result.message}` : "Webhook + MCC Lead aktiviert!"
        }, null, 2) 
      }] 
    };
  }
};

// Tool: Create MCC Lead from Call Data
export const createMccLeadFromCallTool = {
  name: "famulor_create_mcc_lead_from_call",
  description: "Erstellt einen Lead in MCC aus Anruf-Daten (Post-Call).",
  parameters: Type.Object({
    customer_name: Type.String({ description: "Name des Interessenten" }),
    contact: Type.String({ description: "Telefon oder E-Mail" }),
    company: Type.Optional(Type.String()),
    interest: Type.Optional(Type.String()),
    source: Type.Optional(Type.String({ default: "phone_inbound" })),
    calendly_url: Type.Optional(Type.String())
  }),
  execute: async (params: Record<string, unknown>) => {
    return { 
      content: [{ 
        type: "text", 
        text: JSON.stringify({
          status: "ready",
          message: "Nutze MCC Plugin für Lead-Erstellung",
          received_data: params
        }, null, 2) 
      }] 
    };
  }
};
