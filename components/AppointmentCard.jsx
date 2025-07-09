"use client";

import {
  addAppointmentNotes,
  cancelAppointment,
  generateVideoToken,
  markAppointmentComplete,
} from "@/action/appointment";
import useFetch from "@/hooks/useFetch";
import { Check, CheckCircle, Clock, LoaderPinwheel, Stethoscope, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { format, formatDate } from "date-fns";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { toast } from "sonner";

const AppointmentCard = ({ appointment, userRole }) => {
  console.log(appointment);
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState(false);
  const [notes, setNotes] = useState(appointment.notes || "");

  const {
    loading: isSubmittingNotes,
    fn: submitNotes,
    data: submittedNotesData,
  } = useFetch(addAppointmentNotes);

  const {
    loading: isGeneratingVideoToken,
    fn: generateVideo,
    data: videoToken,
  } = useFetch(generateVideoToken);

  const {
    loading: isCancellingAppointment,
    fn: cancelAppointmentFn,
    data: cancelledAppointmentData,
  } = useFetch(cancelAppointment);

  const {
    loading: isMarkingComplete,
    fn: markAppointmentCompleteFn,
    data: markedCompleteData,
  } = useFetch(markAppointmentComplete);
  const otherParty =
    userRole === "DOCTOR" ? appointment.patient : appointment.doctor;
  const otherPartyIcon = userRole === "DOCTOR" ? <User /> : <Stethoscope />;
  const otherPartyLabel = userRole === "DOCTOR" ? "Patient" : "Doctor";
  const formatDateTime = (dateStr) => {
    try {
      return format(new Date(dateStr), "h:mm a");
    } catch (e) {
      console.log(e);

      return "Invalid date";
    }
  };
  const formatTime = (dateStr) => {
    try {
      return format(new Date(dateStr), "MMMM d,yyyy 'at' h:mm a");
    } catch (e) {
      console.log(e);

      return "Invalid date";
    }
  };
  const canMarkComplete = () => {
    if (userRole !== "DOCTOR" || appointment.status !== "SCHEDULED") {
      return false;
    }
    const now = new Date();
    const appointmentDate = new Date(appointment.endTime);
    return now >= appointmentDate;
  };
  const handleMarkDone = async () => {
    if (isMarkingComplete) return;
    if (
      !window.confirm(
        `Are you sure to mark this appointment as complete? This action can't undone `
      )
    ) {
      return;
    }
    const data = new FormData();
    data.append("appointmentId", appointment.id);
    await markAppointmentCompleteFn(data);
  };
  useEffect(() => {
    if (markedCompleteData && markedCompleteData.success) {
      toast.success("The appointment is marked as complete");
      setOpen(false);
    }
  }, [markedCompleteData]);

  return (
    <Card
      className={
        "border-emerald-900/20 hover:border-emerald-700/30 transition-all duration-300 ease-out"
      }
    >
      <CardContent className={"p-4"}>
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex gap-3 items-center">
            <div className="rounded-full bg-muted/20 p-2 font-bold text-emerald-400">
              {otherPartyIcon}
            </div>
            <div className="">
              <h3 className="font-semibold">
                {userRole === "DOCTOR" ? (
                  <>{otherParty.name}</>
                ) : (
                  <>Dr.{otherParty.name}</>
                )}
              </h3>
              <p className="text-muted-foreground text-sm">
                {userRole === "DOCTOR"
                  ? otherParty.email
                  : otherParty.specialty}
              </p>
              <div className="flex gap-2 items-center mt-2 text-sm text-muted-foreground">
                <Clock className="text-emerald-400 h-4 w-4" />
                <span className="">
                  {formatDateTime(appointment.startTime)}
                </span>
              </div>
              <div className="flex gap-2 items-center mt-2 text-sm text-muted-foreground">
                <Clock className="text-emerald-400 h-4 w-4" />
                <span className="">
                  {formatTime(appointment.startTime)} -{" "}
                  {formatTime(appointment.endTime)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 self-end md:self-start">
            <Badge
              variant="outline"
              className={
                appointment.status === "COMPLETED"
                  ? "bg-emerald-900/20 border-emerald-900/30 text-emerald-400"
                  : appointment.status === "CANCELLED"
                  ? "bg-red-900/20 border-red-900/30 text-red-400"
                  : "bg-amber-900/20 border-amber-900/30 text-amber-400"
              }
            >
              {appointment.status}
            </Badge>
            {canMarkComplete() && (
              <Button
                size="sm"
                onClick={handleMarkDone}
                disabled={isMarkingComplete}
                className={"bg-emerald-600 hover:bg-emerald-700"}
              >
                {isMarkingComplete?<>
                <LoaderPinwheel className="animate-spin mr-2 h-4 w-4"/>
             
                </>:
                <>
                <CheckCircle className="mr-2 h-4 w-4"/>
                Complete
                </>
                }
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentCard;
