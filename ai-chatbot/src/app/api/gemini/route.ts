import { streamText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { NextResponse } from "next/server";
import { initialMessage } from "@/lib/initial-message";

export const runtime = "edge";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY || "",
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    console.log("Gemini API Key exists:", !!process.env.GOOGLE_API_KEY);
    console.log("Received messages:", messages);

    const stream = streamText({
      model: google("models/gemini-2.5-pro"),
      messages: [initialMessage, ...messages],
      temperature: 0.9,
    });

    console.log("Returning Gemini stream...");
    return stream.toTextStreamResponse();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: "Failed to connect to Gemini", details: String(error) },
      { status: 500 }
    );
  }
}
