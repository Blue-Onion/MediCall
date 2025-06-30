"use server";

import { db } from "@/lib/prisma";

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
    const doctor = await db.user.findUniuqe({
      where: { id: id, role: "DOCTOR", verifiactionStatus: "VERIFEID" },
    });
    if (!doctor) {
      throw new Error("Doctor not found");
    }
    const availiblty = await db.availiblty.findFirst({
      where: {
        doctorId: id,
        status: "AVAILABLE",
      },
    });
    if(!availiblty){
        throw new Error("No availblty is set by the doctor")
    }
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch doctor data");
  }
}
