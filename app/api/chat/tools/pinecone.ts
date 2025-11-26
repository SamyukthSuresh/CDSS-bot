import { pinecone, openai } from "./clients";

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

  const index = pinecone.Index(process.env.PINECONE_INDEX);

  // 1) create embedding
  const embeddingResp = await openai.embeddings.create({
    model: "llama-text-embed-v2", // or large if you prefer
    input: text,
  });

  const vector = embeddingResp.data[0].embedding;

  // 2) upsert into pinecone
  const upsertResp = await index.upsert({
    upsertRequest: {
      vectors: [
        {
          id,
          values: vector,
          metadata: {
            text,
            ...metadata,
          },
        },
      ],
      namespace,
    },
  });

  return upsertResp;
}
