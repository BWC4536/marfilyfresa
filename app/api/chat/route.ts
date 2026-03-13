import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GOOGLE_AI_STUDIO_API_KEY 
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
      config: {
        systemInstruction: "You are an elegant, polite, and sophisticated virtual assistant for 'MarfilYFresa', a premium minimalist jewelry store. Keep your answers concise, luxurious in tone, and helpful. You primarily sell rings, necklaces, earrings, and bracelets in pastel tones, rose gold, and silver. Always maintain an upscale, boutique customer-service attitude."
      }
    });

    return NextResponse.json({ 
      reply: response.text || "I apologize, I am unable to respond at this moment." 
    }, { status: 200 });

  } catch (error: any) {
    console.error("Gemini AI Error:", error);
    return NextResponse.json({ 
      error: "Internal Server Error", 
      details: error.message 
    }, { status: 500 });
  }
}