import { tool } from 'ai';
import { z } from 'zod';
import { pinecone } from "@/lib/clients";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const writeVectorDatabase = tool({
  description: 'Write or upsert prescription documents to the vector database. Use this to store prescriptions for future retrieval.',
  inputSchema: z.object({
    namespace: z.string().optional().describe('The namespace to write to (use "default" if not specified)'),
    texts: z.array(
      z.object({
        id: z.string().describe('Unique prescription ID (e.g., RX123456)'),
        text: z.string().describe('The complete prescription text to store'),
        metadata: z.object({
          patientName: z.string().describe('Patient full name'),
          date: z.string().describe('Prescription date'),
          prescriptionId: z.string().describe('Prescription ID'),
          allergies: z.array(z.string()).describe('List of patient allergies'),
          medications: z.array(z.any()).optional().describe('List of medications'),
          doctor: z.string().describe('Doctor name'),
          symptoms: z.string().optional().describe('Patient symptoms'),
        }).passthrough(),
      })
    ).describe('Array of prescription documents to upsert to the database'),
  }),
  execute: async ({ namespace, texts }) => {
    const indexName = 'cdss-bot';
    const index = pinecone.index(indexName);
    
    try {
      const embeddingPromises = texts.map(async (item) => {
  // Convert medications from objects to strings
  const medicationsStrings = item.metadata.medications 
    ? item.metadata.medications.map((med: any) => {
        if (typeof med === 'string') return med;
        // Convert medication object to a readable string
        return `${med.name || 'Unknown'} - ${med.dosage || ''} ${med.frequency || ''} ${med.duration || ''}`.trim();
      })
    : [];
  
  // Enhance text with patient name for better searchability
  const enhancedText = `
PRESCRIPTION FOR PATIENT ${item.metadata.patientName.toUpperCase()}
Patient Name: ${item.metadata.patientName}
Prescription ID: ${item.metadata.prescriptionId}
Date: ${item.metadata.date}
Doctor: ${item.metadata.doctor}
${item.metadata.symptoms ? `Symptoms: ${item.metadata.symptoms}` : ''}
Allergies: ${item.metadata.allergies.join(', ')}
Medications: ${medicationsStrings.join(', ')}

${item.text}

This prescription belongs to patient: ${item.metadata.patientName}
Medical record for: ${item.metadata.patientName}
  `.trim();
  
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: enhancedText,
    dimensions: 1024,
  });
  
  return {
    id: item.id,
    values: response.data[0].embedding,
    metadata: { 
      ...item.metadata,
      medications: medicationsStrings, // Store as string array
      text: enhancedText
    },
  };
});
      
      const vectors = await Promise.all(embeddingPromises);
      
      const resp = await index.namespace('default').upsert(vectors);
       
      
      return {
        success: true,
        upsertedCount: texts.length,
        vectorIds: vectors.map(v => v.id), // Return the IDs!
        indexName,
        namespace: 'default',
        message: `Successfully stored ${texts.length} prescription(s). Vector IDs: ${vectors.map(v => v.id).join(', ')}`,
      };
    } catch (err) {
      console.error("Pinecone upsert failed:", err);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error occurred',
        message: 'Failed to write to vector database.',
      };
    }
  },
});
