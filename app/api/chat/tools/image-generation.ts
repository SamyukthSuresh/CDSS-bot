import { tool } from 'ai';
import { z } from 'zod';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const imageGeneration = tool({
  description:
    'Generate images based on text descriptions. Use this when the user asks you to create, generate, or draw an image.',
  parameters: z.object({
    prompt: z.string().min(1).describe('A detailed description of the image to generate'),
    size: z.enum(['1024x1024', '1792x1024', '1024x1792']).optional().describe('The size of the generated image'),
    // removed `quality` because it's not a standard images parameter
  }),
  execute: async ({ prompt, size }) => {
    if (!process.env.OPENAI_API_KEY) {
      return {
        success: false,
        error: 'OPENAI_API_KEY is not set in environment',
      };
    }

    try {
      // NOTE: use the correct model name for image generation
      const response = await openai.images.generate({
        model: 'gpt-image-1',
        prompt,
        n: 1,
        size: size || '1024x1024',
      });

      // Log the raw response for debugging (remove or lower verbosity in prod)
      console.log('OpenAI images.generate response:', JSON.stringify(response, null, 2));

      const entry = response.data?.[0];
