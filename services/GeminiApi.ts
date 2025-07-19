import { CreateFormState } from "@/app/create/createForm/controller";
import { ApiConfig } from "@/constants/ApiConfig";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: ApiConfig.GEMINI,
});

type PreferenceType = "ingredient" | "diet" | "region";

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

export async function cleanPreferencesByType(
  inputList: string[],
  type: PreferenceType
): Promise<string[]> {
  const examples: Record<PreferenceType, string> = {
    ingredient: `- Misspellings are corrected (e.g., "choclate" → "chocolate")\n- Nonsense words are removed (e.g., "asdasd")\n- Brand-like terms such as "Milo" are preserved`,
    diet: `- Misspellings are corrected (e.g., "vegen" → "vegan")\n- Only valid named diet styles are retained (e.g., "low-carb", "keto")\n- Remove duplicates`,
    region: `- Normalize cuisine types (e.g., "malay" → "Malaysian", "brit" → "British")\n- Remove invalid or non-food-related regions`,
  };

  const prompt = `
User entered the following ${type} preferences: ${JSON.stringify(inputList)}

Clean the list:
${examples[type]}

Return the cleaned result as a JSON array of strings with no explanation.
`;

  const raw = await callGeminiStructured({
    prompt,
    systemInstruction:
      "You are a certified nutritionist and global culinary expert.",
  });

  try {
    const cleanedRaw = raw
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const cleaned = JSON.parse(cleanedRaw);
    return cleaned;
  } catch (err) {
    console.error(`Failed to parse cleaned ${type}s`, err);
    return inputList;
  }
}

export async function generateTagsWithGemini(
  postType: CreateFormState["postType"],
  form: CreateFormState
): Promise<string[]> {
  const getPrompt = () => {
    switch (postType) {
      case "recipe":
        return `Generate as many relevant tags as possible for the following recipe:

Title: ${form.title}
Description: ${form.content}
Ingredients: ${form.ingredient
          .map((i) => `${i.name} (${i.quantity})`)
          .join(", ")}
Category: ${form.category.map((c) => c.name).join(", ")}
Mealtime: ${form.mealtime.join(", ")}

Instructions: ${form.instructions.map((i) => i.text).join(" ")}

Rules:
• Diet-related tags (e.g., vegetarian, vegan, gluten-free) must be based **strictly on the ingredients only**.
• Use the title, description, and steps to extract other useful tags like cooking method, texture, flavor, dish type, etc.
• ⚠️ Do NOT include region, country, or ethnicity-based tags such as 'malaysian', 'chinese', 'italian', etc.

Examples of valid tags: 'vegetarian', 'baked', 'sweet', 'fruit', 'tart', 'pescatarian', 'gluten-free', 'keto', 'comfortfood', 'fried', 'peanut', 'pancake', 'chicken', 'no-cook', 'onepot', 'crispy'`;

      case "tips":
        return `Generate tags for the tip post:

Title: ${form.title}
Content: ${form.content}`;

      case "discussion":
        return `Generate tags for the discussion post:

Title: ${form.title}
Content: ${form.content}`;

      case "community":
        return `Generate tags for the community:

Community Name: ${form.title}
Description: ${form.content}`;

      default:
        return "";
    }
  };

  try {
    const raw = await callGeminiStructured({
      prompt: getPrompt(),
      systemInstruction:
        "You are a helpful assistant trained in content tagging. Output only a JSON array of concise, lowercase, relevant tags as strings. Do not include hashtags or special characters.",
    });

    const response = raw.trim();
    if (!response) return [];

    const jsonMatch = response.match(/\[.*?\]/s);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return [];
  } catch (err) {
    console.error("Gemini tag generation failed:", err);
    return [];
  }
}

export async function getIngredientSubstitutes(
  ingredientName: string
): Promise<string[]> {
  const prompt = `
Provide a list of suitable substitute ingredients for: "${ingredientName}"

Rules:
- Keep substitutes realistic and commonly available in households or supermarkets.
- Consider substitutions that preserve similar texture, flavor, or cooking function.
- Limit to 5–10 alternatives.
- Output as a plain JSON array of ingredient names. No explanation or extra text.
`;

  try {
    const raw = await callGeminiStructured({
      prompt,
      systemInstruction:
        "You are a certified chef and expert in ingredient substitutions.",
    });

    const cleanedRaw = raw
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleanedRaw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error(`Substitute lookup failed for "${ingredientName}"`, err);
    return [];
  }
}
