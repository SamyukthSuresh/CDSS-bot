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
    // new SDK v2 correct format
    const resp = await index.upsert({
      vectors,
      namespace,
    });
    return resp;
  } catch (err) {
    console.error("Pinecone SDK upsert failed:", err);
    throw err;
  }
}
