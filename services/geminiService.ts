import { GoogleGenAI, Type } from "@google/genai";
import { GMBResult, ProfileAnalysisResult } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const findBusinessReviewLink = async (businessName: string, location: string): Promise<GMBResult> => {
  const modelId = "gemini-2.5-flash"; 
  
  // Guidelines state we cannot use responseSchema or responseMimeType with googleMaps tool.
  // We will ask for a JSON-like string and parse it.
  const prompt = `
    Find the business "${businessName}" located in "${location}".
    I need you to provide the business name, full address, and a direct Google Maps link to write a review for this business (or the Google Maps link for the business if a direct review link isn't available).
    
    Return ONLY a raw JSON object (no markdown code blocks, just the json) with the following structure:
    {
      "businessName": "Exact Business Name",
      "address": "Full Address",
      "reviewUrl": "The URL"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
      }
    });

    const text = response.text || "{}";
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const data = JSON.parse(cleanText);
    
    return {
        businessName: data.businessName || businessName,
        address: data.address || location,
        reviewUrl: data.reviewUrl || `https://www.google.com/search?q=${encodeURIComponent(businessName + ' ' + location)}`
    };
  } catch (error) {
    console.error("Error finding business:", error);
    throw new Error("Não foi possível encontrar o negócio ou gerar o link.");
  }
};

export const analyzeProfile = async (input: string): Promise<ProfileAnalysisResult> => {
  const modelId = "gemini-3-flash-preview";
  
  const prompt = `
    Analyze the digital presence and Google Business Profile for: "${input}".
    Act as an expert digital marketing consultant auditing a client's profile to sell optimization services.
    
    Provide a detailed analysis including:
    1. A profile strength score (0-100) based on completeness, reviews, and photos.
    2. Key metrics estimation (Review count, Rating, Photo count estimate, Activity level like "High", "Moderate", "Low", "Inactive").
    3. Persuasive sales arguments to convince the owner to hire a management service.
    4. Missing elements (e.g., "No owner response to reviews", "Missing products", "Low photo quality").
    5. Potential growth summary.

    Use Google Search to find real information about this business.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            businessName: { type: Type.STRING },
            profileStrength: { type: Type.INTEGER },
            metrics: {
              type: Type.OBJECT,
              properties: {
                reviewCount: { type: Type.STRING },
                rating: { type: Type.STRING },
                photoEstimate: { type: Type.STRING },
                activityLevel: { type: Type.STRING },
              }
            },
            salesArguments: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            missingElements: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            potentialGrowth: { type: Type.STRING }
          }
        }
      }
    });

    const text = response.text || "{}";
    return JSON.parse(text) as ProfileAnalysisResult;
  } catch (error) {
    console.error("Error analyzing profile:", error);
    throw new Error("Não foi possível analisar o perfil.");
  }
};