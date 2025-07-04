import { db } from "@/lib/prisma";

export async function getDcotorBySpecialty(specialty) {
  
    
    try {
        const doctors=await db.User.findMany({
            where:{
                role:"DOCTOR",
                verificationStatus:"VERIFIED",
                specialty:specialty.split("%20").join(" ")
            },
            orderBy:{
                name:"asc"
            }
        })
        return {doctors}
    } catch (error) {
        console.log(error);
        return {error:"Failed to fetch"}
        
    }
}