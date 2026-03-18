import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "npm:@google/generative-ai";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { imageBase64, targetLanguage } = await req.json();
    const geminiKey = Deno.env.get("GEMINI_API_KEY");
    
    if (!geminiKey) {
      throw new Error("Missing GEMINI_API_KEY environment variable.");
    }

    const genAI = new GoogleGenerativeAI(geminiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const isArabic = targetLanguage === 'ar' || true; // Default to Arabic as per user request

    const prompt = `
      نظام: أنت محلل تسويق ومحتوى رقمي محترف ومبدع.
      قم بتحليل المنتج في الصورة المرفقة (أو الوصف المقدم) بعمق.
      
      يجب أن تكون جميع القيم (values) في ملف JSON باللغة "العربية البيضاء" 
      (لغة وسطى مفهومة لجميع العرب، ليست فصحى معقدة ولا لهجة محلية منغلقة).
      استخدم هيكل PAS المعتمد (Problem-Agitation-Solution).
      
      تنسيق المخرجات المطلوب (JSON الحصري):
      {
        "problem": "هنا وصف دقيق للمشكلة التي يعالجها المنتج (بالعربية)",
        "agitation": "هنا شرح للتبعات والمشاعر السلبية الناتجة عن المشكلة (بالعربية)",
        "solution": "كيف يقدم المنتج الحل الأمثل (بالعربية)",
        "ai_quick_take": "فكرة تسويقية سريعة ومبدعة (بالعربية)",
        "emotional_score": (رقم بين 80 و 99 يعبر عن قوة الجذب العاطفي),
        "product_name": "اسم المنتج المستخلص"
      }
      
      هام جداً: لا تستخدم أي لغة أخرى غير العربية في القيم. لا تستخدم Markdown أو أي نصوص خارج الـ JSON.
    `;

    let result;
    if (imageBase64) {
      // Remove data:image/...;base64, prefix if present
      const base64Data = imageBase64.split(',')[1] || imageBase64;
      result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: base64Data,
            mimeType: "image/jpeg",
          },
        },
      ]);
    } else {
      result = await model.generateContent(prompt);
    }

    const response = await result.response;
    const text = response.text();
    
    // Attempt to parse the response as JSON
    let parsedOutput;
    try {
      const cleanedJson = text.replace(/```json/i, '').replace(/```/i, '').trim();
      parsedOutput = JSON.parse(cleanedJson);
    } catch (e) {
      console.error("Failed to parse Gemini response as JSON:", text);
      parsedOutput = {
        problem: "Analysis completed. (Raw format fallback)",
        agitation: text,
        solution: "Could not parse structured output properly.",
        ai_quick_take: "Parsing error: " + e.message,
        emotional_score: 70,
        product_name: "Unknown"
      };
    }

    return new Response(JSON.stringify(parsedOutput), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Gemini Edge Function Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
