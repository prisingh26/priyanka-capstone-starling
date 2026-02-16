import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY not configured");

    const { subject, topic, grade, difficulty, streakCorrect, streakWrong } = await req.json();

    if (!topic || !grade) {
      return new Response(
        JSON.stringify({ error: "missing_params", message: "Topic and grade are required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Build adaptive difficulty instruction
    let difficultyInstruction = "";
    if (streakCorrect >= 3) {
      difficultyInstruction = "\n\nThe student got the last 3 problems correct in a row. Make this problem SLIGHTLY HARDER to keep them challenged.";
    } else if (streakWrong >= 2) {
      difficultyInstruction = "\n\nThe student struggled with the last 2 problems. Make this problem SLIGHTLY EASIER and more concrete with simpler numbers.";
    }

    const isYounger = grade <= 3;
    const problemType = isYounger ? "multiple_choice" : "free_response";
    const problemTypeInstruction = isYounger
      ? "Include 4 multiple choice options (A, B, C, D). Make wrong options plausible but clearly distinguishable."
      : "This should be a free-response problem where the student types their answer.";

    const prompt = `Generate ONE grade-appropriate practice problem for a grade ${grade} student on the topic of "${topic}" (subject: ${subject}).

The problem should be:
- Appropriate difficulty: ${difficulty || "medium"}
- Clear, unambiguous, and encouraging
- ${problemTypeInstruction}${difficultyInstruction}

Return ONLY valid JSON with no markdown fences:
{
  "problem_text": "The problem statement, written in a friendly way",
  "problem_type": "${problemType}",
  "options": ${isYounger ? '["A) ...", "B) ...", "C) ...", "D) ..."]' : "null"},
  "correct_answer": "The correct answer (for multiple choice, just the letter like 'B')",
  "hint": "A gentle, encouraging first hint if they get stuck",
  "explanation": "A step-by-step explanation of how to solve it, written for a ${grade}th grader",
  "difficulty": "${difficulty || "medium"}"
}`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a friendly, encouraging math and education tutor for elementary school students. Generate clear, age-appropriate practice problems. Always respond with valid JSON only, no markdown.",
          },
          { role: "user", content: prompt },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const status = response.status;
      const body = await response.text();
      console.error(`OpenAI error [${status}]:`, body);
      if (status === 429) return new Response(JSON.stringify({ error: "rate_limited", message: "Too many requests. Please wait a moment!" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      throw new Error(`API error [${status}]`);
    }

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content ?? "";

    // Parse JSON, stripping markdown fences if present
    let cleaned = raw.trim();
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    const problem = JSON.parse(cleaned);

    return new Response(JSON.stringify(problem), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-practice error:", e);
    return new Response(
      JSON.stringify({ error: "server_error", message: "Something didn't work right. Let's try again! 🌟" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
