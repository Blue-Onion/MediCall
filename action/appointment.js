"use server";

import { db } from "@/lib/prisma";
import { addDays, addMinutes, endOfDay, format, isBefore } from "date-fns";

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
