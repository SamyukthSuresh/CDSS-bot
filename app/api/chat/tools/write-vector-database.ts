import { tool } from "ai";
import { z } from "zod";
import { upsertTextToPinecone } from "@/lib/pinecone";

export const writeVectorDatabase = tool({
  description: "Write a text and its OpenAI embedding into Pinecone",
  inputSchema: z.object({
    id: z.string().optional().describe("Unique id for the vector. If omitted, server will generate one."),
    text: z.string().describe("The text to embed and store"),
    namespace: z.string().optional(),
    metadata: z.record(z.any()).optional(),
  }),
  execute: async ({ id, text, namespace, metadata }) => {
    // generate an id if not provided
    const vectorId = id ?? `doc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const resp = await upsertTextToPinecone({
      id: vectorId,
      text,
      namespace,
      metadata: metadata ?? {},
    });

    return {
      success: true,
      id: vectorId,
      pineconeResponse: resp,
    };
  },
});
