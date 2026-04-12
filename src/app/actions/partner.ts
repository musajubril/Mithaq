"use server";

import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function linkPartner(prevState: any, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const partnerCode = formData.get("partnerCode") as string;
  if (!partnerCode) return { error: "Partner code is required" };

  try {
    await dbConnect();

    const partner = await User.findOne({ partnershipId: partnerCode.toUpperCase() });
    if (!partner) return { error: "Partner not found" };

    if (partner._id.toString() === session.user.id) {
      return { error: "You cannot link with yourself" };
    }

    // Link both users
    await User.findByIdAndUpdate(session.user.id, { partnerId: partner._id });
    await User.findByIdAndUpdate(partner._id, { partnerId: session.user.id });

    revalidatePath("/dashboard");
    return { 
      success: true, 
      partnerId: partner._id.toString(), 
      partnerName: partner.fullName 
    };
  } catch (error) {
    console.error("Partner sync error:", error);
    return { error: "Something went wrong" };
  }
}
