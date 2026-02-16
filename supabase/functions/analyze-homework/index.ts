import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const OPENAI_API = "https://api.openai.com/v1/chat/completions";
const CLAUDE_API = "https://api.anthropic.com/v1/messages";

const OCR_MODEL = "gpt-4o";
const REASONING_MODEL = "claude-sonnet-4-20250514";

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

// Known image magic byte prefixes in base64
const IMAGE_SIGNATURES: Record<string, string> = {
  "/9j/": "image/jpeg",
  "iVBOR": "image/png",
  "R0lGO": "image/gif",
  "UklGR": "image/webp",
};

function detectImageFormat(base64Data: string): string | null {
  for (const [sig, mime] of Object.entries(IMAGE_SIGNATURES)) {
    if (base64Data.startsWith(sig)) return mime;
  }
  return null;
}

/**
 * Normalise the incoming base64 image payload.
 * - Strips duplicate data URI prefixes
 * - Validates the binary magic bytes
 * - Returns clean base64 + detected MIME type
 *
 * Throws a tagged error so the caller can return 400 (not 500).
 */
function getImageParts(imageBase64: string): { base64Data: string; mediaType: string } {
  // Strip the data URI prefix if present (handles double-prefix too)
  let raw = imageBase64;
  // Remove any "data:...;base64," prefix(es)
  while (/^data:[^;]+;base64,/.test(raw)) {
    raw = raw.replace(/^data:[^;]+;base64,/, "");
  }

  const detectedMime = detectImageFormat(raw);
  if (!detectedMime) {
    throw new Error("not_a_valid_image");
  }

  return { base64Data: raw, mediaType: detectedMime };
}

async function callOpenAI(
  apiKey: string,
  model: string,
  prompt: string,
  imageBase64: string,
  maxTokens: number,
  temperature: number,
) {
  const { base64Data, mediaType } = getImageParts(imageBase64);

  const response = await fetch(OPENAI_API, {
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
              image_url: { url: `data:${mediaType};base64,${base64Data}` },
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
    console.error(`OpenAI API error [${status}]:`, body);
    if (status === 429) return { error: "rate_limited", message: "Too many requests — please wait a moment and try again." };
    if (status === 402 || status === 401) return { error: "payment_required", message: "Starling is taking a quick nap. Please try again later! 😴" };
    if (body.includes("unsupported image") || body.includes("invalid_image_format") || body.includes("Could not process image")) {
      throw new Error("not_a_valid_image");
    }
    throw new Error(`API error [${status}]`);
  }

  const data = await response.json();
  return { text: data.choices?.[0]?.message?.content ?? "" };
}

async function callClaude(
  apiKey: string,
  prompt: string,
  imageBase64: string,
  maxTokens: number,
  temperature: number,
) {
  const { base64Data, mediaType } = getImageParts(imageBase64);

  const response = await fetch(CLAUDE_API, {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: REASONING_MODEL,
      max_tokens: maxTokens,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType,
                data: base64Data,
              },
            },
            { type: "text", text: prompt },
          ],
        },
      ],
      temperature,
    }),
  });

  if (!response.ok) {
    const status = response.status;
    const body = await response.text();
    console.error(`Claude API error [${status}]:`, body);
    if (status === 429) return { error: "rate_limited", message: "Too many requests — please wait a moment and try again." };
    if (status === 402 || status === 400) {
      if (body.includes("credit") || body.includes("billing")) {
        return { error: "payment_required", message: "Starling is taking a quick nap. Please try again later! 😴" };
      }
    }
    throw new Error(`API error [${status}]`);
  }

  const data = await response.json();
  const text = data.content?.[0]?.text ?? "";
  return { text };
}

function parseJSON(raw: string) {
  let cleaned = raw.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  }

  try {
    return JSON.parse(cleaned);
  } catch {
    // Response may be truncated — try to recover
  }

  const lastCompleteComma = cleaned.lastIndexOf("},");
  if (lastCompleteComma > 0) {
    const truncated = cleaned.substring(0, lastCompleteComma + 1);
    const repaired = truncated + '], "errorPatterns": {}, "encouragement": "Great effort!" }';
    try {
      return JSON.parse(repaired);
    } catch { /* try next strategy */ }
  }

  const problemsMatch = cleaned.match(/"problems"\s*:\s*\[/);
  if (problemsMatch) {
    const startIdx = (problemsMatch.index ?? 0) + problemsMatch[0].length;
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
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not configured");

    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    if (!ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY is not configured");

    const { imageBase64 } = await req.json();
    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: "missing_image", message: "No image provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // ── Validate image format early — return 400 not 500 ──────────
    try {
      getImageParts(imageBase64);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "";
      if (msg === "not_a_valid_image") {
        return new Response(
          JSON.stringify({
            error: "image_format_error",
            message: "Hmm, Starling couldn't read that file. Try taking a clearer photo or uploading a different format! 📸",
          }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      throw e;
    }

    console.log("Step 1: Classifying with OpenAI (GPT-4o)...");

    const classifyResult = await callOpenAI(
      OPENAI_API_KEY,
      OCR_MODEL,
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

    let complexity = "complex";
    let classifyReason = "defaulting to complex";
    try {
      const parsed = parseJSON(classifyResult.text);
      complexity = parsed.complexity ?? "complex";
      classifyReason = parsed.reason ?? "";
    } catch {
      console.warn("Could not parse classifier output, defaulting to complex:", classifyResult.text);
    }

    console.log(`Complexity: ${complexity} (${classifyReason})`);

    const isSimple = complexity === "simple";
    const prompt = isSimple ? SIMPLE_ANALYSIS_PROMPT : COMPLEX_ANALYSIS_PROMPT;
    const maxTokens = isSimple ? 4000 : 8000;
    const temperature = isSimple ? 0.3 : 0.5;

    let analysisResult;
    let modelUsed: string;

    if (isSimple) {
      console.log("Step 2: Analyzing with OpenAI (GPT-4o)...");
      modelUsed = OCR_MODEL;
      analysisResult = await callOpenAI(OPENAI_API_KEY, OCR_MODEL, prompt, imageBase64, maxTokens, temperature);
    } else {
      console.log(`Step 2: Analyzing with Claude (${REASONING_MODEL})...`);
      modelUsed = REASONING_MODEL;
      analysisResult = await callClaude(ANTHROPIC_API_KEY, prompt, imageBase64, maxTokens, temperature);
    }

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
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    analysis.complexity = complexity;
    analysis.classifyReason = classifyReason;
    analysis.modelUsed = modelUsed;

    const problems = analysis.problems ?? [];
    analysis.totalProblems = problems.length;
    analysis.correctAnswers = problems.filter((p: any) => p.isCorrect).length;

    console.log(`Analysis complete: ${analysis.correctAnswers}/${analysis.totalProblems} correct (${modelUsed})`);

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-homework error:", e);

    const rawMsg = e instanceof Error ? e.message : String(e);
    let userMessage = "Something didn't work right. Let's give it another try! 🌟";
    let errorCode = "server_error";
    let statusCode = 500;

    if (rawMsg.includes("not_a_valid_image") || rawMsg.includes("unsupported image") || rawMsg.includes("invalid_image_format")) {
      userMessage = "Hmm, Starling couldn't read that file. Try taking a clearer photo or uploading a different format! 📸";
      errorCode = "image_format_error";
      statusCode = 400;
    } else if (rawMsg.includes("timeout") || rawMsg.includes("ETIMEDOUT") || rawMsg.includes("network")) {
      userMessage = "Oops! Starling lost connection for a moment. Let's try again! 🔄";
      errorCode = "network_error";
    } else if (rawMsg.includes("API key") || rawMsg.includes("not configured") || rawMsg.includes("401")) {
      userMessage = "Starling is taking a quick nap. Please try again later! 😴";
      errorCode = "auth_error";
    }

    return new Response(
      JSON.stringify({ error: errorCode, message: userMessage }),
      { status: statusCode, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});