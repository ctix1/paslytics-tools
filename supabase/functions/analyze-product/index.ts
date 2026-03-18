import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { image } = await req.json()
    const apiKey = Deno.env.get('GEMINI_API_KEY')
    
    if (!apiKey) {
      throw new Error('Missing GEMINI_API_KEY')
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = `
      نظام: أنت محلل تسويق محترف. حلل المنتج في الصورة.
      يجب أن تكون المخرجات باللغة "العربية البيضاء" (White Arabic) حصراً، وهي اللغة المفهومة والبسيطة والمستخدمة في الإعلانات ووسائل التواصل الاجتماعي، وليست العربية الفصحى الجامدة أو المعقدة.
      ممنوع استخدام الإنجليزية.
      التزم بهيكل PAS (Problem-Agitation-Solution).
      
      المخرجات المطلوبة كملف JSON فقط:
      {
        "problem": "المشكلة بالعربية البيضاء",
        "agitation": "التبعات بالعربية البيضاء",
        "solution": "الحل بالعربية البيضاء",
        "ai_quick_take": "نظرة سريعة بالعربية البيضاء",
        "emotional_score": 90
      }
    `

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: image,
          mimeType: "image/jpeg"
        }
      }
    ])

    const response = await result.response
    const text = response.text()
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    const data = JSON.parse(jsonMatch ? jsonMatch[0] : text)

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
