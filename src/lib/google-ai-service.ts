// @ts-ignore
import { GoogleGenerativeAI } from "@google/generative-ai";

export const analyzeMarketing = async (prompt: string, imageBase64?: string) => {
  try {
    // 1. إعداد المكتبة باستخدام مفتاح API الخاص بك من متغيرات البيئة
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

    // 2. تحديد الموديل والتعليمات (هنا تم تبسيط الكود ليتوافق مع الإصدار 0.21.0)
    const model = genAI.getGenerativeModel({
      model: "models/gemini-3-flash-preview",
      systemInstruction: "أنت خبير تسويق محترف، أجب باللغة العربية البيضاء الواضحة"
    });

    // إعداد أجزاء الطلب (النص والصورة إن وجدت)
    let parts: any[] = [{ text: prompt }];

    if (imageBase64) {
      const base64Data = imageBase64.split(',')[1] || imageBase64;
      parts.push({
        inlineData: {
          data: base64Data,
          mimeType: "image/jpeg"
        }
      });
    }

    // 3. إرسال الطلب والحصول على النتيجة
    const result = await model.generateContent({ contents: [{ role: "user", parts }] });
    const response = await result.response;
    return response.text();

  } catch (error) {
    console.error("AI Service Error:", error);
    throw error;
  }
};
