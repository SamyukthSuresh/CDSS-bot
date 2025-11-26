// /lib/clients.ts
import { PineconeClient } from "@pinecone-database/pinecone";
import OpenAI from "openai";

if (!process.env.PINECONE_API_KEY) {
  console.warn("PINECONE_API_KEY not set");
}
if (!process.env.PINECONE_INDEX) {
  console.warn("PINECONE_INDEX not set");
}

export const pinecone = new PineconeClient();
await pinecone.init({
  apiKey: process.env.PINECONE_API_KEY!,
  environment: process.env.PINECONE_ENV!, // e.g. "aped-4627-b74a"
  // If your SDK/version uses baseUrl/host instead, use `baseUrl: process.env.PINECONE_HOST`
});

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});
