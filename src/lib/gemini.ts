‫ ";import { GoogleGenerativeAI } from "@google/generative-ai

// فحص وجود المفتاح في الكونسول
console.log("check API key:", import.meta.env.VITE_GEMINI_API_KEY ? "loaded" : "missing");

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// نستخدم الاسم المستقر تماماً بدون إضافات
export const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash" 
});

// تأكد من تصدير الوظائف الأخرى إذا كانت موجودة أسفل الملف مثل analyzeMarketing

