import { tool } from "ai";
import { z } from "zod";
import { searchPinecone } from "@/lib/pinecone";

export const vectorDatabaseSearch = tool({
    description: 'Search the vector database for patient prescriptions and medical information. Can search by patient name, symptoms, medications, or medical conditions.',
    inputSchema: z.object({
        query: z.string().describe('The search query. For patient records, just use the patient name (e.g., "John Doe"). For medical info, use symptoms or conditions.'),
    }),
    execute: async ({ query }) => {
        console.log('Vector database search called with query:', query);
        const results = await searchPinecone(query);
        console.log('Search results:', results.substring(0, 200) + '...');
        return results;
    },
});
