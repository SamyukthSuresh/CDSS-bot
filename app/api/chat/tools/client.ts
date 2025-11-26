import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";


export const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});
