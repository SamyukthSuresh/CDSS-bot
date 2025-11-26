// tools/write-vector-database.ts  (only relevant excerpt)
import { tool } from "ai";
import { z } from "zod";
import { openai } from "@/lib/clients";
import { upsertVectorsSdk } from "@/lib/pinecone-sdk-upsert";

export const writeVectorDatabase = tool({
  description: "Write text to Pinecone using SDK",
  inputSchema: z.object({
    id: z.string().optional(),
    text: z.string(),
    namespace: z.string().optional(),
    metadata: z.object({}).catchall(z.any()).optional(),
  }),
  execute: async ({ id, text, namespace, metadata }) => {
    const vectorId = id ?? `doc-${Date.now()}`;

    // IMPORTANT: use an embedding model that returns 1024-dimensional vectors for your index
    const embResp = await openai.embeddings.create({
      model: "llama-text-embed-v2", // <-- must be 1024-dim model
      input: text,
    });

    const values = embResp.data[0].embedding as number[];

    // quick sanity check: ensure numeric array
    if (!Array.isArray(values) || typeof values[0] !== "number") {
      throw new Error("Invalid embedding returned");
    }

    // Upsert via SDK helper
    const resp = await upsertVectorsSdk({
      indexName: process.env.PINECONE_INDEX!,
      namespace: namespace ?? "default",
      vectors: [
        {
          id: vectorId,
          values,
          metadata: metadata ?? {},
        },
      ],
    });

    return { success: true, id: vectorId, pineconeResponse: resp };
  },
});
