"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function verifyAdmin() {
  const { userId } = await auth();
  if (!userId) {
    return false;
  }
  try {
    const user = await db.user.findUnique({
      where: {
        clerkUsrID: userId,
      },
    });
    return user?.role === "ADMIN";
  } catch (error) {
    console.log(error);
  }
}
export async function getPendingDoctor() {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) throw new Error("Unauthorized");
  try {
    const pendingDoctor = await db.user.findMany({
      where: {
        role:"DOCTOR",
        verificationStatus: "PENDING",
      },
      orderBy:{
        createdAt:"desc"
      }
    });
    return {doctor:pendingDoctor}
  } catch (error) {
    console.log(error.message);
    
  }
}
export async function getVerifiedDoctor() {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) throw new Error("Unauthorized");
  try {
    const verifiedDoctor = await db.user.findMany({
      where: {
        role:"DOCTOR",
        verificationStatus: "VERIFIED",
      },
      orderBy:{
        createdAt:"asc"
      }
    });
    return {doctor:verifiedDoctor}
  } catch (error) {
    console.log(error.message);
    
  }
}
export async function updateDoctorStatus(form) {
    const isAdmin=await verifyAdmin();
    if(!isAdmin) throw new Error("Unauthorizied");
    const doctorId=form.get("doctorId")
    const status=form.get("status")
    if(!doctorId||!["VERIFIED","REJECTED"].includes(status)){
        throw new Error("Invalid input");
    }
    try {
        await db.user.update({
            where:
            {

                id:doctorId
            },
            data:{
                verificationStatus:status
            }
        })
        revalidatePath("/admin");
        return {success:true}
    } catch (error) {
        
    }

}
export async function updateDoctorActiveStatus(form) {
    const isAdmin=await verifyAdmin();
    if(!isAdmin) throw new Error("Unauthorizied");
    const doctorId=form.get("doctorId")
    const suspend=form.get("suspend")==="true"
  
    try {
        const status=suspend?"PENDING":"VERIFIED"
        await db.user.update({
            where:
            {

                id:doctorId
            },
            data:{
                verificationStatus:status
            }
        })
        revalidatePath("/admin");
        return {success:true}
    } catch (error) {
        
    }

}