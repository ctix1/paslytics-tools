‫‬ import { GoogleGenerativeAI } from "@google/generative-ai";

export const analyzeMarketing = async (prompt: string, imageBase64?: string) => {
  try {
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash" 
    });

    // إضافة التعليمات لضمان اللغة العربية والاحترافية
    const systemPrompt = "أنت خبير تسويق محترف. حلل التالي باللغة العربية: ";
    const finalPrompt = systemPrompt + prompt;

    let result;
    if (imageBase64) {
      const base64Data = imageBase64.split(',')[1] || imageBase64;
      const imagePart = {
        inlineData: { data: base64Data, mimeType: "image/jpeg" }
      };
      result = await model.generateContent([finalPrompt, imagePart]);
    } else {
      result = await model.generateContent(finalPrompt);
    }

    const response = await result.response;
    const text = response.text();

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
