import { tool } from 'ai';
import { z } from 'zod';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const imageGeneration = tool({
  description: 'Generate images based on text descriptions. Use this when the user asks you to create, generate, or draw an image.',
  parameters: z.object({
    prompt: z.string().describe('A detailed description of the image to generate'),
    size: z.enum(['1024x1024', '1792x1024', '1024x1792']).optional(),
    quality: z.enum(['standard', 'hd']).optional(), // ignored by model, but kept for API compatibility
  }),
  execute: async ({ prompt, size }) => {
    try {
      const response = await openai.images.generate({
        model: 'gpt-image-1',               // <-- FIXED from "dall-e-3"
        prompt,
        n: 1,
        size: size || '1024x1024',
      });

      // Debug log — view in Vercel
      console.log('Image response:', JSON.stringify(response, null, 2));

      const dataArray = response.data || response?.data?.data || []; 
      const entry = dataArray[0];

      if (!entry) {
        return {
          success: false,
          error: 'Image generation returned no data.',
        };
      }

      // Many SDKs return either url OR b64_json
      const imageUrl = entry.url
        ? entry.url
        : entry.b64_json
        ? `data:image/png;base64,${entry.b64_json}`
        : null;

      if (!imageUrl) {
        return {
          success: false,
          error: 'Failed to extract image URL or base64.',
        };
      }

      return {
        success: true,
        imageUrl,
        revisedPrompt: entry.revised_prompt || null,
      };

    } catch (error) {
      console.error('Image generation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  },
});
