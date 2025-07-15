import { getCurrentUser } from "@/action/onboarding";
import { getPateintAppointment } from "@/action/patient";
import PageHeader from "@/components/pageHeader";
import { Calendar } from "lucide-react";
import { redirect } from "next/navigation";
import AppointmentCard from "@/components/AppointmentCard";
const page = async () => {
  const user = await getCurrentUser();
  if (!user || user.role === "DOCTOR") {
    redirect("/onboarding");
  }
  const { appointments, error } = await getPateintAppointment();
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
    <div className="mx-auto container ">
      <PageHeader
        icon={<Calendar />}
        backLabel="Find Doctor"
        backLink="/doctors"
        title="My Appointments"
      />

      {error ? (
        <div className="text-red-400 text-center">{error.message}</div>
      ) : (
        <div>
          {appointments?.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <h3 className="text-xl font-medium text-white mb-2">
                No appointments scheduled
              </h3>
              <p className="text-muted-foreground">
                You don&apos;t have any appointments scheduled yet. Browse our
                doctors and book your first consultation.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  userRole={"PATIENT"}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default page;
