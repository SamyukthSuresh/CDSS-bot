import { tool } from 'ai';
import { z } from 'zod';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const paramsSchema = z.object({
  prompt: z.string().min(1).describe('A detailed description of the image to generate'),
  size: z.enum(['1024x1024', '1792x1024', '1024x1792']).optional(),
  quality: z.enum(['standard', 'hd']).optional(),
});

export const imageGeneration = tool({
  description:
    'Generate images based on text descriptions. Use this when the user asks you to create, generate, or draw an image.',
  // no `parameters` field here — validate inside execute
  execute: async (rawInput: unknown) => {
    // validate
    const parsed = paramsSchema.safeParse(rawInput);
    if (!parsed.success) {
      return { success: false, error: 'Invalid parameters: ' + parsed.error.message };
    }
    const { prompt, size } = parsed.data;

    try {
      const response = await openai.images.generate({
        model: 'gpt-image-1',
        prompt,
        n: 1,
        size: size || '1024x1024',
      });

      console.log('Image response:', JSON.stringify(response, null, 2));
      const dataArray = (response as any).data || (response as any)?.data?.data || [];
      const entry = dataArray[0];

      if (!entry) return { success: false, error: 'Image generation returned no data.' };

      const imageUrl = entry.url ?? (entry.b64_json ? `data:image/png;base64,${entry.b64_json}` : null);
      if (!imageUrl) return { success: false, error: 'Failed to extract image URL or base64.' };

      return { success: true, imageUrl, revisedPrompt: entry.revised_prompt ?? null };
    } catch (err) {
      console.error('Image generation error:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Unknown error occurred' };
    }
  },
});
