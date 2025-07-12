import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import AppointmentCard from "@/components/AppointmentCard";
const DoctorAppointmentCard = ({ appointments }) => {
 const sortAppointments = (appointments) => {
  const statusOrder = {
    "SCHEDULED": 0,
    "COMPLETED": 1,
    "CANCELLED": 2,
  };

  return appointments.sort((a, b) => {
    // Compare status first
    const statusDiff = statusOrder[a.status] - statusOrder[b.status];
    if (statusDiff !== 0) return statusDiff;

    // If same status, sort by startTime
    return new Date(a.startTime) - new Date(b.startTime);
  });
};

 const sortedAppointments= sortAppointments(appointments);

  return (
    <Card className={"border-emerald-900/20"}>
      <CardHeader>
        <CardTitle
          className={"text-2xl flex items-center gap-3 font-bold text-white"}
        >
          <Calendar className="h-5 w-5 mr-2 text-emerald-400" />
          Upcoming Appointments
        </CardTitle>
      </CardHeader>
      <CardContent>
        {appointments.length > 0 ? (
          <div className="space-y-4">
            {sortedAppointments.map((appointment) => {
              return (
                <AppointmentCard
                  appointment={appointment}
                  userRole="DOCTOR"
                  key={appointment.id}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <h3 className="text-xl font-medium text-white mb-3">
              No Upcoming Appointment
            </h3>
            <p className="text-muted-foreground">
              You don&apos;t have any scheduled apppointment booked yet. Make
              sure you&apos;ve set your availability to allow pateint to book
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DoctorAppointmentCard;
