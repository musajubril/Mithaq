import mongoose, { Schema, Document } from "mongoose";

export interface IQuestion extends Document {
  text: string;
  category: string;
  order: number;
  categoryOrder: number;
  type: 'text' | 'scale' | 'binary';
  options?: string[]; // For binary or multi-choice
}

const QuestionSchema: Schema = new Schema({
  text: { type: String, required: true },
  category: { type: String, required: true },
  order: { type: Number, required: true },
  categoryOrder: { type: Number, required: true },
  type: { type: String, enum: ['text', 'scale', 'binary'], default: 'text' },
  options: { type: [String] },
}, { timestamps: true });

export default (mongoose.models && mongoose.models.Question) || mongoose.model<IQuestion>("Question", QuestionSchema);
