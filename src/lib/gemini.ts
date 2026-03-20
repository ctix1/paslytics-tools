import { GoogleGenerativeAI } from "@google/generative-ai";

export const analyzeMarketing = async (prompt: string, imageBase64?: string) => {
  try {
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

    // نستخدم الموديل بدون حقل systemInstruction لتجنب خطأ 400
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // ندمج التعليمات مباشرة قبل سؤال المستخدم
    const systemPrompt = "تعليمات النظام: أنت خبير تسويق محترف. حلل المحتوى التالي بدقة وقدم نصائح تسويقية ذكية. يجب أن تكون جميع مخرجاتك باللغة العربية البيضاء.\n\nالسؤال/المحتوى: ";
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
