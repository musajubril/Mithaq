import dbConnect from "../lib/mongodb";
import Question from "../models/Question";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function seed() {
  await dbConnect();
  
  const jsonPath = path.join(process.cwd(), "..", "marriage_questionnaire.questions.json");
  const questionsData = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

  console.log(`Found ${questionsData.length} questions in JSON.`);

  // Categorization Logic
  function getQuestionType(text: string): 'text' | 'scale' | 'binary' {
    const t = text.toLowerCase();
    
    if (t.includes('0-5') || t.includes('1-5') || t.includes('grade your fluency') || t.includes('how often')) {
      return 'scale';
    }
    if (t.includes('how many times')) {
      return 'scale';
    }
    
    if (t.startsWith('are you') || t.startsWith('do you') || t.startsWith('can you') || t.startsWith('have you') || t.startsWith('would you') || t.startsWith('is your') || t.startsWith('if not')) {
      if (!t.includes('how') && !t.includes('why') && !t.includes('what')) {
        return 'binary';
      }
    }
    
    return 'text';
  }

  const formattedQuestions = questionsData.map((q: any) => ({
    text: q.question,
    category: q.category,
    order: q.order,
    categoryOrder: q.categoryOrder,
    type: getQuestionType(q.question),
    options: getQuestionType(q.question) === 'binary' ? ["Yes", "No"] : []
  }));

  try {
    // Clear existing questions
    await Question.deleteMany({});
    console.log("Cleared existing questions.");

    // Insert new questions
    await Question.insertMany(formattedQuestions);
    console.log("Successfully seeded 196 questions.");
    
    process.exit(0);
  } catch (error) {
    console.error("Error seeding questions:", error);
    process.exit(1);
  }
}

seed();
