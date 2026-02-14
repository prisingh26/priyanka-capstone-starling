import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const AI_GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

// ── Model config ────────────────────────────────────────────────────
const FAST_MODEL = "openai/gpt-5-mini"; // Quick OCR + simple math
const DEEP_MODEL = "openai/gpt-5"; // Complex reasoning + pedagogy

// ── Prompts ─────────────────────────────────────────────────────────

const CLASSIFY_PROMPT = `You are a math problem classifier for elementary school homework.
Look at this homework image and determine the complexity.

SIMPLE means: single-step arithmetic (addition, subtraction, multiplication, division of whole numbers).
COMPLEX means: fractions, word problems, multi-step problems, algebra, mixed operations, remainders, decimals, or dense/hard-to-read handwriting.

If you're uncertain, say COMPLEX.

Respond with ONLY a JSON object (no markdown):
{"complexity": "simple" | "complex", "reason": "brief reason"}`;

const SIMPLE_ANALYSIS_PROMPT = `You are an expert math tutor for elementary school students (grades 1-5).
Analyze this homework image carefully.

For EACH problem visible in the image:
1. Read the problem text exactly as written
2. Read the student's handwritten answer
3. Determine the correct answer
4. Check if the student's answer is correct
5. If incorrect, identify the error type (e.g., "Regrouping", "Carrying", "Basic fact", "Place value")

ALSO: Generate 3 practice problems focused on the ERROR TYPES found. If all correct, generate 3 problems of the same type at slightly harder difficulty.
Each practice problem must have: problem text, numeric answer, and a short hint.

CRITICAL: Output ONLY raw JSON. Do NOT wrap in markdown code fences. No \`\`\`json.
{
  "subject": "Math",
  "grade": <estimated grade level 1-5>,
  "problems": [
    {
      "id": <number starting at 1>,
      "question": "<the problem as written>",
      "studentAnswer": "<what the student wrote>",
      "correctAnswer": "<the actual correct answer>",
      "isCorrect": <true/false>,
      "errorType": "<error category if incorrect, null if correct>"
    }
  ],
  "errorPatterns": { "<error type>": <count> },
  "encouragement": "<brief encouraging message about their work>",
  "practiceProblems": [
    { "id": 1, "problem": "<e.g. 63 - 28 = ?>", "answer": 35, "hint": "<short hint targeting the error>" },
    { "id": 2, "problem": "...", "answer": 0, "hint": "..." },
    { "id": 3, "problem": "...", "answer": 0, "hint": "..." }
  ]
}`;

const COMPLEX_ANALYSIS_PROMPT = `You are an expert, caring math tutor for elementary school students (grades 1-5).
Analyze this homework image with deep pedagogical insight.

For EACH problem visible in the image:
1. Read the problem text exactly as written
2. Read the student's handwritten answer
3. Determine the correct answer
4. Check if the student's answer is correct
5. If incorrect:
   - Identify the specific error type
   - Diagnose the ROOT CAUSE briefly
   - Create a BRIEF step-by-step explanation (max 3 short steps, under 15 words each)
   - Suggest a visual aid (one sentence)

ALSO: Generate 3 practice problems FOCUSED ON THE SPECIFIC ERROR TYPES found. Target the student's weakest areas. If all correct, generate 3 slightly harder problems of the same type.
Each practice problem must have: problem text, numeric answer, and a short hint addressing the error pattern.

CRITICAL RULES:
- Output ONLY raw JSON. Do NOT wrap in markdown code fences. No \`\`\`json.
- Keep all text fields SHORT and concise.
- If a problem is correct, set stepByStep to [] and optional fields to null.

{
  "subject": "Math",
  "grade": <estimated grade level 1-5>,
  "problems": [
    {
      "id": <number starting at 1>,
      "question": "<the problem as written>",
      "studentAnswer": "<what the student wrote>",
      "correctAnswer": "<the actual correct answer>",
      "isCorrect": <true/false>,
      "errorType": "<error category if incorrect, null if correct>",
      "rootCause": "<brief root cause, null if correct>",
      "stepByStep": ["<short step>", "<short step>"],
      "visualAid": "<one sentence, null if correct>"
    }
  ],
  "errorPatterns": { "<error type>": <count> },
  "encouragement": "<warm encouraging message>",
  "focusAreas": [
    {
      "title": "<skill to practice>",
      "description": "<brief description>"
    }
  ],
  "practiceProblems": [
    { "id": 1, "problem": "<targets the most common error>", "answer": 0, "hint": "<hint addressing the error>" },
    { "id": 2, "problem": "...", "answer": 0, "hint": "..." },
    { "id": 3, "problem": "...", "answer": 0, "hint": "..." }
  ]
}`;

// ── Helpers ──────────────────────────────────────────────────────────

async function callAI(
  apiKey: string,
  model: string,
  prompt: string,
  imageBase64: string,
  maxTokens: number,
  temperature: number,
) {
  // Strip data URL prefix if present
  const base64Data = imageBase64.includes(",")
    ? imageBase64.split(",")[1]
    : imageBase64;

  const mediaType = imageBase64.startsWith("data:image/png")
    ? "image/png"
    : "image/jpeg";

  const response = await fetch(AI_GATEWAY, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: `data:${mediaType};base64,${base64Data}`,
              },
            },
          ],
        },
      ],
      max_tokens: maxTokens,
      temperature,
    }),
  });

  if (!response.ok) {
    const status = response.status;
    const body = await response.text();
    console.error(`AI gateway error [${status}]:`, body);

    if (status === 429) {
      return {
        error: "rate_limited",
        message: "Too many requests — please try again in a moment.",
      };
    }
    if (status === 402) {
      return {
        error: "payment_required",
        message: "AI credits exhausted. Please add credits in Settings → Workspace → Usage.",
      };
    }
    throw new Error(`AI gateway error [${status}]: ${body}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content ?? "";
  return { text };
}

function parseJSON(raw: string) {
  // Strip markdown code fences if the model wraps output
  let cleaned = raw.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  }

  // Try parsing as-is first
  try {
    return JSON.parse(cleaned);
  } catch {
    // Response may be truncated — try to recover
  }

  // Attempt to repair truncated JSON by closing open structures
  // Find the last complete problem object by looking for the last "},"
  const lastCompleteComma = cleaned.lastIndexOf("},");
  if (lastCompleteComma > 0) {
    // Close the problems array and the outer object
    const truncated = cleaned.substring(0, lastCompleteComma + 1);
    // Try closing with ], errorPatterns, etc.
    const repaired = truncated + '], "errorPatterns": {}, "encouragement": "Great effort!" }';
    try {
      return JSON.parse(repaired);
    } catch {
      // Try another repair strategy
    }
  }

  // Last resort: try to extract just the problems array
  const problemsMatch = cleaned.match(/"problems"\s*:\s*\[/);
  if (problemsMatch) {
    const startIdx = (problemsMatch.index ?? 0) + problemsMatch[0].length;
    // Find all complete problem objects
    const problemObjects: any[] = [];
    let depth = 0;
    let objStart = -1;
    for (let i = startIdx; i < cleaned.length; i++) {
      if (cleaned[i] === "{") {
        if (depth === 0) objStart = i;
        depth++;
      } else if (cleaned[i] === "}") {
        depth--;
        if (depth === 0 && objStart >= 0) {
          try {
            const obj = JSON.parse(cleaned.substring(objStart, i + 1));
            problemObjects.push(obj);
          } catch { /* skip malformed */ }
          objStart = -1;
        }
      }
    }
    if (problemObjects.length > 0) {
      return {
        subject: "Math",
        grade: 3,
        problems: problemObjects,
        errorPatterns: {},
        encouragement: "Great effort!",
      };
    }
  }

  throw new Error("Could not parse or recover AI response");
}

// ── Main handler ─────────────────────────────────────────────────────

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const { imageBase64 } = await req.json();
    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: "missing_image", message: "No image provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    console.log("Step 1: Classifying problem complexity...");

    // ── Step 1: Classify complexity (fast model) ───────────────────
    const classifyResult = await callAI(
      LOVABLE_API_KEY,
      FAST_MODEL,
      CLASSIFY_PROMPT,
      imageBase64,
      200,
      0.2,
    );

    if ("error" in classifyResult) {
      return new Response(JSON.stringify(classifyResult), {
        status: classifyResult.error === "rate_limited" ? 429 : 402,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let complexity = "complex"; // default to complex (safe)
    let classifyReason = "defaulting to complex";
    try {
      const parsed = parseJSON(classifyResult.text);
      complexity = parsed.complexity ?? "complex";
      classifyReason = parsed.reason ?? "";
    } catch {
      console.warn("Could not parse classifier output, defaulting to complex:", classifyResult.text);
    }

    console.log(`Complexity: ${complexity} (${classifyReason})`);

    // ── Step 2: Analyze with appropriate model ─────────────────────
    const isSimple = complexity === "simple";
    const model = isSimple ? FAST_MODEL : DEEP_MODEL;
    const prompt = isSimple ? SIMPLE_ANALYSIS_PROMPT : COMPLEX_ANALYSIS_PROMPT;
    const maxTokens = isSimple ? 4000 : 8000;
    const temperature = isSimple ? 0.3 : 0.5;

    console.log(`Step 2: Analyzing with ${model}...`);

    const analysisResult = await callAI(
      LOVABLE_API_KEY,
      model,
      prompt,
      imageBase64,
      maxTokens,
      temperature,
    );

    if ("error" in analysisResult) {
      return new Response(JSON.stringify(analysisResult), {
        status: analysisResult.error === "rate_limited" ? 429 : 402,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let analysis;
    try {
      analysis = parseJSON(analysisResult.text);
    } catch (e) {
      console.error("Failed to parse analysis:", analysisResult.text);
      return new Response(
        JSON.stringify({
          error: "parse_error",
          message: "Could not parse AI analysis. Please try again with a clearer photo.",
          raw: analysisResult.text,
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Attach metadata
    analysis.complexity = complexity;
    analysis.classifyReason = classifyReason;
    analysis.modelUsed = model;

    // Compute summary stats
    const problems = analysis.problems ?? [];
    analysis.totalProblems = problems.length;
    analysis.correctAnswers = problems.filter((p: any) => p.isCorrect).length;

    console.log(
      `Analysis complete: ${analysis.correctAnswers}/${analysis.totalProblems} correct (${model})`,
    );

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-homework error:", e);
    return new Response(
      JSON.stringify({
        error: "server_error",
        message: e instanceof Error ? e.message : "Unknown error",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
