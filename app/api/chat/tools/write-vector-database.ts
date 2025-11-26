import { tool } from "ai";
import { z } from "zod";
import { openai } from "@/lib/clients";
import { upsertVectorsSdk } from "@/lib/pinecone-upsert";
import { PINECONE_INDEX_NAME } from '@/config';

export const writeVectorDatabase = tool({
  description: "Embed text and store in Pinecone",
  inputSchema: z.object({
    id: z.string().optional(),
    text: z.string(),
    namespace: z.string().optional(),
    metadata: z.object({}).catchall(z.any()).optional(),
  }),
  execute: async ({ id, text, namespace, metadata }) => {
    const vectorId = id ?? `doc-${Date.now()}`;

    // IMPORTANT: must use a 1024-dim model because your index dimension = 1024
     const emb = await pinecone.inference.embed(
      'multilingual-e5-large', // Use a valid model instead of llama-text-embed-v2
      documents.map(doc => doc.text),
      { inputType: 'passage' }
    );

    const values = emb.data[0].embedding;

    const resp = await upsertVectorsSdk({
      indexName: PINECONE_INDEX_NAME,
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
