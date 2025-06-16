import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }
  try {
    const loggedInUser = await db.User.findUnique({
      where: {
        clerkUserId: user.id,
      },
    });

    
    if (loggedInUser) {
      return loggedInUser;
    }
  
    
    const newUser = await db.User.create({
      data: {
        clerkUserId: user.id,
        email: user.emailAddresses[0].emailAddress,
        name: user.fullName || `${user.firstName}+${user.lastName}` || "New User",
        imageUrl: user.imageUrl || "https://via.placeholder.com/150",
        transactions:{
            create:{
                type:"CREDIT_PURCHASE",
                packageId:"free_user",
                amount:2
            }
        }
      },
    });
    return newUser
  } catch (error) {
    console.log("Error checking user:", error);
    return null;
  }
};
