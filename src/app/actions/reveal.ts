"use server";

import dbConnect from "@/lib/mongodb";
import Answer from "@/models/Answer";
import User from "@/models/User";
import { auth } from "@/auth";

export async function getComparisonData(questionId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  try {
    await dbConnect();

    const user = await User.findById(session.user.id);
    if (!user.partnerId) return { error: "Partner not linked" };

    const userEmail = session.user.email;
    const partnerId = user.partnerId;

    const userAnsw = await Answer.findOne({ userId: session.user.id, questionId });
    const partnerAnsw = await Answer.findOne({ userId: partnerId, questionId });

    const bothAnswered = userAnsw && partnerAnsw;

    return {
      userAnswer: userAnsw?.answer || null,
      partnerAnswer: bothAnswered ? partnerAnsw.answer : null,
      isRevealed: !!bothAnswered,
      message: bothAnswered ? null : "Waiting for partner to answer..."
    };
  } catch (error) {
    console.error("Comparison data error:", error);
    return { error: "Something went wrong" };
  }
}
