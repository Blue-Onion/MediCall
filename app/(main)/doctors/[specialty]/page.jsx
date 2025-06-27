import { getDcotorBySpecialty } from "@/action/doctor-listing";
import DoctorCard from "@/components/DoctorCard";
import PageHeader from "@/components/pageHeader";
import { redirect } from "next/navigation";
import React from "react";

const Page = async ({ params }) => {
  const specialty = params?.specialty;

  if (!specialty) {
    redirect("/doctors");
  }

  const { doctors, error } = await getDcotorBySpecialty(specialty);

  if (error) {
    console.error("Failed to fetch doctors:", error);
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title={specialty.split("%20").join(" ")}
        backLink="/doctors"
        backLabel="All Specialties"
      />
      {doctors && doctors.length > 0 ? (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          {doctors.map((doctor) => {
            return <DoctorCard key={doctor.id} doctor={doctor}/>
          }
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="font-medium text-xl text-white">
            No doctors available
          </h3>
          <p className="text-muted-foreground">
            There are currently no verified doctors in this specialty. Please come back later or choose another specialty.
          </p>
        </div>
      )}
    </div>
  );
};

export default Page;
