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
      نظام: أنت محلل تسويق ومحتوى رقمي محترف. 
      قم بتحليل المنتج في الصورة المرفقة (أو الوصف إذا لم تتوفر صورة).
      يجب أن تكون المخرجات باللغة العربية الفصحى المعاصرة.
      استخدم هيكل PAS: المشكلة (Problem) - التأثير (Impact/Agitation) - الحل (Solution).
      
      MANDATORY OUTPUT FORMAT: JSON object.
      MANDATORY STRUCTURE: {
        "problem": "...", 
        "agitation": "...", 
        "solution": "...", 
        "ai_quick_take": "...",
        "emotional_score": 88,
        "product_name": "..."
      }
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
    
    // Clean JSON response
    const cleanedJson = text.replace(/```json/i, '').replace(/```/i, '').trim();
    const parsedOutput = JSON.parse(cleanedJson);

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
