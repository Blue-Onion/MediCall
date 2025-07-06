"use client";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock,
  FileText,
  Medal,
  User,
} from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
const DoctorProfile = ({ doctor, availableDays }) => {
  const [showBooking, setShowBooking] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const handleSelectSlot = (slot) => {
    selectedSlot(slot);
  };
  const totalSlots = availableDays.reduce(
    (total, day) => total + day.slots?.length,
    0
  );
  const toggleButton = () => {
    setShowBooking(!showBooking);
    if (!showBooking) {
      setTimeout(() => {
        document.getElementById("booking-section")?.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);
    }
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <div className="md:sticky md:top-24">
          <Card className={"border-emerald-900/20"}>
            <CardContent className={"pt-6"}>
              <div className="flex items-center flex-col text-center">
                <div className="relative w-32 h-32 rounded-full overflow-hidden bg-emerald-900/20 mb-4">
                  {doctor.imageUrl ? (
                    <>
                      <Image
                        src={doctor.imageUrl}
                        alt={doctor.name}
                        fill
                        className="object-cover"
                      />
                    </>
                  ) : (
                    <>
                      <div className="flex h-full w-full justify-center items-center">
                        <User className="h-16 w-16 text-emerald-400" />
                      </div>
                    </>
                  )}
                </div>
                <h2 className="text-xl text-white font-bold mb-1">
                  {doctor.name}
                </h2>
                <Badge
                  variant={"outline"}
                  className={
                    "bg-emerald-900/20 border-emerald-900/20 text-emerald-400 mb-4"
                  }
                >
                  {doctor.specialty}
                </Badge>
                <div className="flex justify-center items-center mb-2">
                  <Medal className="h-4 w-4 text-emerald-400 mr-2" />
                  <span className="text-muted-foreground">
                    {doctor.experience} years of experince
                  </span>
                </div>
                <Button
                  onClick={toggleButton}
                  className={
                    "bg-emerald-600 hover:bg-emerald-700 w-full text-white mb-4"
                  }
                >
                  {showBooking ? (
                    <>
                      Hide Booking <ChevronUp className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Book appointment
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="md:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className={"text-xl font-bold text-white"}>
              {doctor.name}
            </CardTitle>
            <CardDescription>{doctor.specialty}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2 items-center">
                <FileText className="h-5 w-5 text-emerald-400" />
                <h3 className="text-white font-semibold">Description</h3>
              </div>
              <p className="text-muted-foreground whitespace-pre-line">
                {doctor.description}
              </p>
            </div>
            <Separator className={"bg-emerald-900/20"} />
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-emerald-400" />
                <h3 className="font-semibold text-white">Availability</h3>
              </div>
            </div>
            <div className="space-y-4">
              {totalSlots > 0 ? (
                <div className="flex items-center ">
                  <Calendar className="h-5 w-5 mr-2" />
                  <p className="text-muted-foreground">
                    {totalSlots} time slots are available for booking.
                  </p>
                </div>
              ) : (
                <Alert className="flex items-center ">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <AlertDescription className="text-muted-foreground">
                    No available slots for next 4 days. Check again later
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
          {showBooking && (
            <div id="booking-section" className="p-2 space-y-6">
              <Card className="border-emerald-900/20">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-white">
                    Book an Appointment
                  </CardTitle>
                  <CardDescription>
                    Select a time slot and provide details for your consultation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {totalSlots ? (
                    <></>
                  ) : (
                    <div className="text-center py-6">
                      <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                      <h3 className="text-xl font-medium text-white mb-2">
                        No available slots
                      </h3>
                      <p className="text-muted-foreground">
                        This doctor doesn&apos;t have any available appointment
                        slots for the next 4 days. Please check back later or
                        try another doctor.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default DoctorProfile;
