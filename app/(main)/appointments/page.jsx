import { getCurrentUser } from "@/action/onboarding";
import { getPateintAppointment } from "@/action/patient";
import PageHeader from "@/components/pageHeader";
import { Calendar } from "lucide-react";
import { redirect } from "next/navigation";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AppointmentCard from "@/components/AppointmentCard";
const page = async () => {
  const user = await getCurrentUser();
  if (!user || user.role === "DOCTOR") {
    redirect("/onboarding");
  }
  const { appointments, error } = await getPateintAppointment();

  return (
    <div className="mx-auto container ">
      <PageHeader
        icon={<Calendar />}
        backLabel="Find Doctor"
        backLink="/doctors"
        title="My Appointments"
      />
      <Card className="border-emerald-900/20">
        <CardContent className={"pt-4"}>
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
                    You don&apos;t have any appointments scheduled yet. Browse
                    our doctors and book your first consultation.
                  </p>
                </div>
              ) : (
                <div>
                  {appointments.map((appointment) => (
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
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
