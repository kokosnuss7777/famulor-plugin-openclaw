/**
 * Famulor Tools — Knowledge Bases
 */

import { Type } from "@sinclair/typebox";
import { FamulorApiClient, getConfigFromEnv } from "../api-client";

// Tool: Create Knowledge Base
export const createKnowledgebaseTool = {
  name: "famulor_create_knowledgebase",
  description: "Erstellt eine neue Wissensdatenbank für einen Assistenten.",
  parameters: Type.Object({
    name: Type.String({ description: "Name der Wissensdatenbank" }),
    description: Type.Optional(Type.String({ description: "Beschreibung" }))
  }),
  execute: async (params: Record<string, unknown>) => {
    const client = new FamulorApiClient(getConfigFromEnv());
    const result = await client.createKnowledgebase(
      params.name as string,
      params.description as string | undefined
    );
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
};

// Tool: List Knowledge Bases
export const listKnowledgebasesTool = {
  name: "famulor_list_knowledgebases",
  description: "Listet alle Wissensdatenbanken des Accounts auf.",
  parameters: Type.Object({}),
  execute: async () => {
    const client = new FamulorApiClient(getConfigFromEnv());
    const result = await client.listKnowledgebases();
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
};

// Tool: Create Document (URL, Links, or Text)
export const createDocumentTool = {
  name: "famulor_create_document",
  description: "Fügt ein Dokument zu einer Wissensdatenbank hinzu. Unterstützt URL (Website scrapen), Links (mehrere URLs), oder Text.",
  parameters: Type.Object({
    kb_id: Type.Number({ description: "ID der Wissensdatenbank" }),
    name: Type.String({ description: "Name des Dokuments" }),
    type: Type.Union([
      Type.Literal("url"),
      Type.Literal("links"),
      Type.Literal("text")
    ], { description: "Typ: url=Website scrapen, links=mehrere URLs, text=Textinhalt" }),
    url: Type.Optional(Type.String({ description: "URL zum Scrapen (bei type=url)" })),
    links: Type.Optional(Type.Array(Type.String(), { description: "Array von URLs (bei type=links)" })),
    relative_links_limit: Type.Optional(Type.Number({ description: "Wie viele relative Links folgen (bei type=url/links)" })),
    description: Type.Optional(Type.String())
  }),
  execute: async (params: Record<string, unknown>) => {
    const client = new FamulorApiClient(getConfigFromEnv());
    const result = await client.createDocument(
      params.kb_id as number,
      params.name as string,
      params.type as string,
      {
        description: params.description as string | undefined,
        url: params.url as string | undefined,
        links: params.links as string[] | undefined,
        relativeLinksLimit: params.relative_links_limit as number | undefined
      }
    );
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
};
