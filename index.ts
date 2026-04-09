/**
 * Famulor OpenClaw Plugin
 * 
 * Vollständige Integration der Famulor AI-Telefonplattform in OpenClaw.
 * Ermöglicht das Erstellen und Verwalten von KI-Telefonassistenten.
 * 
 * Tools:
 *   - Assistant Management (create, update, list, get)
 *   - Lookup (languages, voices, models, phone numbers)
 *   - Knowledge Bases (create, list, add documents)
 *   - Webhooks (enable, test conversations)
 */

import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";

// Import all tools
import { createAssistantTool, updateAssistantTool, listAssistantsTool, getAssistantTool } from "./src/tools/assistant-tools";
import { getLanguagesTool, getVoicesTool, getModelsTool, getPhoneNumbersTool, getSynthesizerProvidersTool, getTranscriberProvidersTool } from "./src/tools/lookup-tools";
import { createKnowledgebaseTool, listKnowledgebasesTool, createDocumentTool } from "./src/tools/knowledge-tools";
import { enableWebhookTool, enableConversationEndedWebhookTool, createTestConversationTool, sendTestMessageTool, enableWebhookWithMccTool, createMccLeadFromCallTool } from "./src/tools/webhook-tools";

// Plugin definition
const plugin = definePluginEntry({
  id: "famulor",
  name: "Famulor.io",
  description: "KI-Telefonassistenten erstellen und verwalten. Onboarding, Assistant-Management, Wissensdatenbanken, Webhooks.",
  version: "1.0.0",
  
  register(api) {
    // ── Assistant Management ────────────────────────────────────────────
    api.registerTool({
      name: createAssistantTool.name,
      description: createAssistantTool.description,
      parameters: createAssistantTool.parameters as any,
      execute: createAssistantTool.execute as any,
    });

    api.registerTool({
      name: updateAssistantTool.name,
      description: updateAssistantTool.description,
      parameters: updateAssistantTool.parameters as any,
      execute: updateAssistantTool.execute as any,
    });

    api.registerTool({
      name: listAssistantsTool.name,
      description: listAssistantsTool.description,
      parameters: listAssistantsTool.parameters as any,
      execute: listAssistantsTool.execute as any,
    });

    api.registerTool({
      name: getAssistantTool.name,
      description: getAssistantTool.description,
      parameters: getAssistantTool.parameters as any,
      execute: getAssistantTool.execute as any,
    });

    // ── Lookup ─────────────────────────────────────────────────────────
    api.registerTool({
      name: getLanguagesTool.name,
      description: getLanguagesTool.description,
      parameters: getLanguagesTool.parameters as any,
      execute: getLanguagesTool.execute as any,
    });

    api.registerTool({
      name: getVoicesTool.name,
      description: getVoicesTool.description,
      parameters: getVoicesTool.parameters as any,
      execute: getVoicesTool.execute as any,
    });

    api.registerTool({
      name: getModelsTool.name,
      description: getModelsTool.description,
      parameters: getModelsTool.parameters as any,
      execute: getModelsTool.execute as any,
    });

    api.registerTool({
      name: getPhoneNumbersTool.name,
      description: getPhoneNumbersTool.description,
      parameters: getPhoneNumbersTool.parameters as any,
      execute: getPhoneNumbersTool.execute as any,
    });

    api.registerTool({
      name: getSynthesizerProvidersTool.name,
      description: getSynthesizerProvidersTool.description,
      parameters: getSynthesizerProvidersTool.parameters as any,
      execute: getSynthesizerProvidersTool.execute as any,
    });

    api.registerTool({
      name: getTranscriberProvidersTool.name,
      description: getTranscriberProvidersTool.description,
      parameters: getTranscriberProvidersTool.parameters as any,
      execute: getTranscriberProvidersTool.execute as any,
    });

    // ── Knowledge Bases ────────────────────────────────────────────────
    api.registerTool({
      name: createKnowledgebaseTool.name,
      description: createKnowledgebaseTool.description,
      parameters: createKnowledgebaseTool.parameters as any,
      execute: createKnowledgebaseTool.execute as any,
    });

    api.registerTool({
      name: listKnowledgebasesTool.name,
      description: listKnowledgebasesTool.description,
      parameters: listKnowledgebasesTool.parameters as any,
      execute: listKnowledgebasesTool.execute as any,
    });

    api.registerTool({
      name: createDocumentTool.name,
      description: createDocumentTool.description,
      parameters: createDocumentTool.parameters as any,
      execute: createDocumentTool.execute as any,
    });

    // ── Webhooks & Testing ─────────────────────────────────────────────
    api.registerTool({
      name: enableWebhookTool.name,
      description: enableWebhookTool.description,
      parameters: enableWebhookTool.parameters as any,
      execute: enableWebhookTool.execute as any,
    });

    api.registerTool({
      name: enableConversationEndedWebhookTool.name,
      description: enableConversationEndedWebhookTool.description,
      parameters: enableConversationEndedWebhookTool.parameters as any,
      execute: enableConversationEndedWebhookTool.execute as any,
    });

    api.registerTool({
      name: createTestConversationTool.name,
      description: createTestConversationTool.description,
      parameters: createTestConversationTool.parameters as any,
      execute: createTestConversationTool.execute as any,
    });

    api.registerTool({
      name: sendTestMessageTool.name,
      description: sendTestMessageTool.description,
      parameters: sendTestMessageTool.parameters as any,
      execute: sendTestMessageTool.execute as any,
    });

    // ── MCC Integration ──────────────────────────────────────────────
    api.registerTool({
      name: enableWebhookWithMccTool.name,
      description: enableWebhookWithMccTool.description,
      parameters: enableWebhookWithMccTool.parameters as any,
      execute: enableWebhookWithMccTool.execute as any,
    });

    api.registerTool({
      name: createMccLeadFromCallTool.name,
      description: createMccLeadFromCallTool.description,
      parameters: createMccLeadFromCallTool.parameters as any,
      execute: createMccLeadFromCallTool.execute as any,
    });

    console.log("[famulor] Plugin geladen. 17 Tools registriert.");
  },
});

export default plugin;
