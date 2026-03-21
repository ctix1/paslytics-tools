// @ts-ignore
import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. إعداد محرك Gemini الذكي
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

// 2. دالة إنتاج الصوت باستخدام WaveNet (الأداء العالي والتكلفة الصفرية لأول مليون حرف)
export const generateAudio = async (text: string) => {
  try {
    const apiKey = import.meta.env.VITE_GOOGLE_TTS_API_KEY;

    // التحقق من وجود المفتاح لتجنب أخطاء 400 العشوائية
    if (!apiKey) {
      console.error("Error: VITE_GOOGLE_TTS_API_KEY is missing!");
      return null;
    }

    const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: { text: text },
        voice: {
          languageCode: "ar-XA",
          name: "ar-XA-Wavenet-A" // خيار احترافي ومجاني ضمن الحدود
        },
        audioConfig: {
          audioEncoding: "MP3"
        }
      })
    });

    const data = await response.json();

    if (data.audioContent) {
      return data.audioContent; // يعيد الصوت بتنسيق Base64
    } else {
      console.error("GCP TTS Error Response:", data);
      throw new Error("Failed to generate audio content from Google Cloud");
    }
  } catch (error) {
    console.error("Audio Service Error (TTS):", error);
    return null;
  }
};
