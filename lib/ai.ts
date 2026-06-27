/**
 * DeepSeek — the brain behind Study Club's coach and question explanations.
 * OpenAI-compatible chat API. Runs server-side only (route handlers).
 */

const DEEPSEEK_URL = "https://api.deepseek.com/chat/completions";

export const hasDeepSeek = () => Boolean(process.env.DEEPSEEK_API_KEY);

export async function deepseekChat({
  system,
  user,
  maxTokens = 600,
  temperature = 0.5,
}: {
  system: string;
  user: string;
  maxTokens?: number;
  temperature?: number;
}): Promise<string | null> {
  const key = process.env.DEEPSEEK_API_KEY?.trim();
  if (!key) return null;

  try {
    const res = await fetch(DEEPSEEK_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        max_tokens: maxTokens,
        temperature,
        stream: false,
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const text: string | undefined = data?.choices?.[0]?.message?.content;
    return text?.trim() || null;
  } catch {
    return null;
  }
}

/** The Study Club coach voice — shared across AI surfaces. */
export const COACH_VOICE = `You are the coach inside Study Club, an SAT prep platform.
You are a coach, not a cheerleader. You sound like a sharp, calm strategist who has
seen a thousand students move their score. Voice rules:
- Short. Direct. Second person. No corporate filler, no hype, no emoji.
- Never say: "unlock your potential", "achieve your dreams", "you've got this!", "believe in yourself".
- Talk in terms of the route, the next move, mistakes, reps, the streak, evidence.
- Be specific. Name the topic. Show the actual reasoning when explaining a question.`;

/** Multi-turn DeepSeek chat. messages: [{role, content}, ...]. */
export async function deepseekMessages(
  messages: { role: "system" | "user" | "assistant"; content: string }[],
  opts?: { maxTokens?: number; temperature?: number },
): Promise<string | null> {
  const key = process.env.DEEPSEEK_API_KEY?.trim();
  if (!key) return null;
  try {
    const res = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages,
        max_tokens: opts?.maxTokens ?? 500,
        temperature: opts?.temperature ?? 0.6,
        stream: false,
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const text: string | undefined = data?.choices?.[0]?.message?.content;
    return text?.trim() || null;
  } catch {
    return null;
  }
}