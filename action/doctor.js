import { auth } from "@clerk/nextjs/server";

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
      throw new Error("Start Time must be less than End time");
    }
    const existingSlots = await db.availability.findUnique({
      wehre: {
        doctorId: userId,
      },
    });
    if(existingSlots?.length>0){
        
    }
  } catch (error) {
    console.log(error.message);
  }
}
