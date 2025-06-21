import { getCurrentUser } from "@/action/onboarding";
import { redirect } from "next/navigation"; // ✅ use this
import React from "react";

export const metadata = {
  title: "Onboarding -Medimeet",
  description: "Complete your onboarding process",
};

const layout = async ({ children }) => {
  const user = await getCurrentUser();

  if (user) {
    if (user.role === "PATIENT") {
      redirect("/doctors"); // ✅ directly call redirect()
    } else if (user.role === "DOCTOR") {
      if (user.verificationStatus === "PENDING") {
        redirect("/doctor/verification");
      }
      redirect("/doctor");
    } else if (user.role === "ADMIN") {
      redirect("/admin");
    }
  }

  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        <div className="">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h1 className="text-5xl md:text-6xl font-bold text-center mb-4 gradient-title">
                Welcome to the Onboarding Process
            </h1>
            <p className="text-muted-foreground text-lg font-semibold">Tell us how do you want to use our platform </p>
            </div>
        </div>
             {children}
      </div>
    </div>
  );
};

export default layout;
