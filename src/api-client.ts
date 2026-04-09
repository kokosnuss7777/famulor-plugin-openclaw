/**
 * Famulor API Client — TypeScript
 * Wraps the Famulor REST API for assistant management, knowledge bases, etc.
 */

export interface FamulorConfig {
  apiKey: string;
  baseUrl?: string;
}

export interface AssistantPayload {
  name: string;
  voice_id: number;
  language_id: number;
  type: "inbound" | "outbound";
  mode: "pipeline" | "multimodal" | "dualplex";
  timezone?: string;
  initial_message?: string;
  system_prompt: string;
  llm_model?: string;
  allow_interruptions?: boolean;
  fillers?: boolean;
  enable_noise_cancellation?: boolean;
  record?: boolean;
  post_call_evaluation?: boolean;
  post_call_schema?: Array<{
    name: string;
    description?: string;
    type: "bool" | "string" | "int" | "float";
    enum?: string[];
  }>;
  ambient_sound?: string;
  synthesizer_provider_id?: number;
  secondary_language_ids?: number[];
  knowledgebase_id?: number;
  knowledgebase_mode?: "function_call" | "prompt";
  tools?: Array<{
    type: string;
    data: Record<string, unknown>;
  }>;
}

export interface ApiResponse<T = unknown> {
  error?: boolean;
  status_code?: number;
  message?: string;
  errors?: Record<string, string[]>;
  data?: T;
}

export class FamulorApiClient {
  private apiKey: string;
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor(config: FamulorConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || "https://app.famulor.de/api";
    this.headers = {
      "Authorization": `Bearer ${this.apiKey}`,
      "Accept": "application/json",
      "Content-Type": "application/json",
    };
  }

  private async request<T>(
    method: string,
    endpoint: string,
    data?: unknown,
    params?: Record<string, string | number>
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const options: RequestInit = {
      method,
      headers: this.headers,
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    if (params) {
      const searchParams = new URLSearchParams();
      for (const [key, value] of Object.entries(params)) {
        searchParams.append(key, String(value));
      }
      options.body = options.body || undefined;
    }

    try {
      const response = await fetch(url, options);

      if (response.status === 204) {
        return { status: true } as ApiResponse<T>;
      }

      const json: any = await response.json();

      if (!response.ok) {
        return {
          error: true,
          status_code: response.status,
          message: json.message || response.statusText,
          errors: json.errors,
        };
      }

      return json;
    } catch (err) {
      return {
        error: true,
        message: err instanceof Error ? err.message : "Unknown error",
      };
    }
  }

  // ── Assistants ──────────────────────────────────────────────────────────

  async createAssistant(payload: AssistantPayload): Promise<ApiResponse> {
    // IMPORTANT: Endpoint is /user/assistant (singular!)
    return this.request("POST", "/user/assistant", payload);
  }

  async updateAssistant(
    assistantId: number,
    payload: Partial<AssistantPayload>
  ): Promise<ApiResponse> {
    return this.request("PATCH", `/user/assistants/${assistantId}`, payload);
  }

  async listAssistants(
    perPage = 100,
    page = 1
  ): Promise<ApiResponse<{ assistants: unknown[]; total: number }>> {
    return this.request("GET", "/user/assistants", undefined, {
      per_page: perPage,
      page,
    });
  }

  async getAssistant(assistantId: number): Promise<ApiResponse> {
    return this.request("GET", `/user/assistants/${assistantId}`);
  }

  // ── Lookup ─────────────────────────────────────────────────────────────

  async getLanguages(): Promise<ApiResponse<{ languages: unknown[] }>> {
    return this.request("GET", "/user/assistants/languages");
  }

  async getVoices(mode?: string): Promise<ApiResponse<{ voices: unknown[] }>> {
    return this.request("GET", "/user/assistants/voices", undefined, mode ? { mode } : undefined);
  }

  async getModels(): Promise<ApiResponse<{ models: unknown[] }>> {
    return this.request("GET", "/user/assistants/models");
  }

  async getPhoneNumbers(): Promise<ApiResponse<{ phone_numbers: unknown[] }>> {
    return this.request("GET", "/user/assistants/phone-numbers");
  }

  async getSynthesizerProviders(): Promise<ApiResponse<{ providers: unknown[] }>> {
    return this.request("GET", "/user/assistants/synthesizer-providers");
  }

  async getTranscriberProviders(): Promise<ApiResponse<{ providers: unknown[] }>> {
    return this.request("GET", "/user/assistants/transcriber-providers");
  }

  // ── Knowledge Bases ───────────────────────────────────────────────────

  async createKnowledgebase(
    name: string,
    description?: string
  ): Promise<ApiResponse> {
    return this.request("POST", "/user/knowledgebases", {
      name,
      ...(description && { description }),
    });
  }

  async listKnowledgebases(): Promise<ApiResponse<{ knowledgebases: unknown[] }>> {
    return this.request("GET", "/user/knowledgebases");
  }

  async createDocument(
    kbId: number,
    name: string,
    docType: string,
    options?: {
      description?: string;
      url?: string;
      links?: string[];
      relativeLinksLimit?: number;
    }
  ): Promise<ApiResponse> {
    const data: Record<string, unknown> = {
      name,
      type: docType,
    };

    if (options?.description) data.description = options.description;
    if (options?.url) data.url = options.url;
    if (options?.links) data.links = options.links;
    if (options?.relativeLinksLimit) data.relative_links_limit = options.relativeLinksLimit;

    return this.request("POST", `/user/knowledgebases/${kbId}/documents`, data);
  }

  // ── Webhooks ──────────────────────────────────────────────────────────

  async enableWebhook(
    assistantUuid: string,
    webhookUrl: string
  ): Promise<ApiResponse> {
    return this.request("POST", `/user/assistants/${assistantUuid}/webhook`, {
      webhook_url: webhookUrl,
    });
  }

  async enableConversationEndedWebhook(
    assistantUuid: string,
    webhookUrl: string
  ): Promise<ApiResponse> {
    return this.request(
      "POST",
      `/user/assistants/${assistantUuid}/conversation-ended-webhook`,
      { webhook_url: webhookUrl }
    );
  }

  // ── Test ──────────────────────────────────────────────────────────────

  async createTestConversation(
    assistantId: number
  ): Promise<ApiResponse> {
    return this.request("POST", "/conversations", {
      assistant_id: assistantId,
      type: "test",
    });
  }

  async sendTestMessage(
    conversationId: string,
    message: string
  ): Promise<ApiResponse> {
    return this.request("POST", `/conversations/${conversationId}/messages`, {
      message,
    });
  }
}

// ── Config Helper ────────────────────────────────────────────────────────

export function getConfigFromEnv(): FamulorConfig {
  const apiKey = process.env.FAMULOR_API_KEY;
  if (!apiKey) {
    throw new Error(
      "FAMULOR_API_KEY not set. Get your key at https://app.famulor.de → API Keys."
    );
  }
  return {
    apiKey,
    baseUrl: process.env.FAMULOR_BASE_URL,
  };
}
