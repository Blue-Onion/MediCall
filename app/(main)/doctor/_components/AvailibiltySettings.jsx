"use client";

import { setAvailibiltySlots } from "@/action/doctor";
import useFetch from "@/hooks/useFetch";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, Clock, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const AvailibilitySettings = ({ slots }) => {
  const [showForm, setShowForm] = useState(false);
  const { fn: submitSlots, loading, data } = useFetch(setAvailibiltySlots);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      startTime: "",
      endTime: "",
    },
  });

  const createLocalTime = (timeStr) => {
    const [hour, min] = timeStr.split(":").map(Number);
    console.log(hour);
    console.log(min);
    console.log(timeStr);

    const now = new Date();
    const updatedDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hour,
      min
    );

    return updatedDate;
  };

  const onSubmit = async (formInput) => {
    if (loading) return;

    const startTime = createLocalTime(formInput?.startTime);
    const endTime = createLocalTime(formInput?.endTime);
    console.log(startTime);
    console.log(endTime);

    if (startTime > endTime) {
      toast.error("Start time can't be later than end time.");
      return;
    }

    const formData = new FormData();
    formData.append("startTime", startTime.toISOString());
    formData.append("endTime", endTime.toISOString());

    await submitSlots(formData);
  };

  useEffect(() => {
    if (data?.success) {
      setShowForm(false);
      toast.success("Availability slots have been updated successfully.");
    }
  }, [data]);

  return (
    <Card className={"border-emerald-900/20"}>
      <CardHeader>
        <CardTitle
          className={"text-2xl flex items-center gap-3 font-bold text-white"}
        >
          <Clock className="h-6 w-6 text-emerald-400" />
          Availability Settings
        </CardTitle>
        <CardDescription>
          Set your daily availability for patient appointments.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {!showForm ? (
          <>
            <div className="mb-6">
              <h3 className="text-lg font-medium text-white mb-3">
                Current Availiblty
              </h3>
              {slots.length === 0 ? (
                <p className="text-muted-foreground">
                  You haven&apos;t set any availability slots. Add your
                  availability to start accepting appointments
                </p>
              ) : (
                <>
                  <div className="">
                    {slots.map((slot) => {
                      return (
                        <div
                          key={slot.id}
                          className="flex items-center p-3 rounded-md bg-muted/20 border border-emerald-900/20"
                        >
                          <div className="bg-emerald-900/20 p-2 rounded-full mr-3">
                            <Clock className="h-4 w-4 text-emerald-400 " />
                          </div>
                          <p>
                            {new Date(slot.startTime).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })}{" "}
                            -{" "}
                            {new Date(slot.endTime).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
            <Button
              className="w-full font-bold bg-emerald-600 flex items-center hover:bg-emerald-700"
              onClick={() => setShowForm(true)}
            >
              <Plus className="h-4 mr-2 w-4" />
              Set your Availability
            </Button>
          </>
        ) : (
          <>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 border border-emerald-900/20 rounded-lg p-4"
            >
              <h3 className="font-semibold text-xl">Set your Availability</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    type="time"
                    id="startTime"
                    {...register("startTime", {
                      required: "Start Time is required",
                    })}
                    className="bg-background border-emerald-900/20"
                  />
                  {errors.startTime && (
                    <p className="text-red-500">{errors.startTime.message}</p>
                  )}
                </div>

                <div className="space-y-4">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    {...register("startTime", {
                      required: "Start time is required",
                    })}
                    className="bg-background border-emerald-900/20"
                  />
                  {errors.endTime && (
                    <p className="text-red-500">{errors.endTime.message}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3">
                <Button
                  disabled={loading}
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="border-emerald-900/30 font-bold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-emerald-600 font-bold hover:bg-emerald-700"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Save Availability"
                  )}
                </Button>
              </div>
            </form>

            <div className="mt-6 p-4 bg-muted/10 border border-emerald-900/10 rounded-md">
              <h4 className="font-medium text-white mb-2 flex items-center">
                <AlertCircle className="h-4 w-4 mr-2 text-emerald-400" />
                How Availability Works
              </h4>
              <p className="text-muted-foreground text-sm">
                Setting your daily availability allows patients to book
                appointments during those hours. The same availability applies
                to all days. You can update your availability at any time, but
                existing booked appointments will not be affected.
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AvailibilitySettings;
