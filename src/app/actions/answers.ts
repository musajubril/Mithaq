"use server";

import dbConnect from "@/lib/mongodb";
import Answer from "@/models/Answer";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

import User from "@/models/User";
import Question from "@/models/Question";

export async function saveAnswer(questionId: string, value: string | number) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  try {
    await dbConnect();

    const user = await User.findById(session.user.id);
    if (!user) return { error: "User not found" };

    const question = await Question.findById(questionId);
    if (!question) return { error: "Question not found" };

    // Check if user already answered this question
    const existingAnswer = await Answer.findOne({
      userId: session.user.id,
      questionId,
    });

    if (existingAnswer) {
      existingAnswer.answer = value;
      await existingAnswer.save();
    } else {
      await Answer.create({
        userId: session.user.id,
        questionId,
        partnershipId: user.partnershipId,
        category: question.category,
        questionIndex: question.order,
        question: question.text,
        answer: value,
      });
    }

    revalidatePath("/dashboard");
    revalidatePath(`/questionnaire`);
    
    return { success: true };
  } catch (error) {
    console.error("Save answer error:", error);
    return { error: "Something went wrong" };
  }
}

export async function getCategoryProgress(category: string) {
  const session = await auth();
  if (!session?.user?.id) return 0;

  try {
    await dbConnect();
    // This is a placeholder logic for now
    return 0;
  } catch (error) {
    return 0;
  }
}
