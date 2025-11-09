import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { NextResponse } from "next/server";
import { initialMessage } from "@/lib/initial-message"; // optional system prompt

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

// export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    console.log("API Key exists:", !!process.env.OPENAI_API_KEY);
    console.log("API Key length:", process.env.OPENAI_API_KEY?.length);
    console.log("Received messages:", messages);
    console.log("Initial message:", initialMessage);

    const stream = streamText({
      model: openai("gpt-4o-mini"),
      messages: [initialMessage, ...messages],
      temperature: 0.9,
    });

    console.log("Stream created successfully");
    return stream.toTextStreamResponse();
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return NextResponse.json(
      { error: "Failed to connect to OpenAI", details: String(error) },
      { status: 500 }
    );
  }
}
