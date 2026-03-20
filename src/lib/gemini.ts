
import { GoogleGenerativeAI } from "@google/generative-ai";

export const analyzeMarketing = async (prompt: string, imageBase64?: string) => {
  try {
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

    const model = genAI.getGenerativeModel(
      {
        model: "gemini-1.5-flash",
        systemInstruction: {
          parts: [{ text: "أنت خبير تسويق محترف. يجب أن تكون جميع مخرجاتك باللغة العربية البيضاء." }],
        },
      },
      { apiVersion: "v1" }
    );

    let imagePart = null;
    if (imageBase64) {
      const base64Data = imageBase64.split(',')[1] || imageBase64;
      imagePart = {
        inlineData: {
          data: base64Data,
          mimeType: "image/jpeg"
        }
      };
    }

    let result;
    if (imagePart) {
      result = await model.generateContent([prompt, imagePart]);
    } else {
      result = await model.generateContent(prompt);
    }

    const response = await result.response;
    const text = response.text();

    // Clean JSON if the prompt asks for it
    if (prompt.toLowerCase().includes('json')) {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      return jsonMatch ? jsonMatch[0] : text;
    }

    return text.trim();

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export default analyzeMarketing;
