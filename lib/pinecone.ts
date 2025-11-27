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
): Promise<string> {
    // Enhance query if it looks like a patient name
    const namePattern = /^[A-Z][a-z]+(?: [A-Z][a-z]+){1,2}$/;
    const isProbablyName = namePattern.test(query.trim());
    
    let enhancedQuery = query;
    if (isProbablyName) {
        // Add context to help find prescriptions by patient name
        enhancedQuery = `prescription medical history records for patient ${query} medications allergies`;
    }
    
    console.log('Searching Pinecone with query:', enhancedQuery);
    
    const results = await pineconeIndex.namespace('default').searchRecords({
        query: {
            inputs: {
                text: enhancedQuery,
            },
            topK: PINECONE_TOP_K,
        },
        fields: ['text', 'pre_context', 'post_context', 'source_url', 'source_description', 'source_type', 'order'],
    });
    
    console.log('Search completed');
    
    const chunks = searchResultsToChunks(results);
    const sources = getSourcesFromChunks(chunks);
    const context = getContextFromSources(sources);
    
    return `<results>${context}</results>`;
}

// New function for upserting prescriptions
export async function upsertPrescription({
    prescriptionId,
    prescriptionText,
    patientName,
    metadata,
}: {
    prescriptionId: string;
    prescriptionText: string;
    patientName: string;
    metadata: Record<string, any>;
}) {
    try {
        // Enhance the text with patient name repeated for better searchability
        const enhancedText = `
PRESCRIPTION FOR PATIENT ${patientName.toUpperCase()}

Patient Name: ${patientName}

${prescriptionText}

This prescription belongs to patient: ${patientName}
Medical record for: ${patientName}
        `.trim();
        
        console.log('Upserting prescription for:', patientName);
        
        // Use upsertRecords with inference API
        const result = await pineconeIndex.namespace('default').upsertRecords({
            records: [
                {
                    id: prescriptionId,
                    text: enhancedText,
                    metadata: {
                        ...metadata,
                        patientName: patientName,
                        source_type: 'prescription',
                        source_description: `Prescription for ${patientName}`,
                    },
                },
            ],
        });
        
        console.log('Upsert successful');
        return result;
    } catch (error) {
        console.error('Upsert failed:', error);
        throw error;
    }
}
