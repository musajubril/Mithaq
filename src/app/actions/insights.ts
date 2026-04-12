"use server";

import dbConnect from "@/lib/mongodb";
import Answer from "@/models/Answer";
import Question from "@/models/Question";
import User from "@/models/User";
import { auth } from "@/auth";

export async function getAlignmentScores() {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  try {
    await dbConnect();
    const user = await User.findById(session.user.id);
    const partnerId = user.partnerId;

    if (!partnerId) return { error: "Partner not linked" };

    const categories = await Question.distinct("category");
    const scores = [];

    for (const category of categories) {
      const catQuestions = await Question.find({ category });
      const questionIds = catQuestions.map(q => q._id);

      const userAnswers = await Answer.find({ 
        userId: session.user.id, 
        questionId: { $in: questionIds } 
      });
      const partnerAnswers = await Answer.find({ 
        userId: partnerId, 
        questionId: { $in: questionIds } 
      });

      // Calculate alignment: 1 - (abs(userVal - partnerVal) / 4)
      // We only consider questions answered by BOTH
      let totalAlignment = 0;
      let sharedCount = 0;

      for (const uA of userAnswers) {
        const pA = partnerAnswers.find(a => a.questionId.toString() === uA.questionId.toString());
        if (pA) {
          const diff = Math.abs(uA.responseValue - pA.responseValue);
          const alignment = 100 * (1 - diff / 4);
          totalAlignment += alignment;
          sharedCount++;
        }
      }

      scores.push({
        category,
        score: sharedCount > 0 ? Math.round(totalAlignment / sharedCount) : 0,
        fullMark: 100
      });
    }

    return { scores };
  } catch (error) {
    console.error("Alignment calculation error:", error);
    return { error: "Something went wrong" };
  }
}
