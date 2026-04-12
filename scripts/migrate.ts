import mongoose from "mongoose";
import Question from "../src/models/Question.js";
import dbConnect from "../src/lib/mongodb.js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config({ path: ".env.local" });

async function migrate() {
  try {
    // 1. Connect to MongoDB
    await dbConnect();
    console.log("Connected to MongoDB for migration...");

    // 2. Read questions from JSON file
    const entries = JSON.parse(fs.readFileSync("marriage_questionnaire.questions.json", "utf-8"));
    console.log(`Read ${entries.length} entries from JSON file.`);

    // 3. Map JSON entries to Question model fields
    const questions = entries.map((entry: any) => ({
      text: entry.question, // Map 'question' to 'text'
      category: entry.category,
      order: entry.order,
      categoryOrder: entry.categoryOrder,
      type: entry.type || 'text', // Default to 'text' if not specified
      options: entry.options || []
    }));

    // 4. Clear existing questions (optional, but usually desired for seeding)
    const existingCount = await Question.countDocuments();
    if (existingCount > 0) {
      console.log(`Found ${existingCount} existing questions. Clearing...`);
      await Question.deleteMany({});
      console.log("Cleared existing questions.");
    }

    // 5. Insert new questions
    await Question.insertMany(questions);
    console.log(`Successfully migrated ${questions.length} questions!`);

    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrate();
