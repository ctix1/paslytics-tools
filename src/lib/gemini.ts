import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: "أنت خبير تسويق رقمي. يجب أن تكون جميع مخرجاتك باللغة العربية (العربية البيضاء المفهومة لجميع العرب) مالم يُطلب منك غير ذلك. التزم بالدقة والاحترافية والأسلوب الجذاب."
});

export const analyzeMarketing = async (prompt: string, imageBase64?: string) => {
  try {
    let result;
    if (imageBase64) {
      // Remove data:image/...;base64, prefix if present
      const base64Data = imageBase64.split(',')[1] || imageBase64;
      
      const imagePart = {
        inlineData: {
          data: base64Data,
          mimeType: "image/jpeg"
        }
      };
      
      result = await model.generateContent([prompt, imagePart]);
    } else {
      result = await model.generateContent(prompt);
    }
    
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export default model;
