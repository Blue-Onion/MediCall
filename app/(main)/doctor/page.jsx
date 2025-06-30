import { getAvailableSlots, getDoctorAppointment } from "@/action/doctor";
import { getCurrentUser } from "@/action/onboarding";
import { redirect } from "next/navigation";
import {
  AlertCircle,
  Calendar,
  Clock,
  ShieldCheckIcon,
  User,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AvailibilitySettings from "./_components/AvailibiltySettings";

const page = async ({ children }) => {
  const user = await getCurrentUser();
  if (user?.role !== "DOCTOR") {
    redirect("/onboarding");
  }
  if (user?.verificationStatus !== "VERIFIED") {
    redirect("/doctor/verification");
  }
  const [appointmentsData, availibiltyData] = await Promise.all([
    getDoctorAppointment(),
    getAvailableSlots(),
  ]);

  return (
    <div>
      <Tabs
        defaultValue="appointment"
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <TabsList className="md:col-span-1 bg-muted/30 h-14 md:h-28 flex sm:flex-row md:flex-col w-full p-2 md:p-1 rounded-md md:space-y-2 sm:space-x-2 md:space-x-0">
          <TabsTrigger
            value="appointment"
            className="flex-1 md:flex md:items-center border-none md:justify-start md:px-4 md:py-3 w-full
               data-[state=active]:bg-gray-900 data-[state=active]:text-white rounded-md transition-colors"
          >
            <Calendar className="h-4 w-4 hidden md:inline" />
            <span>Appointments</span>
          </TabsTrigger>

          <TabsTrigger
            value="availibility"
            className="flex-1 md:flex md:items-center border-none md:justify-start md:px-4 md:py-3 w-full
               data-[state=active]:bg-gray-900 data-[state=active]:text-white rounded-md transition-colors"
          >
            <Clock className="h-4 w-4 hidden md:inline" />
            <span>Availibility</span>
          </TabsTrigger>
        </TabsList>
        <div className="md:col-span-3">
          <TabsContent
            value={"appointment"}
            className={"border-none p-0"}
          ></TabsContent>
          <TabsContent value={"availibility"} className={"border-none p-0"}>
            <AvailibilitySettings slots={availibiltyData.slots || []} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default page;
