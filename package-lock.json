import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { imageBase64 } = await req.json();

    const openAiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openAiKey) {
      throw new Error("Missing OPENAI_API_KEY environment variable.");
    }

    let messages = [
      {
        role: "system",
        content: `You are an expert marketing analyst. You create powerful PAS (Problem, Agitation, Solution) frameworks. 
        Return the result strictly as a valid JSON object matching this schema:
        {
          "problem": "Describe the core problem here in 2 sentences.",
          "agitation": "Agitate the problem emotionally here.",
          "solution": "Provide the solution derived from the product.",
          "ai_quick_take": "A very short, punchy 1-sentence marketing summary",
          "emotional_score": 85
        }
        Respond with ONLY the JSON object, NO MARKDOWN formatting, NO backticks.`
      }
    ];

    if (imageBase64) {
      messages.push({
        role: "user",
        // @ts-ignore - Supabase Deno deployment supports Vision schema
        content: [
          { type: "text", text: "Analyze this product image and generate the PAS framework." },
          { type: "image_url", image_url: { url: imageBase64 } }
        ]
      });
    } else {
      messages.push({
        role: "user",
        content: "Provide a generic PAS framework for a demo product since no image was provided."
      });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openAiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // Use vision-capable small model
        messages: messages,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    if (data.error) {
      console.error("OpenAI API Error:", data.error);
      throw new Error(`OpenAI Error: ${data.error.message || 'Unknown error'}`);
    }

    if (!data.choices || data.choices.length === 0) {
      console.error("OpenAI returned no choices:", data);
      throw new Error("OpenAI returned no results. Check your quota and model access.");
    }

    const content = data.choices[0].message.content.trim();
    console.log("OpenAI Response Content:", content);
    
    // Attempt to parse the response as JSON
    let parsedOutput;
    try {
      // Remove any potential markdown wrappers the model might add by mistake
      const cleanedContent = content.replace(/^```json/i, '').replace(/```$/i, '').trim();
      parsedOutput = JSON.parse(cleanedContent);
    } catch (e) {
      console.error("Failed to parse OpenAI response as JSON:", content);
      parsedOutput = {
        problem: "Analysis completed. (Raw format fallback)",
        agitation: content,
        solution: "Could not parse structured output properly.",
        ai_quick_take: "Parsing error: " + e.message,
        emotional_score: 70
      };
    }

    return new Response(JSON.stringify(parsedOutput), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Edge Function Error:", error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: "Check Supabase Edge Function logs for details."
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
