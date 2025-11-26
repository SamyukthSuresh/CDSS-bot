// /lib/pinecone.ts
import { pinecone, openai } from "./client";
import { PINECONE_INDEX_NAME } from '@/config';

export async function upsertTextToPinecone({
  id,
  text,
  namespace = "default",
  metadata = {},
}: {
  id: string;
  text: string;
  namespace?: string;
  metadata?: Record<string, any>;
}) {
  if (!process.env.PINECONE_INDEX) throw new Error("PINECONE_INDEX not set");

  const index = pinecone.Index(PINECONE_INDEX);

  // 1) create embedding
  const embeddingResp = await openai.embeddings.create({
    model: "llama-text-embed-v2", // or text-embedding-3-large
    input: text,
  });

  const vector = embeddingResp.data[0].embedding;

  // Prepare the payload common to all shapes
  const payloadVectors = [
    {
      id,
      values: vector,
      metadata: {
        text,
        ...metadata,
      },
    },
  ];

  // Try common upsert shapes. Use `any` for runtime flexibility.
  // 1) Modern shape: index.upsert({ vectors: [...], namespace })
  // 2) Some clients expect: index.upsert([...])  (array directly)
  // 3) Some clients expect: index.upsert({ upsertRequest: { vectors: [...], namespace }})
  // We'll attempt them in order and return the first success.
  let lastError: unknown = null;

  // Helper to attach debug context to thrown error
  const throwWithContext = (err: unknown) => {
    const e = new Error(
      "Pinecone upsert failed for all known request shapes. Last error: " +
        (err instanceof Error ? err.message : String(err))
    );
    // include original error for easier debugging in server logs
    // @ts-ignore
    e.cause = err;
    throw e;
  };

  try {
    // Try the object-with-vectors shape first (most common in newer examples)
    // ts-ignore because index.upsert typings may not accept this shape for your client version
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const resp = await index.upsert({ vectors: payloadVectors, namespace });
    return resp;
  } catch (e1) {
    lastError = e1;
  }

  try {
    // Try passing the array directly (older or alternate client shapes)
    // @ts-ignore
    const resp = await index.upsert(payloadVectors);
    return resp;
  } catch (e2) {
    lastError = e2;
  }

  try {
    // Try wrapping in upsertRequest (some SDK variants expect this)
    // @ts-ignore
    const resp = await index.upsert({ upsertRequest: { vectors: payloadVectors, namespace } });
    return resp;
  } catch (e3) {
    lastError = e3;
  }

  // If none worked, surface the last error with context
  throwWithContext(lastError);
}
