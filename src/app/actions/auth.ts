"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { signIn, signOut } from "@/auth";
import crypto from "crypto";
import { AuthError } from "next-auth";

const SignUpSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function signUp(formData: FormData) {
  const values = Object.fromEntries(formData.entries());
  const validatedFields = SignUpSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: validatedFields.error.issues[0].message };
  }

  const { fullName, email, password } = validatedFields.data;
  
  try {
    await dbConnect();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { error: "User already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const partnershipId = crypto.randomBytes(3).toString("hex").toUpperCase();

    await User.create({
      fullName,
      email,
      password: hashedPassword,
      partnershipId,
    });

    return { success: true };
  } catch (error) {
    console.error("Sign up error:", error);
    return { error: "Something went wrong" };
  }
}

export async function login(formData: FormData) {
  const values = Object.fromEntries(formData.entries());
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: validatedFields.error.issues[0].message };
  }

  const { email, password } = validatedFields.data;

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false, // Handle redirect manually to catch errors better
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      console.error("Auth Error:", error.type, error.message);
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password" };
        default:
          return { error: error.message || "Something went wrong during authentication" };
      }
    }
    console.error("Login Error:", error);
    return { error: error instanceof Error ? error.message : "An unexpected error occurred" };
  }
}

export async function resetPassword(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    await dbConnect();
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );

    if (!user) {
      return { error: "User not found" };
    }

    return { success: true };
  } catch (error) {
    console.error("Reset password error:", error);
    return { error: "Something went wrong" };
  }
}
export async function logout() {
  await signOut({ redirectTo: "/login" });
}
