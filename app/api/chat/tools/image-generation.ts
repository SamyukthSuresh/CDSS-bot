import { tool } from "ai";
import { z } from "zod";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const imageGeneration = tool({
  description: "Generate images based on text descriptions. Returns { success, imageUrl, revisedPrompt }.",
  inputSchema: z.object({
    prompt: z.string().min(1).describe("A detailed description of the image to generate"),
    size: z.enum(["1024x1024", "1792x1024", "1024x1792"]).optional(),
    quality: z.enum(["standard", "hd"]).optional(), // kept for compatibility, not used by API
  }),
  execute: async ({ prompt, size, quality }) => {
    // Basic env check
    if (!process.env.OPENAI_API_KEY) {
      return { success: false, error: "OPENAI_API_KEY is not set in environment" };
    }

    try {
      // Call the OpenAI Images API (openai@6.x)
      const response = await openai.images.generate({
        model: "gpt-4.1", // correct model id for image generation
        prompt,
        n: 1,
        size: (size as "1024x1024" | "1792x1024" | "1024x1792") ?? "1024x1024",
      });

      // Debug: inspect raw response in Vercel logs
      console.log("OpenAI images.generate response:", JSON.stringify(response, null, 2));

      // Support a few different response shapes across SDK versions
      const dataArray = (response as any).data ?? (response as any)?.data?.data ?? [];
      const entry = dataArray[0];

      if (!entry) {
        return { success: false, error: "Image generation returned no data." };
      }

      // Prefer url, fallback to base64
      const imageUrl =
        entry.url ??
        (entry.b64_json ? `data:image/png;base64,${entry.b64_json}` : null);

      if (!imageUrl) {
        return { success: false, error: "Failed to extract image URL or base64." };
      }

      return {
        success: true,
        imageUrl,
        revisedPrompt: entry.revised_prompt ?? null,
      };
    } catch (err: any) {
      console.error("Image generation error:", err);
      const message = err?.message ?? JSON.stringify(err);
      return { success: false, error: String(message) };
    }
  },
});
