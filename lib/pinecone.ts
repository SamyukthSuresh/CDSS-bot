import { Pinecone } from '@pinecone-database/pinecone';
import { PINECONE_TOP_K } from '@/config';
import { searchResultsToChunks, getSourcesFromChunks, getContextFromSources } from '@/lib/sources';
import { PINECONE_INDEX_NAME } from '@/config';
if (!process.env.PINECONE_API_KEY) {
    throw new Error('PINECONE_API_KEY is not set');
}
export const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
});
export const pineconeIndex = pinecone.Index(PINECONE_INDEX_NAME);
export async function searchPinecone(
    query: string,
    prescriptionId?: string
): Promise<string> {
    // Check if query looks like a prescription ID
    const idPattern = /^[A-Z]{2}\d+$/i; // Matches RX123456, PR123456, etc.
    const isLikelyId = idPattern.test(query.trim());
    
    // If it's an ID, use metadata filter instead of vector search
    if (isLikelyId || prescriptionId) {
        const id = prescriptionId || query.trim();
        console.log('Searching by prescription ID metadata:', id);
        
        const results = await pineconeIndex.namespace('default').query({
            vector: Array(1024).fill(0), // Dummy vector since we're filtering by metadata
            topK: 1,
            filter: {
                prescriptionId: { $eq: id }
            },
            includeMetadata: true,
        });
        
        if (results.matches && results.matches.length > 0) {
            const match = results.matches[0];
            const metadata = match.metadata;
            
            const context = `
Prescription ID: ${metadata?.prescriptionId || id}
Patient: ${metadata?.patientName || 'Unknown'}
Date: ${metadata?.date || 'Unknown'}
Doctor: ${metadata?.doctor || 'Unknown'}
Allergies: ${metadata?.allergies?.join(', ') || 'None listed'}
Medications: ${metadata?.medications?.join(', ') || 'None listed'}

Full Details:
${metadata?.text || 'No details available'}
            `.trim();
            
            return `<results>${context}</results>`;
        }
        
        return `<results>Prescription with ID ${id} not found.</results>`;
    }
    
    // Regular search for patient names or other queries
    const namePattern = /^[A-Z][a-z]+(?: [A-Z][a-z]+){1,2}$/;
    const isProbablyName = namePattern.test(query.trim());
    
    let enhancedQuery = query;
    if (isProbablyName) {
        enhancedQuery = `prescription medical history records for patient ${query} medications allergies`;
    }
    
    console.log('Searching Pinecone with query:', enhancedQuery);
    
    const searchParams: any = {
        query: {
            inputs: {
                text: enhancedQuery,
            },
            topK: PINECONE_TOP_K,
        },
        fields: ['text', 'pre_context', 'post_context', 'source_url', 'source_description', 'source_type', 'order'],
    };
    
    const results = await pineconeIndex.namespace('default').searchRecords(searchParams);
    
    console.log('Search completed');
    
    const chunks = searchResultsToChunks(results);
    const sources = getSourcesFromChunks(chunks);
    const context = getContextFromSources(sources);
    
    return `<results>${context}</results>`;
}
