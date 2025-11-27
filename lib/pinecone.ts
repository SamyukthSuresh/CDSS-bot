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

// Add this helper function here
function extractKeyInfo(fullText: string, maxLength: number = 800) {
    // Remove the repeated patient name stuff we added for search
    let cleaned = fullText
        .replace(/PRESCRIPTION FOR PATIENT .+\n/gi, '')
        .replace(/This prescription belongs to patient:.+/gi, '')
        .replace(/Medical record for:.+/gi, '');
    
    // If still too long, take first part
    if (cleaned.length > maxLength) {
        cleaned = cleaned.substring(0, maxLength) + '...';
    }
    
    return cleaned.trim();
}

export async function searchPinecone(
    query: string,
    prescriptionId?: string,
    namespace: string = 'default'
): Promise<string> {
    const idPattern = /^[A-Z]{2}\d+$/i;
    const isLikelyId = idPattern.test(query.trim());
    
    if (isLikelyId || prescriptionId) {
        const id = prescriptionId || query.trim();
        console.log('Searching by prescription ID:', id, 'in namespace:', namespace);
        
        const formatArray = (value: any) => {
            if (Array.isArray(value)) return value.join(', ');
            if (typeof value === 'string') return value;
            return 'None listed';
        };
        
        try {
            const fetchResult = await pineconeIndex.namespace(namespace).fetch([id]);
            if (fetchResult.records && fetchResult.records[id]) {
                const record = fetchResult.records[id];
                const metadata = record.metadata;
                
                // Use extractKeyInfo here
                const context = `
Prescription ID: ${id}
Patient: ${metadata?.patientName || 'Unknown'}
Date: ${metadata?.date || 'Unknown'}
Doctor: ${metadata?.doctor || 'Unknown'}
Allergies: ${formatArray(metadata?.allergies)}
Medications: ${formatArray(metadata?.medications)}
Symptoms: ${metadata?.symptoms || 'Not specified'}

Prescription Details:
${extractKeyInfo(metadata?.text as string || '', 800)}
                `.trim();
                
                return `<results>${context}</results>`;
            }
        } catch (err) {
            console.log('Direct fetch failed, trying metadata filter...');
        }
        
        const results = await pineconeIndex.namespace(namespace).query({
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
            
            // Use extractKeyInfo here too
            const context = `
Prescription ID: ${metadata?.prescriptionId || id}
Patient: ${metadata?.patientName || 'Unknown'}
Date: ${metadata?.date || 'Unknown'}
Doctor: ${metadata?.doctor || 'Unknown'}
Allergies: ${formatArray(metadata?.allergies)}
Medications: ${formatArray(metadata?.medications)}
Symptoms: ${metadata?.symptoms || 'Not specified'}

Prescription Details:
${extractKeyInfo(metadata?.text as string || '', 800)}
            `.trim();
            
            return `<results>${context}</results>`;
        }
        
        return `<results>Prescription with ID ${id} not found.</results>`;
    }
    
    // Regular search continues as before...
    const namePattern = /^[A-Z][a-z]+(?: [A-Z][a-z]+){1,2}$/;
    const isProbablyName = namePattern.test(query.trim());
    
    let enhancedQuery = query;
    if (isProbablyName) {
        enhancedQuery = `prescription medical history records for patient ${query} medications allergies`;
    }
    
    console.log('Searching Pinecone with query:', enhancedQuery, 'in namespace:', namespace);
    
    const searchParams: any = {
        query: {
            inputs: {
                text: enhancedQuery,
            },
            topK: PINECONE_TOP_K,
        },
        fields: ['text', 'pre_context', 'post_context', 'source_url', 'source_description', 'source_type', 'order'],
    };
    
    const results = await pineconeIndex.namespace(namespace).searchRecords(searchParams);
    
    console.log('Search completed');
    
    const chunks = searchResultsToChunks(results);
    const sources = getSourcesFromChunks(chunks);
    const context = getContextFromSources(sources);
    
    return `<results>${context}</results>`;
}

export async function fetchPrescriptionById(prescriptionId: string) {
    // ... keep this function as is
}
