"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Stethoscope, User } from "lucide-react";
const doctorFormSchema = z.object({
  speciality: z.string().min(1, "Speciality is required"),
  experience: z.string().min(1, "Experience is required"),
  credentialUrl: z
    .string()
    .url("Please Enter Valid Url")
    .min(1, "Credential URL is required"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(1000, "Description should not exceed 1000 characters"),
});
const page = () => {
  const [step, SetStep] = useState("choose-role");
  const {
    register,
    formState: { errors },
    watch,
    setValue,
    handleSubmit,
  } = useForm({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: {
      speciality: "",
      experience: undefined,
      credentialUrl: "",
      description: "",
    },
  });
  const specialityValue = watch("speciality");
  if (step === "choose-role") {
    return (
        <div className="grid container grid-cols-1 md:grid-cols-2 mx-auto w-full items-center gap-6">

      <Card className={"border-emerald-900/50 max-w-xl hover:border-emerald-700/40 cursor-pointer transition-all duration-300 ease-in-out"}>
        <CardContent className={"flex flex-col items-center justify-center h-full py-6"}>
            <div className="p-4 rounded-full bg-emerald-900/20 mb-4">
                <User className="w-16 h-16 text-emerald-500" />
            </div>
          <CardTitle className={"text-2xl gradient-title font-bold mb-2"}>Join as a Patient</CardTitle>
          <CardDescription className={"mb-4"}>Book appointments,consult with doctor and manage your healthcare journey</CardDescription>
          <Button className={"w-full cursor-pointer font-bold mt-2 bg-emerald-600 hover:text-white hover:bg-emerald-700"}>
            Continue as a Patient
          </Button>
        </CardContent>
      </Card>
      <Card className={"border-emerald-900/50 max-w-xl hover:border-emerald-700/40 cursor-pointer transition-all duration-300 ease-in-out"}>
        <CardContent className={"flex flex-col items-center justify-center h-full py-6"}>
            <div className="p-4 rounded-full bg-emerald-900/20 mb-4">
                <Stethoscope className="w-16 h-16 text-emerald-500" />
            </div>
          <CardTitle className={"text-2xl gradient-title font-bold mb-2"}>Join as a Doctor</CardTitle>
          <CardDescription className={"mb-4"}>Manage appointments, consult with patients, and grow your medical career.</CardDescription>
          <Button className={"w-full cursor-pointer font-bold mt-2 bg-emerald-600 hover:text-white hover:bg-emerald-700"}>
            Continue as a Doctor
          </Button>
        </CardContent>
      </Card>
      
        </div>
    );
  }
  if (step === "doctor-form") {
    return;
  }
};

export default page;
