import { GoogleGenAI } from "@google/genai";
import { RankScore, UserProfile } from "../types";

// Note: In a production App, this should be proxied through a backend to protect the key.
// We assume process.env.API_KEY is available as per instructions.

export interface ProfileAnalysis {
  summary: string;
  tips: string[];
}

export const analyzeProfile = async (profile: UserProfile, rank: RankScore): Promise<ProfileAnalysis> => {
  try {
    if (!process.env.API_KEY) {
      throw new Error("API Key not found");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
      You are an expert social media analyst for Farcaster (a decentralized social network).
      Analyze the following user profile and their calculated rank score.
      
      User: ${profile.displayName} (@${profile.username})
      Bio: "${profile.bio}"
      Followers: ${profile.followerCount}
      Total Casts: ${profile.castCount}
      
      Calculated Rank: ${rank.totalScore}/100 (Tier: ${rank.tier})
      Strengths:
      - Activity Score: ${rank.breakdown.activityScore.toFixed(0)}/100
      - Follower Score: ${rank.breakdown.followerScore.toFixed(0)}/100
      - Frequency Score: ${rank.breakdown.castFrequencyScore.toFixed(0)}/100
      
      Task:
      1. Write a 1-sentence punchy, friendly personality summary based on their stats and bio.
      2. Provide 3 specific, actionable short tips to improve their rank score (focus on the lowest sub-scores).
      
      Output JSON format:
      {
        "summary": "string",
        "tips": ["tip1", "tip2", "tip3"]
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const data = JSON.parse(text);
    return {
      summary: data.summary || `A Farcaster explorer with ${rank.totalScore} potential points!`,
      tips: data.tips || ["Post more frequently", "Engage with other casters", "Complete your bio"]
    };

  } catch (error) {
    console.error("AI Analysis failed:", error);
    // Fallback if AI fails or key is missing
    return {
      summary: "AI services are currently resting. Keep casting!",
      tips: [
        "Increase your weekly cast frequency.",
        "Reply to more casts to boost engagement.",
        "Ensure your profile bio is fully fleshed out."
      ]
    };
  }
};


export const compareProfiles = async (p1: UserProfile, r1: RankScore, p2: UserProfile, r2: RankScore): Promise<string> => {
   try {
    if (!process.env.API_KEY) return "Comparison unavailable (No API Key).";

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
      Compare two Farcaster users briefly in 2 sentences.
      User A: @${p1.username} (Rank: ${r1.totalScore}, Tier: ${r1.tier})
      User B: @${p2.username} (Rank: ${r2.totalScore}, Tier: ${r2.tier})
      
      Be competitive but friendly. Who is winning and why?
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text || "Comparison data unavailable.";
   } catch (e) {
     return "AI Comparison unavailable.";
   }
}
