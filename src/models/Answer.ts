import mongoose, { Schema, Document } from "mongoose";

export interface IAnswer extends Document {
  userId: string; // Changed to string to match production schema
  questionId: mongoose.Types.ObjectId;
  partnershipId: string;
  category: string;
  questionIndex: number;
  question: string; // Storing question text as requested
  answer: string | number; // Changed from responseValue
}

const AnswerSchema: Schema = new Schema({
  userId: { type: String, required: true },
  questionId: { type: Schema.Types.ObjectId, ref: "Question", required: true },
  partnershipId: { type: String, required: true },
  category: { type: String, required: true },
  questionIndex: { type: Number, required: true },
  question: { type: String, required: true },
  answer: { type: Schema.Types.Mixed, required: true }, // Mixed to support string or number
}, { timestamps: true });

export default (mongoose.models && mongoose.models.Answer) || mongoose.model<IAnswer>("Answer", AnswerSchema);
