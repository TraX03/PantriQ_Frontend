import { ApiConfig } from "@/constants/ApiConfig";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: ApiConfig.GEMINI,
});

type GeminiOptions = {
  prompt: string;
  model?: string;
  systemInstruction?: string;
};

async function callGeminiStructured({
  prompt,
  model = "gemini-2.5-flash",
  systemInstruction,
}: GeminiOptions): Promise<string> {
  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      systemInstruction,
    },
  });

  return response.text?.trim() ?? "";
}

export async function callGemini(prompt: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      systemInstruction:
        "You are a certified nutritionist and expert meal planner. ",
    },
  });

  return response.text?.trim() ?? "No response from Gemini.";
}

export async function predictExpiryDateTime(
  ingredientName: string
): Promise<string> {
  const today = new Date().toISOString().split("T")[0];

  const prompt = `
Today is ${today}. Given the ingredient "${ingredientName}" stored in a typical household refrigerator, predict a reasonable expiry date and time in ISO 8601 format (e.g., "2025-06-23T20:00:00Z").

Respond with only the ISO 8601 date and time. No explanation.
`;

  const raw = await callGeminiStructured({
    prompt,
    systemInstruction:
      "You are a certified nutritionist and expert in food spoilage patterns.",
  });

  const isoMatch = raw.match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z/);
  return isoMatch?.[0] ?? "Unknown";
}
