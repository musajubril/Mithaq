import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Question from "@/models/Question";
import Answer from "@/models/Answer";

export async function getCharterData() {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  try {
    await dbConnect();
    const user = await User.findById(session.user.id).populate("partnerId");
    if (!user || !user.partnerId) return { error: "Partner not linked" };

    const questions = await Question.find().sort({ category: 1, order: 1 });
    const userAnswers = await Answer.find({ userId: session.user.id });
    const partnerId = typeof user.partnerId === 'string' ? user.partnerId : user.partnerId._id;
    const partnerAnswers = await Answer.find({ userId: partnerId });

    const sharedAnswers = [];

    for (const q of questions) {
      if (!q?._id) continue;
      
      const qid = q._id.toString();
      const uA = userAnswers.find(a => a.questionId?.toString() === qid);
      const pA = partnerAnswers.find(a => a.questionId?.toString() === qid);

      if (uA && pA) {
        const formatVal = (v: any) => v === true ? "Yes" : v === false ? "No" : v;
        sharedAnswers.push({
          question: q.text,
          category: q.category,
          userValue: formatVal((uA as any).answer),
          partnerValue: formatVal((pA as any).answer),
        });
      }
    }

    if (sharedAnswers.length === 0) {
      return { error: "No shared reflections found. Both partners must answer at least one common question to generate a covenant." };
    }

    return {
      userName: user.fullName || "User",
      partnerName: (user.partnerId as any)?.fullName || "Partner",
      sharedAnswers,
    };
  } catch (error) {
    console.error("Charter data error details:", error);
    return { error: `Something went wrong: ${error instanceof Error ? error.message : "Unknown error"}` };
  }
}
