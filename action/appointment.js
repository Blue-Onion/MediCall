"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { addDays, addMinutes, endOfDay, format, isBefore } from "date-fns";
import { deductCreditsForAppointment } from "./credit";
import { revalidatePath } from "next/cache";
import { Auth } from "@vonage/auth";
import { Vonage } from "@vonage/server-sdk";

// Initialize Vonage credentials and SDK
const credentials = new Auth({
  applicationId: process.env.NEXT_PUBLIC_VONAGE_APPLICATION_ID,
  privateKey: process.env.VONAGE_PRIVATE_KEY,
});

const vonage = new Vonage(credentials, {});

/**
 * Retrieves a doctor's information by their ID.
 * Throws an error if the doctor is not found, not a DOCTOR role, or not verified.
 *
 * @param {string} id - The ID of the doctor to retrieve.
 * @returns {object} An object containing the doctor's data.
 * @throws {Error} If the doctor is not found, not a DOCTOR, not verified, or if fetching fails.
 */
export async function getDoctorById(id) {
  try {
    console.log(`[getDoctorById] Attempting to fetch doctor with ID: ${id}`);
    const doctor = await db.user.findUnique({ where: { id } });

    if (!doctor || doctor.role !== "DOCTOR" || doctor.verificationStatus !== "VERIFIED") {
      console.warn(`[getDoctorById] Doctor with ID ${id} not found, not a DOCTOR, or not verified.`);
      throw new Error("Doctor not found or not verified");
    }

    console.log(`[getDoctorById] Successfully fetched doctor with ID: ${id}`);
    return { doctor };
  } catch (error) {
    console.error("❌ [getDoctorById] Error:", error.message);
    throw new Error("Failed to fetch doctor data");
  }
}

/**
 * Retrieves available time slots for a specific doctor.
 * It considers the doctor's general availability and existing scheduled appointments.
 *
 * @param {string} id - The ID of the doctor.
 * @returns {object} An object containing an array of available days with their slots.
 * @throws {Error} If the doctor is not found, not a DOCTOR, not verified, or if fetching fails.
 */
export async function getAvailableTimeSlot(id) {
  try {
    console.log(`[getAvailableTimeSlot] Attempting to fetch available time slots for doctor with ID: ${id}`);
    const doctor = await db.user.findUnique({ where: { id } });

    if (!doctor || doctor.role !== "DOCTOR" || doctor.verificationStatus !== "VERIFIED") {
      console.warn(`[getAvailableTimeSlot] Doctor with ID ${id} not found, not a DOCTOR, or not verified.`);
      throw new Error("Doctor not found or not verified");
    }

    const availability = await db.availability.findFirst({
      where: { doctorId: id, status: "AVAILABLE" },
    });

    if (!availability) {
      console.log(`[getAvailableTimeSlot] No availability found for doctor with ID: ${id}. Returning empty array.`);
      return [];
    }

    const now = new Date();
    // Get the next 4 days including today
    const days = [now, addDays(now, 1), addDays(now, 2), addDays(now, 3)];
    const lastDay = endOfDay(days[3]); // End of the 4th day

    // Fetch existing scheduled appointments for the doctor within the next 4 days
    const existingAppointments = await db.appointment.findMany({
      where: {
        doctorId: doctor.id,
        status: "SCHEDULED",
        startTime: { lte: lastDay },
      },
    });
    console.log(`[getAvailableTimeSlot] Found ${existingAppointments.length} existing appointments for doctor ID: ${id}.`);

    const availableSlots = {};

    // Iterate through each of the next 4 days to find available slots
    for (const day of days) {
      const dayStr = format(day, "yyyy-MM-dd");
      availableSlots[dayStr] = [];

      // Set the start and end times for the current day based on doctor's availability
      const start = new Date(availability.startTime);
      const end = new Date(availability.endTime);
      start.setFullYear(day.getFullYear(), day.getMonth(), day.getDate());
      end.setFullYear(day.getFullYear(), day.getMonth(), day.getDate());

      let curr = new Date(start);

      // Generate 30-minute time slots and check for overlaps
      while (isBefore(curr, end)) {
        const next = addMinutes(curr, 30);

        // Skip slots that are in the past
        if (isBefore(next, now)) {
          curr = next;
          continue;
        }

        // Check if the current slot overlaps with any existing appointments
        const overlaps = existingAppointments.some((appointment) => {
          const aStart = new Date(appointment.startTime);
          const aEnd = new Date(appointment.endTime);
          return (
            (curr >= aStart && curr < aEnd) ||
            (next > aStart && next <= aEnd) ||
            (curr <= aStart && next >= aEnd)
          );
        });

        // If no overlap, add the slot to available slots
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

    // Format the results into an array of days with their slots
    const result = Object.entries(availableSlots).map(([date, slots]) => ({
      date,
      displayDate: slots.length > 0
        ? slots[0].day
        : format(new Date(date), "EEEE, MMMM d"),
      slots,
    }));

    console.log(`[getAvailableTimeSlot] Successfully generated available slots for doctor ID: ${id}.`);
    return { days: result };
  } catch (error) {
    console.error("❌ [getAvailableTimeSlot] Error:", error.message);
    throw new Error("Failed to fetch doctor data");
  }
}

/**
 * Books an appointment for a patient with a doctor.
 * Deducts credits from the patient and creates a video session.
 * Performs various validations before booking.
 *
 * @param {FormData} formData - Form data containing doctorId, startTime, endTime, and optional description.
 * @returns {object} An object indicating success and the created appointment.
 * @throws {Error} If unauthorized, patient/doctor not found, insufficient credits, missing data, slot already booked, or booking fails.
 */
export async function bookAppointment(formData) {
  const { userId } = await auth(); // Get the authenticated user's Clerk ID
  if (!userId) {
    console.warn("[bookAppointment] Unauthorized attempt to book appointment.");
    throw new Error("Unauthorized");
  }

  try {
    console.log(`[bookAppointment] Attempting to book appointment for user with Clerk ID: ${userId}`);
    const patient = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!patient) {
      console.warn(`[bookAppointment] Patient not found for Clerk ID: ${userId}`);
      throw new Error("Patient not found");
    }

    if (patient.credits < 2) { // Assuming 2 credits per appointment
      console.warn(`[bookAppointment] Insufficient credits for patient ID: ${patient.id}. Credits: ${patient.credits}`);
      throw new Error("Insufficient credits to book appointment");
    }

    const doctorId = formData.get("doctorId");
    const startTime = formData.get("startTime");
    const endTime = formData.get("endTime");
    const patientDescription = formData.get("description") || null;

    if (!doctorId || !startTime || !endTime) {
      console.warn("[bookAppointment] Missing required fields: doctorId, startTime, or endTime.");
      throw new Error("Doctor, start time, and end time are required");
    }

    const doctor = await db.user.findUnique({
      where: {
        id: doctorId,
        role: "DOCTOR",
        verificationStatus: "VERIFIED",
      },
    });

    if (!doctor) {
      console.warn(`[bookAppointment] Doctor with ID ${doctorId} not found or not verified.`);
      throw new Error("Doctor not found or not verified");
    }
    if (doctor.clerkUserId === userId) {
      console.warn(`[bookAppointment] User with Clerk ID ${userId} attempted to book an appointment with themselves (doctor ID: ${doctorId}).`);
      throw new Error("You can't book an appointment for yourself");
    }

    // Check for overlapping appointments to prevent double booking
    const overlappingAppointments = await db.appointment.findFirst({
      where: {
        doctorId,
        status: "SCHEDULED",
        OR: [
          {
            startTime: { lte: startTime },
            endTime: { gt: startTime },
          },
          {
            startTime: { lt: endTime },
            endTime: { gt: endTime },
          },
          {
            startTime: { gte: startTime },
            endTime: { lte: endTime },
          },
        ],
      },
    });

    if (overlappingAppointments) {
      console.warn(`[bookAppointment] Slot for doctor ID ${doctorId} at ${startTime} - ${endTime} is already booked.`);
      throw new Error("Slot is already booked");
    }

    console.log("[bookAppointment] Creating video session...");
    const sessionId = await createVideoSession();
    console.log(`[bookAppointment] Video session created with ID: ${sessionId}`);

    // Use a Prisma transaction for atomicity (deduct credits and create appointment)
    const result = await db.$transaction(async (tx) => {
      console.log(`[bookAppointment] Initiating credit deduction for patient ID: ${patient.id}, doctor ID: ${doctor.id}`);
      const { success, error } = await deductCreditsForAppointment(
        doctor.id,
        patient.id
      );

      if (!success) {
        console.error(`[bookAppointment] Failed to deduct credits: ${error}`);
        throw new Error(error || "Failed to deduct the credits");
      }
      console.log(`[bookAppointment] Credits successfully deducted for patient ID: ${patient.id}.`);

      const appointment = await tx.appointment.create({
        data: {
          patientId: patient.id,
          doctorId: doctor.id,
          startTime,
          endTime,
          patientDescription,
          status: "SCHEDULED",
          videoSessionId: sessionId,
        },
      });
      console.log(`[bookAppointment] Appointment created with ID: ${appointment.id}`);
      return { appointment };
    });

    // Revalidate the appointments path to reflect the new booking
    revalidatePath("/appointments");
    console.log(`[bookAppointment] Appointment successfully booked for patient ID: ${patient.id}, doctor ID: ${doctorId}.`);
    return { result: result.appointment, success: true };
  } catch (error) {
    console.error("❌ [bookAppointment] Error:", error.message);
    throw new Error(error.message);
  }
}

/**
 * Creates a Vonage video session.
 * @returns {string} The session ID of the newly created video session.
 * @throws {Error} If the video session creation fails.
 */
async function createVideoSession() {
  try {
    console.log("[createVideoSession] Attempting to create a new Vonage video session.");
    const session = await vonage.video.createSession({ mediaMode: "routed" });
    console.log(`[createVideoSession] Successfully created Vonage video session with ID: ${session.sessionId}`);
    return session.sessionId;
  } catch (error) {
    console.error("❌ [createVideoSession] Error:", error.message);
    throw new Error("Failed to create video session: " + error.message);
  }
}

/**
 * Cancels an existing appointment.
 * Only the patient or doctor involved in the appointment can cancel it.
 * Refunds credits to the patient and deducts from the doctor.
 *
 * @param {FormData} form - Form data containing the appointmentId.
 * @returns {object} An object indicating success.
 * @throws {Error} If unauthorized, user/appointment not found, or cancellation rules are violated.
 */
export async function cancelAppointment(form) {
  const { userId } = await auth();
  if (!userId) {
    console.warn("[cancelAppointment] Unauthorized attempt to cancel appointment.");
    throw new Error("Unauthorized");
  }
  try {
    console.log(`[cancelAppointment] Attempting to cancel appointment for user with Clerk ID: ${userId}`);
    const user = await db.user.findUnique({ // Use await here
      where: {
        clerkUserId: userId
      }
    });
    if (!user) {
      console.warn(`[cancelAppointment] User not found for Clerk ID: ${userId}.`);
      throw new Error("User not found");
    }
    const appointmentId = form.get("appointmentId");
    if (!appointmentId) {
      console.warn("[cancelAppointment] Appointment ID is required for cancellation.");
      throw new Error("AppointmentId is required");
    }
    const appointment = await db.appointment.findUnique({ // Use await here
      where: {
        id: appointmentId
      },
      include: {
        patient: true,
        doctor: true
      }
    });
    if (!appointment) {
      console.warn(`[cancelAppointment] Appointment with ID ${appointmentId} not found.`);
      throw new Error("Appointment not found");
    }
    // Ensure only the patient or doctor associated with the appointment can cancel it
    if (appointment.doctorId !== user.id && appointment.patientId !== user.id) {
      console.warn(`[cancelAppointment] User ID ${user.id} is not allowed to cancel appointment ID ${appointmentId}.`);
      throw new Error("You are not allowed to cancel this appointment");
    }

    console.log(`[cancelAppointment] Initiating transaction to cancel appointment ID: ${appointmentId}`);
    await db.$transaction(async (tx) => {
      // Update appointment status to CANCELLED
      await tx.appointment.update({
        where: {
          id: appointmentId
        },
        data: {
          status: "CANCELLED"
        }
      });
      console.log(`[cancelAppointment] Appointment ID ${appointmentId} status updated to CANCELLED.`);

      // Create credit transaction for refunding patient
      await tx.creditTransaction.create({
        data: {
          userId: appointment.patientId,
          type: "APPOINTMENT_REFUND", // Changed type for clarity
          amount: 2,
        }
      });
      console.log(`[cancelAppointment] Credit transaction created for patient ID ${appointment.patientId} (refund).`);

      // Create credit transaction for deducting from doctor (if applicable, e.g., for lost revenue)
      await tx.creditTransaction.create({
        data: {
          userId: appointment.doctorId,
          type: "APPOINTMENT_CHARGEBACK", // Changed type for clarity
          amount: -2,
        }
      });
      console.log(`[cancelAppointment] Credit transaction created for doctor ID ${appointment.doctorId} (chargeback).`);

      // Update patient's credits
      await tx.user.update({
        where: {
          id: appointment.patientId,
        },
        data: {
          credits: {
            increment: 2,
          }
        }
      });
      console.log(`[cancelAppointment] Patient ID ${appointment.patientId} credits incremented.`);

      // Update doctor's credits
      await tx.user.update({
        where: {
          id: appointment.doctorId,
        },
        data: {
          credits: {
            decrement: 2,
          }
        }
      });
      console.log(`[cancelAppointment] Doctor ID ${appointment.doctorId} credits decremented.`);
    });

    // Revalidate paths based on user role
    if (user.role === "DOCTOR") {
      revalidatePath("/doctor");
      console.log("[cancelAppointment] Revalidating /doctor path.");
    }
    if (user.role === "PATIENT") {
      revalidatePath("/appointments");
      console.log("[cancelAppointment] Revalidating /appointments path.");
    }
    console.log(`[cancelAppointment] Appointment ID ${appointmentId} successfully cancelled.`);
    return { success: true };
  } catch (error) {
    console.error("❌ [cancelAppointment] Error:", error.message);
    throw new Error(error.message);
  }
}

/**
 * Adds notes to an existing appointment.
 * Only the doctor associated with the appointment can add notes.
 *
 * @param {FormData} form - Form data containing appointmentId and notes.
 * @returns {object} An object indicating success and the updated appointment.
 * @throws {Error} If unauthorized, doctor/appointment not found, or update fails.
 */
export async function addAppointmentNotes(form) {
  const { userId } = await auth();
  if (!userId) {
    console.warn("[addAppointmentNotes] Unauthorized attempt to add appointment notes.");
    throw new Error("Unauthorized");
  }
  try {
    console.log(`[addAppointmentNotes] Attempting to add notes for user with Clerk ID: ${userId}`);
    const doctor = await db.user.findUnique({
      where: {
        clerkUserId: userId,
        role: "DOCTOR"
      }
    });
    if (!doctor) {
      console.warn(`[addAppointmentNotes] Doctor not found for Clerk ID: ${userId} or user is not a DOCTOR.`);
      throw new Error("Doctor not found");
    }
    const appointmentId = form.get("appointmentId");
    const notes = form.get("notes");

    if (!appointmentId || notes === null) { // Check for null to allow empty notes
      console.warn("[addAppointmentNotes] Appointment ID or notes are missing.");
      throw new Error("Appointment ID and notes are required");
    }

    const appointment = await db.appointment.findUnique({
      where: {
        id: appointmentId,
        doctorId: doctor.id // Ensure only the doctor can add notes to their appointments
      }
    });
    if (!appointment) {
      console.warn(`[addAppointmentNotes] Appointment with ID ${appointmentId} not found or does not belong to doctor ID ${doctor.id}.`);
      throw new Error("Appointment not found");
    }
    console.log(`[addAppointmentNotes] Updating notes for appointment ID: ${appointmentId}`);
    const updateAppointment = await db.appointment.update({
      where: {
        id: appointmentId
      },
      data: {
        notes,
      }
    });
    revalidatePath("/doctor");
    console.log(`[addAppointmentNotes] Notes successfully added/updated for appointment ID: ${appointmentId}.`);
    return { success: true, appointment: updateAppointment };
  } catch (error) {
    console.error("❌ [addAppointmentNotes] Error:", error.message);
    throw new Error(error.message);
  }
}

/**
 * Marks an appointment as complete.
 * Only the doctor associated with the appointment can mark it complete.
 * An appointment can only be marked complete if its status is "SCHEDULED" and the current time is past the appointment's end time.
 *
 * @param {FormData} form - Form data containing the appointmentId.
 * @returns {object} An object indicating success and the updated appointment.
 * @throws {Error} If unauthorized, doctor/appointment not found, status is not SCHEDULED, or end time not passed.
 */
export async function markAppointmentComplete(form) {
  const { userId } = await auth();
  if (!userId) {
    console.warn("[markAppointmentComplete] Unauthorized attempt to mark appointment complete.");
    throw new Error("Unauthorized");
  }
  try {
    console.log(`[markAppointmentComplete] Attempting to mark appointment complete for user with Clerk ID: ${userId}`);
    const doctor = await db.user.findUnique({
      where: {
        clerkUserId: userId,
        role: "DOCTOR"
      }
    });
    if (!doctor) {
      console.warn(`[markAppointmentComplete] Doctor not found for Clerk ID: ${userId} or user is not a DOCTOR.`);
      throw new Error("Doctor not found");
    }
    const appointmentId = form.get("appointmentId");
    if (!appointmentId) {
      console.warn("[markAppointmentComplete] Appointment ID is required.");
      throw new Error("AppointmentId is required");
    }

    const appointment = await db.appointment.findUnique({
      where: {
        id: appointmentId,
        doctorId: doctor.id // Ensure only the doctor can mark their appointments complete
      }
    });
    if (!appointment) {
      console.warn(`[markAppointmentComplete] Appointment with ID ${appointmentId} not found or does not belong to doctor ID ${doctor.id}.`);
      throw new Error("Appointment not found");
    }
    if (appointment.status !== "SCHEDULED") {
      console.warn(`[markAppointmentComplete] Appointment ID ${appointmentId} is not in SCHEDULED status. Current status: ${appointment.status}.`);
      throw new Error("You can only set scheduled appointment as complete");
    }
    const now = new Date();
    const endTime = new Date(appointment.endTime);
    if (now < endTime) {
      console.warn(`[markAppointmentComplete] Current time is before the end time of appointment ID ${appointmentId}. Cannot mark as complete.`);
      throw new Error("Appointment cannot be set as complete before its end time");
    }
    console.log(`[markAppointmentComplete] Marking appointment ID ${appointmentId} as COMPLETED.`);
    const updateAppointment = await db.appointment.update({
      where: {
        id: appointmentId
      },
      data: {
        status: "COMPLETED"
      }
    });
    revalidatePath("/doctor");
    console.log(`[markAppointmentComplete] Appointment ID ${appointmentId} successfully marked as COMPLETED.`);
    return { success: true, appointment: updateAppointment };
  } catch (error) {
    console.error("❌ [markAppointmentComplete] Error:", error.message);
    throw new Error(error.message);
  }
}

/**
 * Generates a Vonage video token for a specific appointment.
 * Allows the patient or doctor involved in the appointment to join the call.
 * Checks for authorization, appointment status, and time constraints.
 *
 * @param {FormData} form - Form data containing the appointmentId.
 * @returns {object} An object indicating success, videoSessionId, and the generated token.
 * @throws {Error} If unauthorized, user/appointment not found, not allowed to join, or call is not yet available.
 */
export async function generateVideoToken(form) {
  const { userId } = await auth();
  if (!userId) {
    console.warn("[generateVideoToken] Unauthorized attempt to generate video token.");
    throw new Error("Unauthorized");
  }
  try {
    console.log(`[generateVideoToken] Attempting to generate video token for user with Clerk ID: ${userId}`);
    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId
      }
    });
    if (!user) {
      console.warn(`[generateVideoToken] User not found for Clerk ID: ${userId}.`);
      throw new Error("User not found");
    }
    const appointmentId = form.get("appointmentId");
    if (!appointmentId) {
      console.warn("[generateVideoToken] Appointment ID is required for video token generation.");
      throw new Error("AppointmentId is required");
    }
    const appointment = await db.appointment.findUnique({ // Use await here
      where: {
        id: appointmentId
      },
      include: {
        patient: true,
        doctor: true
      }
    });
    if (!appointment) {
      console.warn(`[generateVideoToken] Appointment with ID ${appointmentId} not found.`);
      throw new Error("Appointment not found");
    }
    // Check if the user is either the patient or the doctor for this appointment
    if (appointment.doctorId !== user.id && appointment.patientId !== user.id) {
      console.warn(`[generateVideoToken] User ID ${user.id} is not allowed to join call for appointment ID ${appointmentId}.`);
      throw new Error("You are not allowed to join this call");
    }
    if (appointment.status !== "SCHEDULED") {
      console.warn(`[generateVideoToken] Appointment ID ${appointmentId} is not in SCHEDULED status. Current status: ${appointment.status}.`);
      throw new Error("The call is not available for unscheduled appointments.");
    }
    const now = new Date();
    const start = new Date(appointment.startTime);
    // Calculate time difference in minutes
    const tDiffer = (start.getTime() - now.getTime()) / (1000 * 60);

    // Allow joining 30 minutes before the start time
    if (tDiffer > 30) {
      console.warn(`[generateVideoToken] Call for appointment ID ${appointmentId} is not yet available. Available 30 min before start time.`);
      throw new Error("Call will be available 30 min before start time");
    }

    const appointmentEndTime = new Date(appointment.endTime);
    // Token expires 1 hour after the appointment end time
    const expirationTime = Math.floor(appointmentEndTime.getTime() / 1000) + (60 * 60);
    const connectionData = JSON.stringify(
      {
        name: user.name,
        role: user.role,
        userId: user.id
      }
    );
    console.log(`[generateVideoToken] Generating client token for session ID: ${appointment.videoSessionId}`);
    const token = vonage.video.generateClientToken(appointment.videoSessionId,
      {
        role: "publisher", // User will be a publisher (can send audio/video)
        expireTime: expirationTime,
        data: connectionData
      });

    // Update appointment with the generated token (though typically tokens are generated on demand, not stored)
    // The previous implementation was setting videoSessionId to the token, which is incorrect.
    // It should be used to provide the token to the client, not to update the session ID.
    // Reverted the update here as it was likely a misunderstanding.
    // If the intention was to store the *last generated token*, that's a different use case.
    // For general token generation, the videoSessionId remains constant for the session.

    console.log(`[generateVideoToken] Video token successfully generated for appointment ID: ${appointmentId}.`);
    return {
      success: true,
      videoSessionId: appointment.videoSessionId,
      token: token
    };
  } catch (error) {
    console.error("❌ [generateVideoToken] Error:", error.message);
    throw new Error(error.message);
  }
}