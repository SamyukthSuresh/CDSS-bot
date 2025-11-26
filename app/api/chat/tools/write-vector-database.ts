import { tool } from 'ai';
import { z } from 'zod';
import { pinecone } from "@/lib/clients";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const writeVectorDatabase = tool({
  description: 'Write or upsert documents to the vector database. Use this to store information for future retrieval.',
  inputSchema: z.object({
    namespace: z.string().optional().describe('The namespace to write to (use "default" if not specified)'),
    texts: z.array(
      z.object({
        id: z.string().describe('Unique identifier for the document'),
        text: z.string().describe('The text content to embed and store'),
        metadata: z.record(z.string(), z.any()).optional().describe('Additional metadata to store with the vector'),
      })
    ).describe('Array of documents to upsert to the database'),
  }),
  execute: async ({ namespace, texts }) => {
    const indexName = 'cdss-bot';
    const index = pinecone.index(indexName);
    
    try {
      const embeddingPromises = texts.map(async (item) => {
        const response = await openai.embeddings.create({
          model: "text-embedding-3-small",
          input: item.text,
          dimensions: 1024,
        });
        
        return {
          id: item.id,
          values: response.data[0].embedding,
          metadata: { ...item.metadata, text: item.text },
        };
      });

      const vectors = await Promise.all(embeddingPromises);

      const resp = namespace 
        ? await index.namespace(namespace).upsert(vectors)
        : await index.upsert(vectors);
      
      return {
        success: true,
        upsertedCount: texts.length,
        indexName,
        namespace: namespace || 'default',
        message: `Successfully stored ${texts.length} document(s) in the vector database.`,
      };
    } catch (err) {
      console.error("Pinecone upsert failed:", err);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error occurred',
        message: 'Failed to write to vector database.',
      };
    }
  },
});
