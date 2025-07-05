import { getDoctorById } from "@/action/appointment";
import { getAvailableSlots } from "@/action/doctor";
import { redirect } from "next/navigation";
import React from "react";
import DoctorProfile from "./_components/DoctorProfile";

const page = async ({ params }) => {
  const id = params.id;

  try {
    const [doctorData, slotData] = await Promise.all([
      getDoctorById(id),
      getAvailableSlots(id),
    ]);

    console.log("heheh", doctorData);
    console.log("hheehheehhhe", slotData);

    return (
      <div>
        <DoctorProfile
          doctor={doctorData.doctor}
          availableDays={slotData?.slots || []}
        />
      </div>
    );
  } catch (error) {
    console.log(error);
    // redirect("/doctors");
  }
};

export default page;
