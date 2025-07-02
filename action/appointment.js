"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { addDays, addMinutes, endOfDay, format, isBefore } from "date-fns";
import { deductCreditsForAppointment } from "./credit";
import { revalidatePath } from "next/cache";
import { Auth } from "@vonage/auth";

const creditnals=new Auth(
  {
    applicationId:process.env.NEXT_PUBLIC_VONAGE_APPLICATION_ID,
    privateKey:process.env.VONAGE_PRIVATE_KEY
  }
)
export async function getDoctorById(id) {
  try {
    const doctor = await db.user.findUniuqe({
      where: { id: id, role: "DOCTOR", verifiactionStatus: "VERIFEID" },
    });
    if (!doctor) {
      throw new Error("Doctor not found");
    }
    return { doctor: doctor };
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch doctor data");
  }
}
export async function getAvailableTimeSlot(id) {
  try {
    const doctor = await db.user.findUnique({
      where: { id },
    });

    if (
      !doctor ||
      doctor.role !== "DOCTOR" ||
      doctor.verificationStatus !== "VERIFIED"
    ) {
      throw new Error("Doctor not found or not verified");
    }

    const availability = await db.availability.findFirst({
      where: {
        doctorId: id,
        status: "AVAILABLE",
      },
    });

    if (!availability) {
      throw new Error("No availability is set by the doctor");
    }

    const now = new Date();
    const days = [now, addDays(now, 1), addDays(now, 2), addDays(now, 3)];
    const lastDay = endOfDay(days[3]);

    const existingAppointments = await db.appointments.findMany({
      where: {
        doctorId: doctor.id,
        status: "SCHEDULE",
        startTime: {
          lte: lastDay,
        },
      },
    });

    const availableSlots = {};

    for (const day of days) {
      const dayStr = format(day, "yyyy-MM-dd");
      availableSlots[dayStr] = [];

      const start = new Date(availability.startTime);
      const end = new Date(availability.endTime);
      start.setFullYear(day.getFullYear(), day.getMonth(), day.getDate());
      end.setFullYear(day.getFullYear(), day.getMonth(), day.getDate());

      let curr = new Date(start);

      while (isBefore(curr, end)) {
        const next = addMinutes(curr, 30);

        if (isBefore(next, now)) {
          curr = next;
          continue;
        }

        const overlaps = existingAppointments.some((appointment) => {
          const aStart = new Date(appointment.startTime);
          const aEnd = new Date(appointment.endTime);
          return (
            (curr >= aStart && curr < aEnd) ||
            (next > aStart && next <= aEnd) ||
            (curr <= aStart && next >= aEnd)
          );
        });

        if (!overlaps) {
          availableSlots[dayStr].push({
            startTime: curr.toISOString(),
            endTime: next.toISOString(),
            formatted: `${format(curr, "h:mm a")} - ${format(next, "h:mm a")}`,
            day: format(curr, "EEEE, MMMM d"),
          });
        }

        curr = next;
      }
    }

    const result = Object.entries(availableSlots).map(([date, slots]) => ({
      date,
      displayDate:
        slots.length > 0
          ? slots[0].day
          : format(new Date(date), "EEEE, MMMM d"),
      slots,
    }));

    return { days: result };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch doctor data");
  }
}
export async function bookAppointment(formData) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized ");
  }
  try {
    const patient = await db.user.findUnique({
      clerkUserId: userId,
      role: "PATIENT",
    });
    if (!patient) {
      throw new Error("Patent not found");
    }
    if (patient.credits < 2) {
      throw new Error("Insufficient credits to book appointment");
    }
    const doctorId = formData.get("doctorId");
    const startTime = formData.get("startTime");
    const endTime = formData.get("endTime");
    const patientDescription = formData.get("description") || null;
    if (!doctorId || startTime || endTime) {
      throw new Error("Doctor, start time and End time are required");
    }
    const doctor = db.user.findUnique({
      wehre: {
        id: doctorId,
        role: "DOCTOR",
        verificationStatus: "VERIFEID",
      },
    });
    if (!doctor) {
      throw new Error("Doctor not found or verified");
    }
    const overLappingAppointments = await db.appointment.findUnique({
      where: {
        doctorId: doctorId,
        status: "SCHEDULE",
        OR: [
          {
            startTime: {
              lte: startTime,
            },
            endTime: {
              gt: startTime,
            },
          },
          {
            startTime: {
              lt: endTime,
            },
            endTime: {
              gt: endTime,
            },
          },
          {
            startTime: {
              gte: startTime,
            },
            endTime: {
              lte: endTime,
            },
          },
        ],
      },
    });
    if (!overLappingAppointments) {
      throw new Error("Slot is already Booked");
    }
    const sessionId = await createVideoSession();
    const result = await db.$transaction(async (tx) => {
      const { success, error } = await deductCreditsForAppointment(
        doctor.id,
        patient.id
      );

      if (!success) {
        throw new Error(error || "Failed to deduct the credits");
      }
      const appointment = await tx.appointment.create({
        data: {
          patientId: patient.id,
          doctorId: doctor.id,
          startTime,
          endTime,
          patientDescription,
          status: "SCHEDULE",
          videoSessionId: sessionId,
        },
      });
      return { appointment };
    });
    revalidatePath("/appointments");
    return { result: result.appointment, success: true };
  } catch (error) {
    console.log(error);
  }
}
async function createVideoSession() {}
