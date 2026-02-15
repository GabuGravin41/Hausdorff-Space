import { GoogleGenAI, Type, Schema } from "@google/genai";
import { IdeaSeparation } from '../types';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema: Schema = {
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

export const separateIdeas = async (inputText: string): Promise<IdeaSeparation> => {
  try {
    const model = "gemini-3-flash-preview";
    
    const prompt = `
      You are a rigorous logician for 'Hausdorff Space', an intellectual collective. 
      Your task is to perform a topological separation of the following thought.
      1. Identify the core axiom or argument.
      2. Separate distinct ideas into disjoint neighborhoods (bullet points).
      3. Identify noise (entropy) that dilutes the signal.
      4. Rate the rigor.
      
      Input Text:
      "${inputText}"
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        systemInstruction: "You are the guardian of rigor. You reject ambiguity. You value precision, mathematical logic, and clear separation of concepts.",
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from model");
    }

    return JSON.parse(text) as IdeaSeparation;
  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    throw error;
  }
};