"use client";
import { getDcotorBySpecialty } from "@/action/doctor-listing";
import PageHeader from "@/components/pageHeader";
import { redirect, useParams } from "next/navigation";
import React from "react";

const page = async () => {
  const { specialty } = useParams();
  if (!specialty) {
    redirect("/doctors");
  }
  const { doctors, error } = await getDcotorBySpecialty(specialty);
  if (error) {
    console.log("Failed to fetch");
  }
  return (
    <div className="space-y-5">
      <PageHeader
        title={specialty.split("%20").join(" ")}
        backLink="/doctors"
        backLabel="All Specialties"
      />
      {doctors && doctors.length > 0 ? (
        <div className=""></div>
      ) : (
        <div className="text-center py-12">
          <h3 className="font-medium text-xl text-white ">
            No doctors available
          </h3>
          <p className="text-muted-foreground">
            There are currently no verified doctor in this specialty. Please come back later or choose another specialty
          </p>
        </div>
      )}
    </div>
  );
};

export default page;
