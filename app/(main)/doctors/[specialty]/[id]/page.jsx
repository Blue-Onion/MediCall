import { getAvailableTimeSlot, getDoctorById } from "@/action/appointment";

import { redirect } from "next/navigation";
import React from "react";
import DoctorProfile from "./_components/DoctorProfile";
import { getCurrentUser } from "@/action/onboarding";

const page = async ({ params }) => {
  const id = params.id;
const user=getCurrentUser()
if(user?.role!=="PATIENT"){
  redirect("/onboarding");
}
  try {
    const [doctorData, slotData] = await Promise.all([
      getDoctorById(id),
      getAvailableTimeSlot(id),
    ]);

    return (
      <div>
        <DoctorProfile
          doctor={doctorData.doctor}
          availableDays={slotData?.days || []}
        />
      </div>
    );
  } catch (error) {
    console.log(error);
    redirect("/doctors");
  }
};

export default page;
