"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  addAppointmentNotes,
  cancelAppointment,
  generateVideoToken,
  markAppointmentComplete,
} from "@/action/appointment";
import useFetch from "@/hooks/useFetch";
import {
  Calendar,

  CheckCircle,
  Clock,
  Edit,
  LoaderPinwheel,
  LoaderPinwheelIcon,
  Stethoscope,
  User,
  Video,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { format } from "date-fns";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Textarea } from "./ui/textarea";

const AppointmentCard = ({ appointment, userRole }) => {
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState(false);
  const [notes, setNotes] = useState(appointment.notes || "");
  const router = useRouter();
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
  const formatTime = (dateStr) => {
    try {
      return format(new Date(dateStr), "h:mm a");
    } catch (e) {
      console.log(e);

      return "Invalid date";
    }
  };
  const formatDateTime = (dateStr) => {
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
  const handleCancel = async () => {
    if (isCancellingAppointment) return;
    if (
      !window.confirm(
        `Are you sure to cancel this appointment ? This action can't undone `
      )
    ) {
      return;
    }
    const data = new FormData();
    data.append("appointmentId", appointment.id);
    await cancelAppointmentFn(data);
  };
  useEffect(() => {
    if (markedCompleteData?.success) {
      toast.success("The appointment is marked as complete");
      setOpen(false);
    }
  }, [markedCompleteData]);
  useEffect(() => {
    if (cancelledAppointmentData?.success) {
      toast.success("The appointment is Cancelled");
      setOpen(false);
    }
  }, [cancelledAppointmentData]);

  const isActiveAppointment = () => {
    const now = new Date();
    const appointmentSTime = appointment.startTime;
    const appointmentETime = appointment.endTime;
    return (
      (appointmentSTime.getTime() - now.getTime() <= 30 * 60 * 1000 &&
        now < appointmentSTime) ||
      (now >= appointmentSTime && now <= appointmentETime)
    );
  };
  const canCancelAppointment = () => {
  const now = new Date();
  const start = new Date(appointment.startTime);

  const diffInMs = start - now; // how far away the appointment is
  const diffInMinutes = diffInMs / (1000 * 60);

  return diffInMinutes > 30;
};

  const handleVideoCall = async () => {
    if (isGeneratingVideoToken) return;
    setAction("video");
    const form = new FormData();
    form.append("appointmentId", appointment.id);
    await generateVideo(form);
  };
  const handleNotesSubmitting = async () => {
    if (isSubmittingNotes) return;
    const form = new FormData();
    form.append("appointmentId", appointment.id);
    form.append("notes", notes);
    await submitNotes(form);
  };
  useEffect(() => {
    if (videoToken?.success) {
      router.push(
        `video-call?sessionId=${videoToken.videoSessionId}&token=${videoToken.token}&$appointmentId=${appointment.id}`
      );
    }
  }, [videoToken]);
  useEffect(() => {
    if (submittedNotesData?.success) {
      toast.success("Notes submitted successfully");
      setAction(null);
    }
  }, [submittedNotesData]);

  return (
    <>
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
                  <Calendar className="text-emerald-400 h-4 w-4" />
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
              <div className="flex gap-2">
                {canMarkComplete() && (
                  <Button
                    size="sm"
                    onClick={handleMarkDone}
                    disabled={isMarkingComplete}
                    className={"bg-emerald-600 hover:bg-emerald-700"}
                  >
                    {isMarkingComplete ? (
                      <>
                        <LoaderPinwheel className="animate-spin mr-2 h-4 w-4" />
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Complete
                      </>
                    )}
                  </Button>
                )}
                <Button
                  variant={"outline"}
                  size={"sm"}
                  className={"border-emerald-900/30"}
                  onClick={() => setOpen(true)}
                >
                  View details
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Appointment dilog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className={"text-xl font-Bold"}>
              Appointment Details
            </DialogTitle>
            <DialogDescription>
              {appointment.status === "SCHEDULED"
                ? "Manage your upcoming appointment"
                : "View appointment information"}
            </DialogDescription>

            <div className="space-y-4 py-4">
              {/* Other Party Information */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">
                  {otherPartyLabel}
                </h4>
                <div className="flex items-center">
                  <div className="h-5 w-5 text-emerald-400 mr-2">
                    {otherPartyIcon}
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {userRole === "DOCTOR"
                        ? otherParty.name
                        : `Dr. ${otherParty.name}`}
                    </p>
                    {userRole === "DOCTOR" && (
                      <p className="text-muted-foreground text-sm">
                        {otherParty.email}
                      </p>
                    )}
                    {userRole === "PATIENT" && (
                      <p className="text-muted-foreground text-sm">
                        {otherParty.specialty}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">
                Scheduled Time
              </h4>
              <div className="flex flex-col gap-1">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-emerald-400 mr-2" />
                  <p className="text-white">
                    {formatDateTime(appointment.startTime)}
                  </p>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-emerald-400 mr-2" />
                  <p className="text-white">
                    {formatTime(appointment.startTime)} -{" "}
                    {formatTime(appointment.endTime)}
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">
                Status
              </h4>
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
            </div>

            {/* Patient Description */}
            {appointment.patientDescription && (
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-muted-foreground">
                  {userRole === "DOCTOR"
                    ? "Patient Description"
                    : "Your Description"}
                </h4>
                <div className="p-3 rounded-md bg-muted/20 border border-emerald-900/20">
                  <p className="text-white whitespace-pre-line">
                    {appointment.patientDescription}
                  </p>
                </div>
              </div>
            )}
            {appointment.status === "SCHEDULED" && (
              <div className="space-y-2">
                <h4 className="text-sm text-muted-foreground font-medium">
                  Video Consultaion
                </h4>
                <Button
                  disabled={
                    !isActiveAppointment() ||
                    action === "video" ||
                    isGeneratingVideoToken
                  }
                  className={"w-full bg-emerald-600 hover:bg-emerald-700"}
                  onClick={handleVideoCall}
                >
                  {isGeneratingVideoToken || action === "video" ? (
                    <>
                      <LoaderPinwheelIcon className="animate-spin h-4 w-4" />
                    </>
                  ) : (
                    <>
                      <Video className="h-4 w-4 mr-2" />
                      {isActiveAppointment()
                        ? "Join Video Call"
                        : "Video call would be available 30 min before the appointment"}
                    </>
                  )}
                </Button>
              </div>
            )}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Doctor Notes
                </h4>
                {userRole === "DOCTOR" &&
                  action !== "notes" &&
                  appointment.status !== "CANCELLED" && (
                    <Button
                      variant={"ghost"}
                      size={"sm"}
                      onClick={() => setAction("notes")}
                      className={
                        "h-7 text-emerald-400 hover:text-emearld-300/20 hover:bg-emerald-700/20 "
                      }
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      {appointment.notes ? "Edit" : "Add"} Notes
                    </Button>
                  )}
              </div>
              {userRole === "DOCTOR" && action === "notes" ? (
                <div className="space-y-3">
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Enter your clinical notes here..."
                    className={
                      "bg-background border-emerald-900/20 min-h-[100px]"
                    }
                  />
                  <div className="flex justify-end gap-2 items-center">
                    <Button
                      type="button"
                      variant={"outline"}
                      size="sm"
                      onClick={() => {
                        setAction(null);
                        setNotes(appointment.notes || "");
                      }}
                      disabled={isSubmittingNotes}
                      className={"border-emerald-900/30"}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleNotesSubmitting}
                      disabled={isSubmittingNotes}
                      className={"bg-emerald-600 hover:bg-emerald-700"}
                    >
                      {isSubmittingNotes ? (
                        <LoaderPinwheel className="animate-spin h-4 w-4" />
                      ) : (
                        "Save notes"
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-md bg-muted/20 border-emerald-900/20 min-h-[80px]">
                  {appointment.notes ? (
                    <p className="text-white whitespace-pre-line">
                      {appointment.notes}
                    </p>
                  ) : (
                    <p className="text-muted-foreground italic">
                      No notes added yet
                    </p>
                  )}
                </div>
              )}
            </div>
          </DialogHeader>
          <DialogFooter
            className={
              "flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2"
            }
          >
            {appointment.status === "SCHEDULED" && (
              <Button
                variant={"destructive"}
                disabled={isCancellingAppointment||!canCancelAppointment()}
                onClick={handleCancel}
              >
                {!canCancelAppointment()?<>
                Appointment Cannot be cancelled now
                </>:
                <>
                {isCancellingAppointment ? (
                  <>
                    <LoaderPinwheelIcon className="animate-spin h-4 w-4 mr-2" />
                    Cancelling...
                  </>
                ) : (
                  <>
                  <X className="h-4 w-4"/>
                  Cancel Appointment
                  </>
                )}
                </>}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AppointmentCard;
