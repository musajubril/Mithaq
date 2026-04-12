import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password?: string;
  fullName?: string; // Corrected from name
  partnershipId: string; // Corrected from connectionCode
  partnerName?: string;
  partnerEmail?: string;
  role?: string;
  partnerId?: string; // Treating as string based on provided example
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String },
  fullName: { type: String },
  partnershipId: { type: String, unique: true, required: true },
  partnerName: { type: String },
  partnerEmail: { type: String },
  role: { type: String },
  partnerId: { type: String, ref: "User" }, // Storing as string with ref to User
}, { timestamps: true });

export default (mongoose.models && mongoose.models.User) || mongoose.model<IUser>("User", UserSchema);
