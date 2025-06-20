"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

import { revalidatePath } from "next/cache";

export async function setUserRole(formData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const role = formData.get("role"); 

  if (!role || !["DOCTOR", "PATIENT"].includes(role)) {
    throw new Error("Invalid role");
  }

  try {
    if (role === "PATIENT") {
      await db.user.update({
        where: {
          id: user.id,
          clerkUserId: userId,
        },
        data: {
          role: "PATIENT",
        },
      });
      revalidatePath("/");
      return { success: true, redirect: "/doctors" };
    }

    if (role === "DOCTOR") {
      const specialty = formData.get("specialty");
      const experience = parseInt(formData.get("experience"), 10);
      const credentialUrl = formData.get("credentialUrl"); 
      const description = formData.get("description");

      if (!specialty || !experience || !credentialUrl || !description) {
        throw new Error("All fields are required for doctor role");
      }

      await db.user.update({
        where: {
          clerkUserId: userId,
        },
        data: {
          role: "DOCTOR",
          specialty,
          experience,
          credentialUrl, 
          description,
          verificationStatus: "PENDING",
        },
      });

      revalidatePath("/");
      return { success: true, redirect: "/doctor/verification" };
    }
  } catch (error) {
    console.log(error.message);
    throw new Error("Failed to set user role");
  }
}
export async function getCurrentUser(formData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  
  try {
      const user = await db.user.findUnique({
        where: {
          clerkUserId: userId,
        },
      });

    return user;
  } catch (error) {
    console.log("Error fetching user:", error);
return null;
  }
}
