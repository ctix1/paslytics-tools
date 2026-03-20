import { GoogleGenerativeAI } from "@google/generative-ai";

// إعداد الذكاء الاصطناعي خارج الدالة ليكون أسرع وأكثر استقراراً
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// اختيار الموديل الصحيح - اترك المكتبة تختار المسار v1 تلقائياً
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const analyzeMarketing = async (prompt: string, imageBase64?: string) => {
  console.log("--- VERSION 2.0 ACTIVATED ---");

  try {
    const systemPrompt = "أنت خبير تسويق محترف. حلل التالي باللغة العربية: ";
    const finalPrompt = systemPrompt + prompt;

    let result;

    if (imageBase64) {
      // معالجة الصورة إذا وجدت
      const base64Data = imageBase64.split(',')[1] || imageBase64;
      const imagePart = {
        inlineData: {
          data: base64Data,
          mimeType: "image/jpeg"
        }
      };
      
      result = await model.generateContent([finalPrompt, imagePart]);
    } else {
      // طلب نصي فقط
      result = await model.generateContent(finalPrompt);
    }

    const response = await result.response;
    const text = response.text();
    
    return text.trim();

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export default analyzeMarketing;
