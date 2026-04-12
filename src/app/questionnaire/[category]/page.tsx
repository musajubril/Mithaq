import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import Question from "@/models/Question";
import Answer from "@/models/Answer";
import QuestionnaireClient from "./QuestionnaireClient";
import { redirect } from "next/navigation";

export default async function QuestionnairePage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  await dbConnect();

  const decodedCategory = decodeURIComponent(category);
  const questions = await Question.find({ category: decodedCategory }).sort({ order: 1 });
  
  if (!questions || questions.length === 0) {
    redirect("/dashboard");
  }

  // Get existing answers for this user in this category
  const existingAnswers = await Answer.find({
    userId: session.user.id,
    questionId: { $in: questions.map(q => q._id) }
  });

  const answersMap = new Map(existingAnswers.map(a => [a.questionId.toString(), (a as any).answer]));

  // Find first unanswered question index
  let initialIndex = 0;
  for (let i = 0; i < questions.length; i++) {
    if (!answersMap.has(questions[i]._id.toString())) {
      initialIndex = i;
      break;
    }
  }

  return (
    <div className="min-h-screen bg-surface">
      <QuestionnaireClient 
        category={decodedCategory} 
        initialQuestions={JSON.parse(JSON.stringify(questions))}
        initialAnswers={Object.fromEntries(answersMap)}
        initialIndex={initialIndex}
      />
    </div>
  );
}
