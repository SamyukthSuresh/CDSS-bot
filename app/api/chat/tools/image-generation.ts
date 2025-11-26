import { tool } from 'ai';
import { z } from 'zod';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const paramsSchema = z.object({
  prompt: z.string().min(1).describe('A detailed description of the image to generate'),
  size: z.enum(['1024x1024', '1792x1024', '1024x1792']).optional(),
  // keep quality in the schema for compatibility if you need it, but we won't pass it to the API
  quality: z.enum(['standard', 'hd']).optional(),
});

type Params = z.infer<typeof paramsSchema>;
type Result =
  | { success: true; imageUrl: string; revisedPrompt: string | null }
  | { success: false; error: string };

// Use function form of `tool` to avoid the object-overload mismatch
export const imageGeneration = tool(async (rawInput: unknown): Promise<Result> => {
  const parsed = paramsSchema.safeParse(rawInput);
  if (!parsed.success) {
    return { success: false, error: 'Invalid parameters: ' + parsed.error.message };
  }

  const { prompt, size } = parsed.data as Params;

  if (!process.env.OPENAI_API_KEY) {
    return { success: false, error: 'OPENAI_API_KEY is not set' };
  }

  try {
    const response = await openai.images.generate({
      model: 'gpt-image-1', // correct image model
      prompt,
      n: 1,
      size: size || '1024x1024',
    });

    // Helpful debug logging (remove or lower verbosity in production)
    console.log('OpenAI image response:', JSON.stringify(response, null, 2));

    // Support different SDK shapes
    const dataArray = (response as any).data ?? (response as any)?.data?.data ?? [];
    const entry = dataArray[0];

    if (!entry) return { success: false, error: 'Image generation returned no data.' };

    // Prefer url, fallback to base64 -> data URL
    const imageUrl = entry.url ?? (entry.b64_json ? `data:image/png;base64,${entry.b64_json}` : null);

    if (!imageUrl) return { success: false, error: 'Failed to extract image URL or base64.' };

    return {
      success: true,
      imageUrl,
      revisedPrompt: entry.revised_prompt ?? null,
    };
  } catch (err) {
    console.error('Image generation error:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error occurred' };
  }
});
