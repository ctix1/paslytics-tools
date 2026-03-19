import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Analyzes marketing content using Gemini AI.
 * Supports both text prompts and optional base64 images.
 */
export const analyzeMarketing = async (prompt: string, base64Image?: string) => {
  try {
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let result;

    if (base64Image) {
      // Handle image analysis
      const imageData = base64Image.split(',')[1] || base64Image;
      const mimeType = base64Image.match(/data:(.*?);/)?.[1] || 'image/png';

      result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: imageData,
            mimeType: mimeType
          }
        }
      ]);
    } else {
      // Handle text-only analysis
      result = await model.generateContent(prompt);
    }

    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error("Empty response from Gemini API");
    }

    return text;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export default analyzeMarketing;
