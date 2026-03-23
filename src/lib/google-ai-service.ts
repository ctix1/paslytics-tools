 // @ts-ignore
import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. إعداد محرك Gemini الذكي لإنشاء النصوص والصور
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const analyzeMarketing = async (prompt: string, imageBase64?: string) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "models/gemini-3-flash-preview",
      systemInstruction: "أنت خبير تسويق محترف، أجب باللغة العربية البيضاء الواضحة."
    });

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

    const result = await model.generateContent({ contents: [{ role: "user", parts }] });
    const responseText = await result.response.text();
    return responseText;
  } catch (error) {
    console.error("AI Service Error (Gemini):", error);
    throw error;
  }
};

// 2. دالة إنتاج الصوت باستخدام WaveNet (أداء عالي وتكلفة مجانية لأول مليون حرف)
export const generateAudio = async (text: string) => {
  try {
    const apiKey = import.meta.env.VITE_GOOGLE_TTS_API_KEY;

    // التحقق من وجود المفتاح في Vercel قبل بدء الطلب
    if (!apiKey) {
      console.error("Missing API Key: VITE_GOOGLE_TTS_API_KEY is not defined.");
      return null;
    }

    // تجهيز البيانات بشكل متوافق تماماً مع Google Cloud API
    // تجهيز البيانات بشكل متوافق تماماً مع Google Cloud API
    const requestBody = {
      input: { text: text },
      voice: {
        languageCode: "ar-XA",
        name: "ar-XA-Wavenet-A"
      },
      audioConfig: {
        audioEncoding: "MP3"
      }
    };

// تأكد أن الرابط بهذا الشكل تماماً وبدون أي حروف زائدة
const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;

const response = await fetch(url, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(requestBody)
});

    const data = await response.json();

    if (response.ok && data.audioContent) {
      return data.audioContent; // يعيد الصوت بتنسيق Base64 القابل للتشغيل
    } else {
      // طباعة تفاصيل الخطأ في الـ Console للمساعدة في التشخيص
      console.error("Google Cloud TTS Error Details:", data);
      return null;
    }
  } catch (error) {
    console.error("Network/Audio Fetch Error:", error);
    return null;
  }
};
