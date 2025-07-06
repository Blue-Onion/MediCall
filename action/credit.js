"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { format } from "date-fns";
import { revalidatePath } from "next/cache";
const planCredits = {
  free_user: 2,
  standard: 10,
  premium: 24,
};
const costAppointment = 2;
export async function checkAndAllocateCredits(user) {
  try {
    if (!user) {
      return null;
    }
    if (user.role !== "PATIENT") {
      return user;
    }


    const { has } = await auth();
    const hasBasic = has({ plan: "free_User" });
    const hasStandard = has({ plan: "standard" });
    const hasPremium = has({ plan: "premium" });

    let currentPlan = null;
    let creditsToAllocate = 0;
    if (hasPremium) {
      currentPlan = "premium";
      creditsToAllocate = planCredits.premium;
    }
    if (hasBasic) {
      currentPlan = "free_user";
      creditsToAllocate = planCredits.free_user;
    }
    if (hasStandard) {
      currentPlan = "standard";
      creditsToAllocate = planCredits.standard;
    }
    if (!currentPlan) {
      return user;
    }
    const currentDate = format(new Date(), "yyyy-MM");
    if (user.transactions && user.transactions.length > 0) {
      const lastTransaction = user.transactions[0];
      const transactionMonth = format(lastTransaction.createdAt, "yyyy-MM");
      const transactionPlan = lastTransaction.packageId;
      // Check if the last transaction was in the current month
      if (transactionMonth === currentDate && transactionPlan === currentPlan) {

        return user;
      }
    }
    const updatedUser = await db.$transaction(async (tx) => {
      await tx.creditTransaction.create({
        data: {
          userId: user.id,
          amount: creditsToAllocate,
          type: "CREDIT_PURCHASE",
          packageId: currentPlan,
        },
      });
      await tx.User.update({
        where: {
          id: user.id,
        },
        data: {
          credits: {

            increment: creditsToAllocate,

          },
        },
      });

    });
    revalidatePath("/doctor")
    revalidatePath("/appointments")
    return updatedUser;
  } catch (error) {
    console.log("Error checking and allocating credits:", error);
  }
}
export async function deductCreditsForAppointment(doctorId, userId) {
  try {
    const user = await db.user.findUnique({
      where: {
        id: userId,

      }
    })
    if (!user) {
      throw new Error("User not found")
    }
    if (user.credits < costAppointment) {
      throw new Error("Insuffceint credits to book appointment")
    }
    const doctor = await db.user.findUnique({
      where: {
        id: doctorId,
        role: "DOCTOR",
        verificationStatus: "VERIFIED"
      }
    })
    if (!doctor) {
      throw new Error("Doctor not found")
    }
    const res = await db.$transaction(async (tx) => {
      const updatedUser = await tx.creditTransaction.create({
        data: {
          userId: userId,
          amount: -costAppointment,
          type: "APPOINTMENT_DEDUCTION",

        }
      })
      await tx.creditTransaction.create({
        data: {
          userId: doctorId,
          amount: costAppointment,
          type: "APPOINTMENT_DEDUCTION",

        }
      })
      await tx.user.update({
        where: {
          id: doctorId,
        },
        data: {
          credits: {
            increment: costAppointment
          }
        }
      })
      await tx.user.update({
        where: {
          id: userId,
        },
        data: {
          credits: {
            decrement: costAppointment
          }
        }
      })
      return updatedUser

    })
    return {success:true,res:user}
  } catch (error) {
console.log(error);

  }
}