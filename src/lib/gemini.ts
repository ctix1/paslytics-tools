import { GoogleGenerativeAI } from "@google/generative-ai";
console.log("check API key:", import.meta.env.VITE_GEMINI_API_KEY ? "loaded" : "missing")
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash-latest",
  systemInstruction: "أنت خبير تسويق رقمي محترف. يجب أن تكون جميع مخرجاتك باللغة 'العربية البيضاء' (White Arabic) حصراً، وهي لغة عصرية، بسيطة، ومفهومة للجميع، وتستخدم في السيناريوهات الإعلانية والمحتوى الرقمي، وليست اللغة الفصحى الجامدة أو الأكاديمية. يمنع استخدام الإنجليزية تماماً في المخرجات."
});

export const analyzeMarketing = async (prompt: string, imageBase64?: string) => {
  try {
    let result;
    if (imageBase64) {
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
    const text = response.text();
    
    // Robust JSON cleaning
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

export default model;
