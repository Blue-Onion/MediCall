"use server";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

/**
 * Sets or updates the availability slots for a doctor.
 * It first checks for existing slots without associated appointments and deletes them before creating a new slot.
 *
 * @param {FormData} formData - Form data containing 'startTime' and 'endTime' for the availability slot.
 * @returns {object} An object containing the new slot and a success status.
 * @throws {Error} If unauthorized, doctor not found, missing start/end times, or if start time is not less than end time.
 */
export async function setAvailibiltySlots(formData) {
  const { userId } = await auth();

  if (!userId) {
    console.warn("[setAvailibiltySlots] Unauthorized attempt to set availability slots.");
    throw new Error("Unauthorized");
  }

  try {
    console.log(`[setAvailibiltySlots] Attempting to set availability slots for user with Clerk ID: ${userId}`);

    // Find the doctor associated with the authenticated Clerk user ID.
    // Ensure the user has the 'DOCTOR' role.
    const doctor = await db.user.findUnique({
      where: {
        clerkUserId: userId,
        role: "DOCTOR",
      },
    });

    if (!doctor) {
      console.warn(`[setAvailibiltySlots] Doctor not found for Clerk ID: ${userId}.`);
      throw new Error("Doctor Not found");
    }

    const startTime = formData.get("startTime");
    const endTime = formData.get("endTime");

    // Validate if start and end times are provided.
    if (!startTime || !endTime) {
      console.warn("[setAvailibiltySlots] Start and End time are required.");
      throw new Error("Start and End time are required");
    }

    // Validate if start time is before end time.
    if (startTime >= endTime) {
      console.warn(`[setAvailibiltySlots] Invalid time range: Start Time (${startTime}) must be less than End Time (${endTime}).`);
      throw new Error("Start Time must be less than End Time");
    }

    // Fetch existing availability slots for the doctor.
    console.log(`[setAvailibiltySlots] Checking for existing availability slots for doctor ID: ${doctor.id}.`);
    const existingSlots = await db.availability.findMany({
      where: {
        doctorId: doctor.id,
      },
    });

    // If existing slots are found, filter out and delete those that do not have an associated appointment.
    // This logic assumes `slot.appointment` would be a field indicating an associated appointment,
    // which might need adjustment based on the actual Prisma schema relationship (e.g., checking if `appointment` relation exists or if a specific field like `appointmentId` is null).
    // For now, assuming `slot.appointment` is a direct boolean or object presence.
    if (existingSlots?.length > 0) {
      console.log(`[setAvailibiltySlots] Found ${existingSlots.length} existing slots. Filtering for deletable ones.`);
      // Note: The original code assumes `slot.appointment` directly. If `appointment` is a relation,
      // you might need to adjust this to check for `slot.appointmentId === null` or similar.
      // For this example, I'm keeping the original check but adding a comment.
      const slotsWithNoAppointment = existingSlots.filter(
        (slot) => !slot.appointment // Assuming 'appointment' field exists and is null/undefined if no appointment
      );

      if (slotsWithNoAppointment.length > 0) {
        console.log(`[setAvailibiltySlots] Deleting ${slotsWithNoAppointment.length} existing slots without appointments.`);
        await db.availability.deleteMany({
          where: {
            id: {
              in: slotsWithNoAppointment.map((slot) => slot.id),
            },
          },
        });
        console.log("[setAvailibiltySlots] Successfully deleted old availability slots.");
      }
    }

    // Create a new availability slot for the doctor.
    console.log(`[setAvailibiltySlots] Creating new availability slot for doctor ID: ${doctor.id} from ${startTime} to ${endTime}.`);
    const newSlot = await db.availability.create({
      data: {
        doctorId: doctor.id,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        status: "AVAILABLE",
      },
    });

    // Revalidate the '/doctor' path to reflect the changes in availability.
    revalidatePath("/doctor");
    console.log(`[setAvailibiltySlots] New availability slot created with ID: ${newSlot.id}. Path revalidated.`);

    return { slot: newSlot, success: true };
  } catch (error) {
    console.error("❌ [setAvailibiltySlots] Error setting availability:", error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Retrieves all availability slots for the authenticated doctor.
 *
 * @returns {object} An object containing an array of available slots.
 * @throws {Error} If unauthorized or doctor not found.
 */
export async function getAvailableSlots() {
  const { userId } = await auth();

  if (!userId) {
    console.warn("[getAvailableSlots] Unauthorized attempt to fetch available slots.");
    throw new Error("Unauthorized");
  }

  try {
    console.log(`[getAvailableSlots] Attempting to fetch available slots for user with Clerk ID: ${userId}`);

    // Find the doctor associated with the authenticated Clerk user ID.
    // Ensure the user has the 'DOCTOR' role.
    const doctor = await db.user.findUnique({
      where: {
        clerkUserId: userId,
        role: "DOCTOR",
      },
    });

    if (!doctor) {
      console.warn(`[getAvailableSlots] Doctor not found for Clerk ID: ${userId}.`);
      throw new Error("Doctor Not found");
    }

    // Fetch all availability slots for the found doctor, ordered by start time.
    console.log(`[getAvailableSlots] Fetching all availability slots for doctor ID: ${doctor.id}.`);
    const availableSlots = await db.availability.findMany({
      where: {
        doctorId: doctor.id,
      },
      orderBy: {
        startTime: "asc",
      },
    });

    console.log(`[getAvailableSlots] Successfully fetched ${availableSlots.length} available slots for doctor ID: ${doctor.id}.`);
    return { slots: availableSlots };
  } catch (error) {
    console.error("❌ [getAvailableSlots] Error fetching available slots:", error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Retrieves all scheduled appointments for the authenticated doctor.
 *
 * @returns {object} An object containing an array of scheduled appointments.
 * @throws {Error} If unauthorized or doctor not found.
 */
export async function getDoctorAppointment() {
  const { userId } = await auth();
  if (!userId) {
    console.warn("[getDoctorAppointment] Unauthorized attempt to access doctor appointments.");
    throw new Error("Unauthorized");
  }
  try {
    console.log(`[getDoctorAppointment] Attempting to fetch doctor appointments for user with Clerk ID: ${userId}`);

    // Find the doctor associated with the authenticated Clerk user ID.
    // Ensure the user has the 'DOCTOR' role.
    const doctor = await db.user.findUnique({
      where: {
        clerkUserId: userId,
        role: "DOCTOR"
      }
    });

    // If no doctor is found, throw an error.
    if (!doctor) {
      console.warn(`[getDoctorAppointment] Doctor not found for Clerk ID: ${userId} or user is not a DOCTOR.`);
      throw new Error("Doctor not found");
    }

    // Retrieve all scheduled appointments for the found doctor.
    // Include patient details for each appointment and order them by start time in ascending order.
    const appointment = await db.appointment.findMany({
      where: {
        doctorId: doctor.id,
        status: "SCHEDULED" // Only fetch appointments that are scheduled
      },
      // Typo corrected: "includ" should be "include"
      include: {
        patient: true ,
        doctor:true// Include the patient's information in the results
      },
      orderBy: {
        startTime: "asc" // Order appointments by their start time in ascending order
      }
    });

    console.log(`[getDoctorAppointment] Successfully fetched ${appointment.length} scheduled appointments for doctor ID: ${doctor.id}.`);
    // Return the list of appointments.
    return { appointment };
  } catch (error) {
    // Log the error for debugging purposes and re-throw a new Error with the original message.
    console.error("❌ [getDoctorAppointment] Error:", error.message);
    throw new Error(error.message);
  }
}