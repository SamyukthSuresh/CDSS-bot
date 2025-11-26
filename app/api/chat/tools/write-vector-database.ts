// tools/write-vector-database.ts
import { tool } from "ai";
import { z } from "zod";
import { upsertVectorsRest } from "@/lib/pinecone-rest";
import OpenAI from "openai";
import { PINECONE_HOST, PINECONE_API_KEY } from '@/config';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export const writeVectorDatabase = tool({
  description: "Embed text and store it in Pinecone using REST API",
  inputSchema: z.object({
    id: z.string().optional(),
    text: z.string(),
    namespace: z.string().optional(),
    metadata: z.object({}).catchall(z.any()).optional(),
  }),
  execute: async ({ id, text, namespace, metadata }) => {
    const vectorId = id ?? `doc-${Date.now()}`;

    // Create embedding using OpenAI
    const emb = await openai.embeddings.create({
      model: "llama-text-embed-v2", // <-- If your index uses 1536 dims
      input: text,
    });

    const vector = {
      id: vectorId,
      values: emb.data[0].embedding,
      metadata: metadata ?? {},
    };

    // Call REST upsert
    const resp = await upsertVectorsRest({
      host: PINECONE_HOST,  // Must be set in .env
      apiKey: PINECONE_API_KEY,
      namespace: namespace ?? "default",
      vectors: [vector],
    });

    return {
      success: true,
      id: vectorId,
      pineconeResponse: resp,
    };
  },
});
