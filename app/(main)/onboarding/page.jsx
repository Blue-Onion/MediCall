"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader, Stethoscope, User } from "lucide-react";
import useFetch from "@/hooks/useFetch";
import { setUserRole } from "@/action/onboarding";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Label } from "@/components/ui/label";
import { SPECIALTIES } from "@/lib/specialty";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
const doctorFormSchema = z.object({
  specialty: z.string().min(1, "Specialty is required"),
  experience: z.number().min(1, "Experience is required"),
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
  const router = useRouter();
  const { data, fn: submitUserRole, error, loading } = useFetch(setUserRole);
  const {
    register,
    formState: { errors },
    watch,
    setValue,
    handleSubmit,
  } = useForm({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: {
      specialty: "",
      experience: undefined,
      credentialUrl: "",
      description: "",
    },
  });
  const handlePatientSelection = async () => {
    if (loading) return;
    const formData = new FormData();
    formData.append("role", "PATIENT");
    await submitUserRole(formData);
  };
  const onDoctorSubmit = async (data) => {
  if (loading) return;

  const formData = new FormData();
  formData.append("role", "DOCTOR");
  formData.append("specialty", data.specialty);
  formData.append("experience", data.experience.toString());
  formData.append("credentialUrl", data.credentialUrl);
  formData.append("description", data.description);

  for (const [key, value] of formData.entries()) {
    console.log(key, value);
  }

  await submitUserRole(formData);
};

  useEffect(() => {
    if (data && data?.success) {
      toast.success("Role set successfully");

      router.push(data?.redirect || "/doctors");
    }
  }, [data]);
  const specialtyValue = watch("specialty");
  // SetStep("doctor-form");
  if (step === "choose-role") {
    return (
      <div className="grid container grid-cols-1 md:grid-cols-2 mx-auto w-full items-center gap-6">
        <Card
          className={
            "border-emerald-900/50 max-w-xl hover:border-emerald-700/40 cursor-pointer transition-all duration-300 ease-in-out"
          }
        >
          <CardContent
            className={"flex flex-col items-center justify-center h-full py-6"}
          >
            <div className="p-4 rounded-full bg-emerald-900/20 mb-4">
              <User className="w-16 h-16 text-emerald-500" />
            </div>
            <CardTitle className={"text-2xl gradient-title font-bold mb-2"}>
              Join as a Patient
            </CardTitle>
            <CardDescription className={"mb-4"}>
              Book appointments,consult with doctor and manage your healthcare
              journey
            </CardDescription>
            <Button
              className={
                "w-full cursor-pointer font-bold mt-2 bg-emerald-600 hover:text-white hover:bg-emerald-700"
              }
              disabled={loading}
              onClick={() => !loading && handlePatientSelection()}
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  <span className="ml-2">Processing...</span>
                </>
              ) : (
                "Continue as a Patient"
              )}
            </Button>
          </CardContent>
        </Card>
        <Card
          className={
            "border-emerald-900/50 max-w-xl hover:border-emerald-700/40 cursor-pointer transition-all duration-300 ease-in-out"
          }
        >
          <CardContent
            className={"flex flex-col items-center justify-center h-full py-6"}
          >
            <div className="p-4 rounded-full bg-emerald-900/20 mb-4">
              <Stethoscope className="w-16 h-16 text-emerald-500" />
            </div>
            <CardTitle className={"text-2xl gradient-title font-bold mb-2"}>
              Join as a Doctor
            </CardTitle>
            <CardDescription className={"mb-4"}>
              Manage appointments, consult with patients, and grow your medical
              career.
            </CardDescription>
            <Button
              onClick={() => SetStep("doctor-form")}
              className={
                "w-full cursor-pointer font-bold mt-2 bg-emerald-600 hover:text-white hover:bg-emerald-700"
              }
            >
              Continue as a Doctor
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  if (step === "doctor-form") {
    return (
      <div className="">
        <Card className={"border-emerald-900/50"}>
          <CardContent className={"pt-6"}>
            <div className="mb-6">
              <CardTitle className={"text-4xl gradient-title font-bold mb-2"}>
                Complete your Doctor Profile
              </CardTitle>
              <CardDescription className={"mb-4"}>
                Please provide the following details to complete your profile
              </CardDescription>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit(onDoctorSubmit)}>
              <div className="space-y-2">
                <div className="">
                  <Label className={"space-y-2 p-2"} htmlFor="specialty">
                    Medical Specialty
                  </Label>
                  <Select
                    onValueChange={(value) => setValue("specialty", value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose a specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      {SPECIALTIES.map((specialty, index) => (
                        <SelectItem
                          key={index}
                          className={"flex gap-2 items-center "}
                          value={specialty.name}
                        >
                          <span className="text-emerald-300 font-bold">
                            {specialty.icon}
                          </span>
                          <div className="font-bold">{specialty.name}</div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {errors.specialty && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.specialty.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <div className="">
                  <Label className={"space-y-2 p-2"} htmlFor="experince">
                    Years of Experience
                  </Label>
                  <Input
                    placeholder="eg. 5"
                    type={"number"}
                    id="experience"
                    {...register("experience", { valueAsNumber: true })}
                  />
                </div>
                {errors.experience && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.experience.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <div className="">
                  <Label className={"space-y-2 p-2"} htmlFor="credentialUrl">
                    Link to your Credential
                  </Label>
                  <Input
                    placeholder="https://example.com/medical-degree_url.pdf"
                    type={"url"}
                    id="credentialUrl"
                    {...register("credentialUrl")}
                  />
                </div>
                {errors.credentialUrl && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.credentialUrl.message}
                  </p>
                )}
                <p className="text-muted-foreground text-sm font-bold">
                  Please provide a link to your medical degree or relevant
                  credentials. This will help us verify your qualifications.
                </p>
              </div>
              <div className="space-y-2">
                <div className="">
                  <Label className={"space-y-2 p-2"} htmlFor="description">
                    Description of your Services
                  </Label>
                  <Textarea
                    placeholder="Write a brief description about your medical practice, areas of expertise, and any other relevant information."
                    rows={"4"}
                    id="description"
                    {...register("description")}
                  />
                </div>
                {errors.description && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>
              <div className="flex justify-between items-center mt-6">
                <Button variant="destructive" className={"cursor-pointer"} onClick={()=>SetStep("choose-role")} disabled={loading} type="button">
                  Back
                </Button>
                <Button
               type="submit"
                  className={
                    "cursor-pointer font-bold bg-emerald-600 hover:text-white hover:bg-emerald-700"
                  }
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      <span className="ml-2">Processing...</span>
                    </>
                  ) : (
                    "Submit for verification"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }
};

export default page;
