
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { IdeaSeparation } from '../types';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Define analysis schema following Gemini SDK Type enumeration
const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    coreArgument: {
      type: Type.STRING,
      description: "The central thesis of the provided text, distilled to its essence.",
    },
    distinctPoints: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of distinct, non-overlapping logical points found in the text.",
    },
    noiseReduction: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Identification of vague rhetoric, emotional language, or logical fallacies to be removed.",
    },
    rigorScore: {
      type: Type.NUMBER,
      description: "A score from 0 to 100 indicating the logical rigorousness and clarity of the thought.",
    },
    constructiveCritique: {
      type: Type.STRING,
      description: "A brief, rigorous critique of the argument to encourage deeper thought.",
    },
  },
  required: ["coreArgument", "distinctPoints", "noiseReduction", "rigorScore", "constructiveCritique"],
};

/**
 * Performs a topological separation of ideas using Gemini.
 * Note: When using structured JSON output, we avoid tools like googleSearch 
 * to ensure strict adherence to the response schema as per SDK guidelines.
 */
export const separateIdeas = async (inputText: string): Promise<IdeaSeparation> => {
  try {
    // Select gemini-3-pro-preview for complex reasoning and philosophical/STEM tasks
    const model = 'gemini-3-pro-preview';
    
    const prompt = `
      You are a rigorous logician for 'Hausdorff Space', an intellectual collective. 
      Your task is to perform a topological separation of the following thought.
      1. Identify the core axiom or argument.
      2. Separate distinct ideas into disjoint neighborhoods (bullet points).
      3. Identify noise (entropy) that dilutes the signal.
      4. Rate the rigor based on logical consistency and empirical grounding.
      
      Input Text:
      "${inputText}"
    `;

    // Fix: Per SDK guidelines, search grounding and JSON parsing may conflict. 
    // We prioritize the structured reasoning output for this specific analysis.
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        systemInstruction: "You are the guardian of rigor. You reject ambiguity. You value precision, mathematical logic, and clear separation of concepts. Ensure output is strictly valid JSON matching the provided schema.",
      },
    });

    // Fix: Access .text property directly as per SDK requirements (not a method call)
    const text = response.text;
    if (!text) {
      throw new Error("No response from model");
    }

    const result = JSON.parse(text) as IdeaSeparation;
    return result;
  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    throw error;
  }
};
