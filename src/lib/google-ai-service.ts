// @ts-ignore

‫ import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. إعداد ذكاء Gemini (للنصوص والصور)
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const analyzeMarketing = async (prompt: string, imageBase64?: string) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview", // تأكد من دعم هذا الإصدار في منطقتك أو استخدم gemini-1.5-flash
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
    console.error("AI Service Error:", error);
    throw error;
  }
};

// 2. إضافة وظيفة الصوت (WaveNet) بأقل تكلفة (مجانية لأول مليون حرف)
export const generateAudio = async (text: string) => {
  try {
    const apiKey = import.meta.env.VITE_GOOGLE_TTS_API_KEY;
    const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: { text },
        voice: { languageCode: "ar-XA", name: "ar-XA-Wavenet-A" }, // صوت وافنبت احترافي وموفر
        audioConfig: { audioEncoding: "MP3" }
      })
    });
