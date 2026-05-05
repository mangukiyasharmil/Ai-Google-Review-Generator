import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface ReviewRequest {
  category: string;
  tone: "good" | "great" | "excellent";
  length: "short" | "medium" | "detailed";
}

export async function generateReview(request: ReviewRequest): Promise<string> {
  const { category, tone, length } = request;

  const prompt = `
You are a top-tier SEO copywriter writing a professional B2B Google review for "Manshav Impex", the best medical products exporter in Surat, Gujarat.

Your goal is to write a review that ranks high for "Manshav Review" and "Exporter in Surat".

INPUT:
Category: ${category}
Tone: ${tone === "excellent" ? "highly professional and impressed" : tone === "great" ? "positive and reliable" : "satisfied"}
Length: ${length}

SEO KEYWORDS to prioritize (use at least 3 naturally):
- "Best Manshav Impex Review"
- "Top medical products exporter in Surat"
- "Reliable export company in India"
- "Bespoke Healthcare Logistics"
- "Global Medical Trade Partner"
- "Medical Equipment Supplier Surat"
- "High-quality medical equipment exporter"
- "Trusted international trading partner Surat"

GUIDELINES:
- Start with a strong statement.
- Use "Manshav Impex" early in the text.
- Mention "Surat" or "Gujarat" to help with local SEO.
- Mention specific professional strengths like "professional handling", "on-time delivery", or "compliance standards".
- Keep it natural—not robotic.
- Max 100 words.

OUTPUT:
Only return the review text. No headings. No quotes. No intro/outro.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text || "Failed to generate review. Please try again.";
  } catch (error) {
    console.error("Error generating review:", error);
    throw error;
  }
}
