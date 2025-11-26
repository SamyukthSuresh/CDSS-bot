import { pinecone } from "@/lib/clients";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function upsertTextsSdk({
  indexName,
  namespace,
  texts,
}: {
  indexName: string;
  namespace?: string;
  texts: Array<{ id: string; text: string; metadata?: Record<string, any> }>;
}) {
  const index = pinecone.index(indexName);
  
  try {
    // Generate embeddings
    const embeddingPromises = texts.map(async (item) => {
      const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: item.text,
        dimensions: 1024, // ⭐ Match your Pinecone index dimension
      });
      
      return {
        id: item.id,
        values: response.data[0].embedding,
        metadata: { ...item.metadata, text: item.text },
      };
    });

    const vectors = await Promise.all(embeddingPromises);

    // Upsert to Pinecone
    const resp = namespace 
      ? await index.namespace(namespace).upsert(vectors)
      : await index.upsert(vectors);
    
    return resp;
  } catch (err) {
    console.error("Pinecone upsert failed:", err);
    throw err;
  }
}
