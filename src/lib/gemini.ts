import { GoogleGenAI } from "@google/genai";

// The client gets the API key from the environment variable GEMINI_API_KEY.
const ai = new GoogleGenAI({});

export async function generateDailyPrompt(userAnswers: any[], partnerAnswers: any[]) {
  const fallbacks = [
    "What is one thing your partner did this week that made you feel truly respected?",
    "In what area of your shared life would you like to invite more intentionality today?",
    "How can you better support your partner's personal and spiritual growth this month?",
    "What is a value you see in your partner that you wish to cultivate more in yourself?",
    "If you could describe your relationship's current season in one word, what would it be and why?"
  ];

  // Sanitize answers to prevent large/invalid prompts
  const cleanUserAnswers = userAnswers.map(ans => ans.content || ans.answer || "").filter(Boolean).slice(0, 3);
  const cleanPartnerAnswers = partnerAnswers.map(ans => ans.content || ans.answer || "").filter(Boolean).slice(0, 3);

  const prompt = `
    You are an AI relationship coach for an app called Mithaq (مِيثَاق).
    Your goal is to provide a deep, intentional daily reflection prompt for a couple.
    
    Based on their recent shared reflections:
    User's recent thoughts: ${cleanUserAnswers.join(", ")}
    Partner's recent thoughts: ${cleanPartnerAnswers.join(", ")}
    
    Generate a single, poetic, and profound question that helps them connect further.
    The question should be concise (15-20 words), editorial in tone, and focused on spiritual/emotional growth.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    
    const text = response?.text?.trim().replace(/^"|"$/g, '');
    if (!text || text.length < 10) throw new Error("Invalid response");
    return text;
  } catch (error: any) {
    console.error("Gemini Error:", error?.message || error);
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }
}
