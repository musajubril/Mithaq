"use server";

import { generateDailyPrompt } from "@/lib/gemini";
import dbConnect from "@/lib/mongodb";
import Answer from "@/models/Answer";
import User from "@/models/User";
import { auth } from "@/auth";

export async function getDailyPrompt() {
  const session = await auth();
  if (!session?.user?.id) return null;

  try {
    await dbConnect();
    const user = await User.findById(session.user.id);
    const partnerId = user.partnerId;

    if (!partnerId) {
      return "Complete your partner sync to receive personalized daily reflections.";
    }

    // Fetch some recent shared answers
    const userAnswers = await Answer.find({ userId: session.user.id }).limit(5);
    const partnerAnswers = await Answer.find({ userId: partnerId }).limit(5);

    const prompt = await generateDailyPrompt(userAnswers, partnerAnswers);
    return prompt;
  } catch (error) {
    return "What is one thing your partner did this week that made you feel truly respected?";
  }
}
