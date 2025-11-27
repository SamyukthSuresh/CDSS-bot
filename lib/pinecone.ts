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
    
    // If it's an ID, try both methods
    if (isLikelyId || prescriptionId) {
        const id = prescriptionId || query.trim();
        console.log('Searching by prescription ID:', id);
        
        // Helper function to safely handle array metadata
        const formatArray = (value: any) => {
            if (Array.isArray(value)) return value.join(', ');
            if (typeof value === 'string') return value;
            return 'None listed';
        };
        
        // First try: Fetch directly by vector ID
        try {
            const fetchResult = await pineconeIndex.namespace('default').fetch([id]);
            if (fetchResult.records && fetchResult.records[id]) {
                const record = fetchResult.records[id];
                const metadata = record.metadata;
                
                const context = `
Prescription ID: ${id}
Patient: ${metadata?.patientName || 'Unknown'}
Date: ${metadata?.date || 'Unknown'}
Doctor: ${metadata?.doctor || 'Unknown'}
Allergies: ${formatArray(metadata?.allergies)}
Medications: ${formatArray(metadata?.medications)}

Full Details:
${metadata?.text || 'No details available'}
                `.trim();
                
                return `<results>${context}</results>`;
            }
        } catch (err) {
            console.log('Direct fetch failed, trying metadata filter...');
        }
        
        // Second try: Query by metadata filter
        const results = await pineconeIndex.namespace('default').query({
            vector: Array(1024).fill(0),
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
Allergies: ${formatArray(metadata?.allergies)}
Medications: ${formatArray(metadata?.medications)}

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

export async function fetchPrescriptionById(prescriptionId: string) {
    try {
        console.log('Fetching prescription by ID:', prescriptionId);
        
        const result = await pineconeIndex.namespace('default').fetch([prescriptionId]);
        
        if (result.records && result.records[prescriptionId]) {
            const record = result.records[prescriptionId];
            console.log('Prescription found');
            
            // Helper function to safely handle array metadata
            const formatArray = (value: any) => {
                if (Array.isArray(value)) return value.join(', ');
                if (typeof value === 'string') return value;
                return 'None listed';
            };
            
            // Format the result similar to search results
            const context = `
Prescription ID: ${prescriptionId}
Patient: ${record.metadata?.patientName || 'Unknown'}
Date: ${record.metadata?.date || 'Unknown'}
Doctor: ${record.metadata?.doctor || 'Unknown'}
Allergies: ${formatArray(record.metadata?.allergies)}
Medications: ${formatArray(record.metadata?.medications)}

Full Details:
${record.metadata?.text || 'No details available'}
            `.trim();
            
            return `<results>${context}</results>`;
        }
        
        console.log('Prescription not found');
        return `<results>Prescription with ID ${prescriptionId} not found.</results>`;
        
    } catch (error) {
        console.error('Fetch by ID failed:', error);
        return `<results>Error fetching prescription: ${error instanceof Error ? error.message : 'Unknown error'}</results>`;
    }
}
