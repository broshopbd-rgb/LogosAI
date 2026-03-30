
import { GoogleGenAI } from "@google/genai";
import { LogoConfig, LogoStyle } from "../types";

export const generateLogoImage = async (config: LogoConfig): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key not found");

  const ai = new GoogleGenAI({ apiKey });
  const modelName = config.isPro ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';
  
  // Construct a more detailed professional prompt
  const enhancedPrompt = `A high-quality professional logo for a brand named "${config.brandName}". 
    Description: ${config.prompt}. 
    Style: ${config.style}. 
    Requirements: Clean professional design, solid white background, high resolution, vector style, 
    centered composition, flat design elements suitable for branding. 
    NO text other than "${config.brandName}" if requested. 
    Aesthetic: ${getStyleDescription(config.style)}.`;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: {
        parts: [{ text: enhancedPrompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: config.aspectRatio as any,
          // imageSize is only for gemini-3-pro-image-preview, but the SDK handles it gracefully
          ...(config.isPro ? { imageSize: "1K" } : {})
        },
      },
    });

    // Find the image part in candidates
    const candidate = response.candidates?.[0];
    if (!candidate) throw new Error("No candidates returned from API");

    for (const part of candidate.content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    throw new Error("No image data found in response");
  } catch (error: any) {
    console.error("Gemini Error:", error);
    if (error.message?.includes("Requested entity was not found")) {
        throw new Error("KEY_RESET_REQUIRED");
    }
    throw error;
  }
};

const getStyleDescription = (style: LogoStyle): string => {
  switch (style) {
    case 'Minimalist': return 'extremely simple, iconic, negative space, black and white or two-tone';
    case 'Modern': return 'gradients, sleek curves, sans-serif vibes, tech-focused';
    case 'Vintage': return 'textured, badges, retro colors, serif typography, ornate details';
    case '3D': return 'realistic lighting, depth, shadows, glossy finish, isometric';
    case 'Mascot': return 'cartoon character, expressive, bold outlines, vibrant colors';
    case 'Hand-drawn': return 'sketchy lines, watercolor textures, irregular shapes, artistic';
    case 'Geometric': return 'perfect circles and triangles, symmetry, grid-based design';
    case 'Luxury': return 'gold or silver accents, elegant serif fonts, thin lines, high-end fashion vibe';
    default: return 'professional logo design';
  }
};
