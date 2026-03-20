
import { GoogleGenerativeAI } from "@google/generative-ai";

export const analyzeMarketing = async (prompt: string, imageBase64?: string) => {
  try {
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    
    // اترك المكتبة تختار المسار الصحيح تلقائياً كما يفعل صاحبك
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemPrompt = "أنت خبير تسويق محترف. حلل التالي باللغة العربية: ";
    const finalPrompt = systemPrompt + prompt;

    let result;
    if (imageBase64) {
      const base64Data = imageBase64.split(',')[1] || imageBase64;
      result = await model.generateContent([
        finalPrompt,
        { inlineData: { data: base64Data, mimeType: "image/jpeg" } }
      ]);
    } else {
      result = await model.generateContent(finalPrompt);
    }

    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export default analyzeMarketing;
