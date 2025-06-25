"use client";
import { updateDoctorActiveStatus } from "@/action/admin";
import useFetch from "@/hooks/useFetch";
import React, { useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User } from "lucide-react";
const PendingDoctors = ({ doctor }) => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const {
    loading,
    fn: submitUpdateStatus,
    errors,
  } = useFetch(updateDoctorActiveStatus);

  return (
    <div>
      <Card className={"border-emerald-950/20 "}>
        <CardHeader>
          <CardTitle className={"text-2xl font-bold gradient-title"}>
            Pending Doctor Verification
          </CardTitle>
          <CardDescription>
            Review and approve doctor application
          </CardDescription>
        </CardHeader>
        <CardContent>
          {doctor.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No Pending Verification request at this time
            </div>
          ) : (
            <div className="space-y-4">
              {doctor.map((doc, index) => {
                return (
                  <Card
                    key={doctor.id}
                    className={
                      "border-emerald-900/20 bg-muted/60 hover:border-emerald-800/40 transition-all duration-300 "
                    }
                  >
                    <CardContent className={"p-4"}>
                      <div className="">
                        <div className="bg-muted/20 rounded-full p-2">
                          <User className="text-emerald-400 h-5 w-5" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PendingDoctors;
