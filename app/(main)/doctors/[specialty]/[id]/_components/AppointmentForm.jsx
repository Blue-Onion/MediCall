"use client";
import { bookAppointment } from "@/action/appointment";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/useFetch";
import { format } from "date-fns";
import { ArrowLeft, Calendar, Clock, CreditCard, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const AppointmentForm = ({ doctorId, slot, onBack, oncomplete }) => {
  const [desc, setDesc] = useState("");
  const { loading, fn: bookingFn, data } = useFetch(bookAppointment);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("doctorId", doctorId);
    data.append("startTime", slot.startTime);
    data.append("endTime", slot.endTime);
    data.append("description", desc);
    await bookingFn(data);
  };
  useEffect(() => {
    if (data) {
      if (data.success) {
        toast.success("Appointment is booked successfully");
        oncomplete();
      }
    }
  }, [data]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-muted/20 p-4 rounded-lg border border-emerald-900/20 space-y-3">
        <div className="flex items-center">
          <Calendar className="h-5 w-5 text-emerald-400 mr-2" />
          <span className="text-white font-medium">
            {format(new Date(slot.startTime), "EEEE, MMMM d, yyyy")}
          </span>
        </div>
        <div className="flex items-center">
          <Clock className="h-5 w-5 text-emerald-400 mr-2" />
          <span className="text-white">{slot.formatted}</span>
        </div>
        <div className="flex items-center">
          <CreditCard className="h-5 w-5 text-emerald-400 mr-2" />
          <span className="text-muted-foreground">
            Cost: <span className="text-white font-medium">2 credits</span>
          </span>
        </div>
        <div className="space-y-2">
          <Label htmlFor="desc">Describe your medical concern(optional)</Label>
          <Textarea
            id="desc"
            placeholder="Please provide any details about your medical concern or what you'd like to discuss in the appointment..."
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="border-emerald-900/20 h-32"
          />
          <p className="text-muted-foreground text-sm ">
            This information would be shared to your doctor
          </p>
        </div>
        <div className="flex items-center justify-between pt-2">
          <Button
            type="button"
            variant={"destructive"}
            onClick={onBack}
            disabled={loading}
            className={"border-emerald-900/30"}
          >
            <ArrowLeft className="h-4 w-4" />
            Change time slot
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Booking...
              </>
            ) : (
              "Confirm Booking"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default AppointmentForm;
