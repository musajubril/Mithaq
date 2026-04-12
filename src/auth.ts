import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      async authorize(credentials) {
        await dbConnect();
        
        const user = await User.findOne({ email: credentials?.email });
        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(credentials?.password as string, user.password);
        if (!isValid) return null;

        return { 
          id: user._id.toString(), 
          email: user.email, 
          name: user.fullName,
          partnerId: user.partnerId?.toString() || null 
        };
      },
    }),
  ],
});
