
import { IdeaSeparation } from '../types';

// Vercel serverless function handles the proxy securely.
// In local dev, call the Express proxy directly to avoid stale Vite middleware/proxy state.
const OPENROUTER_ENDPOINT = import.meta.env.DEV
  ? "http://localhost:3001/api/openrouter"
  : "/api/openrouter";
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

    const userPrompt = `You are a rigorous logician for 'Hausdorff Space', an intellectual collective. Perform a topological separation of this thought.

RIGOR SCORING RUBRIC — apply this strictly and honestly. Most arguments score 20–50. Do NOT default to 75.

0–20:   Incoherent, purely emotional, circular, or self-contradicting. No logical structure present.
21–40:  Some recognizable structure but contains major logical fallacies, unsupported assertions, or unfalsifiable claims.
41–60:  Reasonable argument with a discernible core, but missing formal grounding, has significant gaps, or relies on untested premises.
61–80:  Well-structured argument with supporting evidence, minor weaknesses, clear premises, and mostly consistent reasoning.
81–100: Formally rigorous, empirically grounded, logically consistent, minimal noise. Reserve this tier for near-mathematical or scientific-paper-level arguments.

A vague or cliché argument MUST score below 40. A strong everyday argument typically scores 45–65. 80+ is rare and earned.

Now analyze:
1. Identify the core axiom or argument (the single strongest claim being made).
2. Separate distinct ideas into disjoint neighborhoods (as distinct bullet points — no overlap).
3. Identify noise: vague language, rhetorical filler, unsupported leaps, emotional appeals, or entropy that dilutes the signal.
4. Apply the rubric above to produce a rigorous and honest rigorScore.

Input Text:
"${inputText}"`;

    const response = await fetch(OPENROUTER_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
      
      // Provide user-friendly error messages
      if (response.status === 401) {
        throw new Error("API key is invalid. Please check your VITE_OPENROUTER_API_KEY environment variable.");
      } else if (response.status === 429) {
        throw new Error("Rate limit exceeded. Please try again in a few moments.");
      } else if (response.status >= 500) {
        throw new Error("OpenRouter service is temporarily unavailable. Please try again later.");
      } else if (response.status === 404) {
        throw new Error("API route not found. If local, ensure server is running with `npm run dev`.");
      } else if (response.status === 405) {
        throw new Error("Method not allowed at API route. Restart dev server and try again.");
      }
      
      throw new Error(`OpenRouter API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const responseText = data.choices[0]?.message?.content;
    
    if (!responseText) {
      throw new Error("No response from model. Please try again.");
    }

    // Parse JSON response (remove markdown code blocks if present)
    const cleanedText = responseText
      .replace(/^```(?:json)?\n?/, "")
      .replace(/\n?```$/, "")
      .trim();

    const result = JSON.parse(cleanedText) as IdeaSeparation;
    
    // Validate the response structure
    if (!result.coreArgument || !Array.isArray(result.distinctPoints) || typeof result.rigorScore !== 'number') {
      throw new Error("Invalid response format from AI model. Please try again.");
    }
    
    return result;
  } catch (error) {
    console.error("OpenRouter Analysis Failed:", error);
    
    // Re-throw with user-friendly message if it's a generic error
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error("Failed to analyze input. Please check your connection and try again.");
  }
};
