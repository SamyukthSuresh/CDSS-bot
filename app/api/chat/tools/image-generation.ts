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
    size: z.enum(['1024x1024', '1792x1024', '1024x1792']).default('1024x1024').describe('The size of the generated image'),
    quality: z.enum(['standard', 'hd']).default('standard').describe('The quality of the image'),
  }),
  execute: async ({ prompt, size, quality }) => {
    try {
      const response = await openai.images.generate({
        model: 'dall-e-3', // GPT-4.1 uses DALL-E 3 for image generation
        prompt: prompt,
        n: 1,
        size: size,
        quality: quality,
      });

      const imageUrl = response.data[0]?.url;
      
      if (!imageUrl) {
        return {
          success: false,
          error: 'Failed to generate image',
        };
      }

      return {
        success: true,
        imageUrl: imageUrl,
        revisedPrompt: response.data[0]?.revised_prompt,
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
