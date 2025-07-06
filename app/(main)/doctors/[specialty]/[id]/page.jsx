import { getAvailableTimeSlot, getDoctorById } from "@/action/appointment";

import { redirect } from "next/navigation";
import React from "react";
import DoctorProfile from "./_components/DoctorProfile";

const page = async ({ params }) => {
  const id = params.id;

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
    // redirect("/doctors");
  }
};

export default page;
