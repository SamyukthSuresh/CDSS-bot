import { pinecone } from "@/lib/clients";

export async function upsertVectorsSdk({
  indexName,
  namespace,
  vectors,
}: {
  indexName: string;
  namespace?: string;
  vectors: Array<{ id: string; values: number[]; metadata?: Record<string, any> }>;
}) {
  const index = pinecone.index(indexName);
  
  try {
    // SDK v2+ correct format - pass vectors directly, namespace as option
    const resp = namespace 
      ? await index.namespace(namespace).upsert(vectors)
      : await index.upsert(vectors);
    
    return resp;
  } catch (err) {
    console.error("Pinecone SDK upsert failed:", err);
    throw err;
  }
}
