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
import { enableWebhookTool, enableConversationEndedWebhookTool, createTestConversationTool, sendTestMessageTool } from "./src/tools/webhook-tools";
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
            parameters: createAssistantTool.parameters,
            execute: createAssistantTool.execute,
        });
        api.registerTool({
            name: updateAssistantTool.name,
            description: updateAssistantTool.description,
            parameters: updateAssistantTool.parameters,
            execute: updateAssistantTool.execute,
        });
        api.registerTool({
            name: listAssistantsTool.name,
            description: listAssistantsTool.description,
            parameters: listAssistantsTool.parameters,
            execute: listAssistantsTool.execute,
        });
        api.registerTool({
            name: getAssistantTool.name,
            description: getAssistantTool.description,
            parameters: getAssistantTool.parameters,
            execute: getAssistantTool.execute,
        });
        // ── Lookup ─────────────────────────────────────────────────────────
        api.registerTool({
            name: getLanguagesTool.name,
            description: getLanguagesTool.description,
            parameters: getLanguagesTool.parameters,
            execute: getLanguagesTool.execute,
        });
        api.registerTool({
            name: getVoicesTool.name,
            description: getVoicesTool.description,
            parameters: getVoicesTool.parameters,
            execute: getVoicesTool.execute,
        });
        api.registerTool({
            name: getModelsTool.name,
            description: getModelsTool.description,
            parameters: getModelsTool.parameters,
            execute: getModelsTool.execute,
        });
        api.registerTool({
            name: getPhoneNumbersTool.name,
            description: getPhoneNumbersTool.description,
            parameters: getPhoneNumbersTool.parameters,
            execute: getPhoneNumbersTool.execute,
        });
        api.registerTool({
            name: getSynthesizerProvidersTool.name,
            description: getSynthesizerProvidersTool.description,
            parameters: getSynthesizerProvidersTool.parameters,
            execute: getSynthesizerProvidersTool.execute,
        });
        api.registerTool({
            name: getTranscriberProvidersTool.name,
            description: getTranscriberProvidersTool.description,
            parameters: getTranscriberProvidersTool.parameters,
            execute: getTranscriberProvidersTool.execute,
        });
        // ── Knowledge Bases ────────────────────────────────────────────────
        api.registerTool({
            name: createKnowledgebaseTool.name,
            description: createKnowledgebaseTool.description,
            parameters: createKnowledgebaseTool.parameters,
            execute: createKnowledgebaseTool.execute,
        });
        api.registerTool({
            name: listKnowledgebasesTool.name,
            description: listKnowledgebasesTool.description,
            parameters: listKnowledgebasesTool.parameters,
            execute: listKnowledgebasesTool.execute,
        });
        api.registerTool({
            name: createDocumentTool.name,
            description: createDocumentTool.description,
            parameters: createDocumentTool.parameters,
            execute: createDocumentTool.execute,
        });
        // ── Webhooks & Testing ─────────────────────────────────────────────
        api.registerTool({
            name: enableWebhookTool.name,
            description: enableWebhookTool.description,
            parameters: enableWebhookTool.parameters,
            execute: enableWebhookTool.execute,
        });
        api.registerTool({
            name: enableConversationEndedWebhookTool.name,
            description: enableConversationEndedWebhookTool.description,
            parameters: enableConversationEndedWebhookTool.parameters,
            execute: enableConversationEndedWebhookTool.execute,
        });
        api.registerTool({
            name: createTestConversationTool.name,
            description: createTestConversationTool.description,
            parameters: createTestConversationTool.parameters,
            execute: createTestConversationTool.execute,
        });
        api.registerTool({
            name: sendTestMessageTool.name,
            description: sendTestMessageTool.description,
            parameters: sendTestMessageTool.parameters,
            execute: sendTestMessageTool.execute,
        });
        console.log("[famulor] Plugin geladen. 15 Tools registriert.");
    },
});
export default plugin;
