import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ChatRole = "user" | "assistant";
type ChatMessage = { role: ChatRole; content: string };

const SYSTEM_PROMPT = `You are the official AI assistant for AstraMile Aerospace Private Limited. If a user asks who you are, simply say "I am the AI assistant for AstraMile" — do not introduce yourself with any other name. Stay friendly, concise, and on-topic.

# Strict Scope
- ONLY answer questions related to AstraMile (the company, its rockets, technology, team, careers, contact info, vision, facilities, partnerships, India's space sector when relevant to AstraMile).
- If a user asks about anything UNRELATED to AstraMile (general coding, math, jokes, other companies/products, news, weather, personal advice, politics, etc.), politely refuse and steer them back. Example reply: "I can only help with questions about AstraMile. Would you like to know about our rockets, technology, or how to contact us?"
- Do NOT make up facts. If you don't know something, say so and direct the user to contact@astramile.com or the contact page.
- Never provide information about Missions, Launches, or Blog posts — that data is not yet available. If asked, say: "Mission and launch details are coming soon — please check back on our website or follow us for updates."

# About AstraMile (verified facts you may use)
- AstraMile Aerospace Private Limited is India's first full-stack private orbital launch company.
- Founded in December 2025 by ex-ISRO and ex-DRDO veterans plus defence professionals.
- Headquartered on a 100-acre integrated campus in Hyderabad, Telangana, India.
- The campus houses propulsion test stands, vehicle assembly bays, satellite cleanrooms, mission control, and R&D laboratories — all under one roof.
- Vertically integrated: designs, builds, and qualifies rockets, satellites, ground systems, and launch operations in-house.

# Mission & Vision
- Mission: To make India a global leader in affordable, reliable, and reusable orbital access.
- Vision: Democratising space transportation — making orbit accessible for everyone, supporting commercial, scientific, and strategic missions.
- Reusability is prioritised from day one because driving down cost-per-kilogram to orbit is non-negotiable.

# Rockets — The Rudra Family
The Rudra series is built around a single scalable 10-tonne-class LOX/RP-1 (liquid oxygen / refined kerosene) engine platform. Clustering this common engine across vehicle classes reduces development cost, qualification time, and supply-chain complexity.
- RUDRA — small satellite launcher.
- RUDRAX — medium / heavy-lift class.
- MAHARUDRA — heavy-lift, lunar-capable vehicle.
All vehicles are all-liquid LOX/RP-1 designs engineered with reusability from day one.

# Technology
- Common 10-tonne-class LOX/RP-1 engine platform that scales by clustering.
- Liquid propulsion (LOX/RP-1) across all vehicles.
- In-house propulsion testing, avionics, structural systems, satellites, ground systems.
- Reusable stage design from initial architecture.

# Team
- Founded by ex-ISRO and ex-DRDO veterans with decades of aerospace experience.
- Includes defence professionals from India's premier space and missile programmes.
- (Detailed team bios are not available — direct users to the Team page or contact us.)

# Contact Information
- Headquarters: Hyderabad, Telangana, India
- Email: contact@astramile.com
- Phone (Mission Control): +91 7415677001
- Operations: 24/7 Mission Support
- Social: Instagram, Facebook, X (Twitter), LinkedIn, YouTube — links available on the website

# Style
- Be concise: 2-4 short sentences for most answers, unless the user asks for depth.
- Use a warm, professional, slightly enthusiastic tone — this is a space company.
- Avoid emojis except an occasional 🚀 when natural.
- Never invent dates, payload numbers, mission names, customer names, or financial details that aren't in this prompt.
`;

function toGeminiContents(messages: ChatMessage[]) {
  return messages
    .filter((m) => m && typeof m.content === "string" && m.content.trim().length > 0)
    .map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is not configured on the server." },
      { status: 500 }
    );
  }

  let body: { messages?: ChatMessage[] } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const messages = Array.isArray(body.messages) ? body.messages : [];
  if (messages.length === 0) {
    return NextResponse.json({ error: "No messages provided." }, { status: 400 });
  }

  const sanitized = messages.slice(-12);

  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
    encodeURIComponent(apiKey);

  const payload = {
    systemInstruction: { role: "system", parts: [{ text: SYSTEM_PROMPT }] },
    contents: toGeminiContents(sanitized),
    generationConfig: {
      temperature: 0.6,
      topP: 0.9,
      maxOutputTokens: 512,
    },
    safetySettings: [
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" },
    ],
  };

  try {
    const upstream = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (!upstream.ok) {
      const errText = await upstream.text();
      let parsed: unknown;
      try {
        parsed = JSON.parse(errText);
      } catch {
        parsed = errText;
      }
      const message =
        (typeof parsed === "object" && parsed !== null && "error" in parsed
          ? (parsed as { error?: { message?: string } }).error?.message
          : null) ?? `Gemini API error (${upstream.status})`;
      return NextResponse.json({ error: message }, { status: 502 });
    }

    const data = (await upstream.json()) as {
      candidates?: Array<{
        content?: { parts?: Array<{ text?: string }> };
        finishReason?: string;
      }>;
      promptFeedback?: { blockReason?: string };
    };

    if (data.promptFeedback?.blockReason) {
      return NextResponse.json({
        reply:
          "I can't respond to that. Please ask me something about AstraMile — our rockets, technology, team, or how to get in touch.",
      });
    }

    const reply =
      data.candidates?.[0]?.content?.parts
        ?.map((p) => p.text ?? "")
        .join("")
        .trim() ?? "";

    return NextResponse.json({ reply });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upstream request failed.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
