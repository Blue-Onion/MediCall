import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
export async function setAvailibiltySlots(formData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const doctor = await db.user.findUnique({
      where: {
        clerkUserId: userId,
        role: "DOCTOR",
      },
    });

    if (!doctor) {
      throw new Error("Doctor Not found");
    }

    const startTime = formData.get("startTime");
    const endTime = formData.get("endTime");

    if (!startTime || !endTime) {
      throw new Error("Start and End time are required");
    }

    if (startTime >= endTime) {
      throw new Error("Start Time must be less than End Time");
    }

    const existingSlots = await db.availability.findMany({
      where: {
        doctorId: doctor.id,
      },
      include: {
        appointment: true,
      },
    });

    if (existingSlots?.length > 0) {
      const slotsWithNoAppointment = existingSlots.filter(
        (slot) => !slot.appointment
      );

      if (slotsWithNoAppointment.length > 0) {
        await db.availability.deleteMany({
          where: {
            id: {
              in: slotsWithNoAppointment.map((slot) => slot.id),
            },
          },
        });
      }
    }

    const newSlot = await db.availability.create({
      data: {
        doctorId: doctor.id,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        status: "AVAILABLE",
      },
    });

    revalidatePath("/doctor"); // fixed typo

    return { slot: newSlot, success: true };
  } catch (error) {
    console.error("Error setting availability:", error.message);
    return { success: false, error: error.message };
  }
}

export async function getAvailableSlots() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const doctor = await db.user.findUnique({
      where: {
        clerkUserId: userId,
        role: "DOCTOR",
      },
    });

    if (!doctor) {
      throw new Error("Doctor Not found");
    }

    const availableSlots = await db.availability.findMany({
      where: {
        doctorId: doctor.id,
      },
      orderBy: {
        startTime: "asc",
      },
    });

    return { slots: availableSlots };
  } catch (error) {
    console.error("Error fetching available slots:", error.message);
    return { success: false, error: error.message };
  }
}
