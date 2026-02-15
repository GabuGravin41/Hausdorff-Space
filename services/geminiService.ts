
import { IdeaSeparation } from '../types';

// Vercel serverless function handles the proxy securely
// Works on both local and deployed versions
const OPENROUTER_ENDPOINT = "/api/openrouter";
const MODEL = "deepseek/deepseek-chat"; // Free Deepseek variant

/**
 * Performs a topological separation of ideas using OpenRouter with Deepseek.
 * Returns structured JSON analysis of the input text.
 */
export const separateIdeas = async (inputText: string): Promise<IdeaSeparation> => {
  try {
    const systemPrompt = `You are the guardian of rigor. You reject ambiguity. You value precision, mathematical logic, and clear separation of concepts. 
    
    Respond ONLY with valid JSON (no markdown, no code blocks) matching this exact structure:
    {
      "coreArgument": "string",
      "distinctPoints": ["string"],
      "noiseReduction": ["string"],
      "rigorScore": number,
      "constructiveCritique": "string"
    }`;

    const userPrompt = `You are a rigorous logician for 'Hausdorff Space', an intellectual collective. Perform a topological separation of this thought:

    1. Identify the core axiom or argument.
    2. Separate distinct ideas into disjoint neighborhoods (as bullet points).
    3. Identify noise (entropy) that dilutes the signal.
    4. Rate the rigor from 0-100 based on logical consistency and empirical grounding.
    
    Input Text:
    "${inputText}"`;

    const response = await fetch(OPENROUTER_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Response status:", response.status);
      console.error("Response body:", errorText);
      throw new Error(`OpenRouter API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const responseText = data.choices[0]?.message?.content;
    
    if (!responseText) {
      throw new Error("No response from model");
    }

    // Parse JSON response (remove markdown code blocks if present)
    const cleanedText = responseText
      .replace(/^```(?:json)?\n?/, "")
      .replace(/\n?```$/, "")
      .trim();

    const result = JSON.parse(cleanedText) as IdeaSeparation;
    return result;
  } catch (error) {
    console.error("OpenRouter Analysis Failed:", error);
    throw error;
  }
};
