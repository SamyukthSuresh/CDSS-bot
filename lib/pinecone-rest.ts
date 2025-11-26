// lib/pinecone-rest.ts
export type Vector = {
  id: string;
  values: number[];
  metadata?: Record<string, any>;
};

export async function upsertVectorsRest({
  host,
  apiKey,
  namespace,
  vectors,
}: {
  host: string;
  apiKey: string;
  namespace?: string;
  vectors: Vector[];
}) {
  if (!host || !apiKey) throw new Error("host and apiKey are required");

  const url = `${host.replace(/\/$/, "")}/vectors/upsert`;
  const body: any = { vectors };
  if (namespace) body.namespace = namespace;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Api-Key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Pinecone REST upsert failed ${res.status}: ${text}`);
  }

  return JSON.parse(text);
}
