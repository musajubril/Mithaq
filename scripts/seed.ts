import mongoose from "mongoose";
import Question from "../src/models/Question.js";
import dbConnect from "../src/lib/mongodb.js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const questions = [
  { text: "What is your favorite memory together?", category: "Core Memories", order: 1 },
  { text: "What are your top three non-negotiables in a relationship?", category: "Values", order: 2 },
  { text: "How do you prefer to receive love?", category: "Communication", order: 3 },
  // Add more questions here...
];

async function seed() {
  try {
    await dbConnect();
    console.log("Connected to MongoDB for seeding...");

    await Question.deleteMany({});
    console.log("Cleared existing questions.");

    await Question.insertMany(questions);
    console.log(`Seeded ${questions.length} questions successfully!`);

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();
