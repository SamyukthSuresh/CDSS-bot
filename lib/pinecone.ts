export async function searchPinecone(
    query: string,
    prescriptionId?: string
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
    
    // Build search params object
    const searchParams: any = {
        query: {
            inputs: {
                text: enhancedQuery,
            },
            topK: PINECONE_TOP_K,
        },
        fields: ['text', 'pre_context', 'post_context', 'source_url', 'source_description', 'source_type', 'order'],
    };
    
    // Add filter if prescriptionId is provided
    if (prescriptionId) {
        searchParams.filter = {
            prescriptionId: { $eq: prescriptionId }
        };
    }
    
    const results = await pineconeIndex.namespace('default').searchRecords(searchParams);
    
    console.log('Search completed');
    
    const chunks = searchResultsToChunks(results);
    const sources = getSourcesFromChunks(chunks);
    const context = getContextFromSources(sources);
    
    return `<results>${context}</results>`;
}
