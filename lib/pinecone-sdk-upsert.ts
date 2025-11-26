/ /lib/pinecone-sdk-upsert.ts
import { pinecone, openai } from "./clients";

export async function upsertVectorsSdk({
  indexName,
  namespace,
  vectors, // array of { id, values, metadata }
}: {
  indexName: string;
  namespace?: string;
  vectors: Array<{ id: string; values: number[]; metadata?: Record<string, any> }>;
}) {
  if (!indexName) throw new Error("indexName required");
  const index = pinecone.Index(indexName);

  // Modern SDK expects an object with `vectors` + optional `namespace`
  // If your installed SDK has a different signature, try the array-only form: index.upsert(vectors)
  try {
    // @ts-ignore - some SDK typings vary between versions
    const resp = await index.upsert({ vectors, namespace });
    return resp;
  } catch (err) {
    // If that fails for your SDK version, try the alternate shapes:
    try {
      // @ts-ignore
      return await index.upsert(vectors);
    } catch (err2) {
      try {
        // @ts-ignore
        return await index.upsert({ upsertRequest: { vectors, namespace } });
      } catch (err3) {
        // Bubble up a helpful error
        const e = new Error("All SDK upsert shapes failed");
        // @ts-ignore
        e.cause = { err, err2, err3 };
        throw e;
      }
    }
  }
}
