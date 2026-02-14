import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const OPENAI_API = "https://api.openai.com/v1/chat/completions";
const CLAUDE_API = "https://api.anthropic.com/v1/messages";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");

    if (!OPENAI_API_KEY && !ANTHROPIC_API_KEY) {
      throw new Error("No AI API key configured (need OPENAI_API_KEY or ANTHROPIC_API_KEY)");
    }

    const { messages, childName, childGrade, problem } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "missing_messages", message: "No messages provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const systemPrompt = `You are Starling, a warm and patient learning buddy for a ${childGrade || "4th"} grader named ${childName || "there"}. Your job is to help them understand why their answer to a problem was wrong — but you NEVER give the answer directly. Instead:

- Ask ONE short guiding question at a time
- Use simple language appropriate for their grade level
- Use emojis sparingly to keep it fun (1-2 per message max)
- If they're stuck after 2 hints, make hints slightly more direct but still don't give the answer
- If they get it right, celebrate enthusiastically with phrases like "You got it! 🎉 That's awesome!" or "YES! You nailed it! ⭐". IMPORTANT: When they get the correct answer, you MUST include the exact phrase "[SOLVED]" at the very end of your message (after the celebration).
- If after 4-5 exchanges they still can't get it, walk them through the solution step by step and say "Now you know for next time! Your brain just got stronger 💪". Also include "[SOLVED]" at the end.
- Keep messages SHORT — 1-3 sentences max per message
- Never use negative words like "wrong" or "incorrect" — say "not quite" or "close!" or "almost!"
- Frame everything as a team effort: "Let's figure this out together"
- When the student says things like "I'm stuck" or "help me", give a gentler hint rather than repeating the question`;

    // Try Claude first (better reasoning), fall back to OpenAI
    if (ANTHROPIC_API_KEY) {
      const claudeMessages = messages.map((m: any) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      }));

      const response = await fetch(CLAUDE_API, {
        method: "POST",
        headers: {
          "x-api-key": ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 500,
          system: systemPrompt,
          messages: claudeMessages,
          temperature: 0.7,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.content?.[0]?.text ?? "";
        const solved = text.includes("[SOLVED]");
        const cleanText = text.replace("[SOLVED]", "").trim();

        return new Response(
          JSON.stringify({ reply: cleanText, solved }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      const status = response.status;
      const body = await response.text();
      console.error(`Claude error [${status}]:`, body);

      if (status === 429) {
        return new Response(
          JSON.stringify({ error: "rate_limited", message: "Too many requests — please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      // Fall through to OpenAI
    }

    // OpenAI fallback
    if (OPENAI_API_KEY) {
      const openaiMessages = [
        { role: "system", content: systemPrompt },
        ...messages,
      ];

      const response = await fetch(OPENAI_API, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: openaiMessages,
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const status = response.status;
        const body = await response.text();
        console.error(`OpenAI error [${status}]:`, body);
        if (status === 429) {
          return new Response(
            JSON.stringify({ error: "rate_limited", message: "Too many requests — please try again in a moment." }),
            { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
          );
        }
        throw new Error(`OpenAI error [${status}]: ${body}`);
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content ?? "";
      const solved = text.includes("[SOLVED]");
      const cleanText = text.replace("[SOLVED]", "").trim();

      return new Response(
        JSON.stringify({ reply: cleanText, solved }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    throw new Error("No AI provider succeeded");
  } catch (e) {
    console.error("socratic-chat error:", e);
    return new Response(
      JSON.stringify({
        error: "server_error",
        message: e instanceof Error ? e.message : "Unknown error",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});