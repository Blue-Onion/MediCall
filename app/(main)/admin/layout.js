import { verifyAdmin } from "@/action/admin";
import PageHeader from "@/components/pageHeader";
import { AlertCircle, ShieldCheckIcon, User } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
export const metadata = {
  title: "Admin Setting-Medimeet",
  description: "Manage doctor,patient and platform setting",
};
const layout = async ({ children }) => {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) {
    redirect("/onboarding");
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader title={"Admin Settings"} icon={<ShieldCheckIcon />} />
      <Tabs
        defaultValue="pending"
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <TabsList className="md:col-span-1 bg-muted/30 h-14 md:h-28 flex sm:flex-row md:flex-col w-full p-2 md:p-1 rounded-md md:space-y-2 sm:space-x-2 md:space-x-0">
          <TabsTrigger
            value="pending"
            className="flex-1 md:flex md:items-center border-none md:justify-start md:px-4 md:py-3 w-full
               data-[state=active]:bg-gray-900 data-[state=active]:text-white rounded-md transition-colors"
          >
            <AlertCircle className="h-4 w-4 hidden md:inline" />
            <span>Pending Verification</span>
          </TabsTrigger>

          <TabsTrigger
            value="doctors"
            className="flex-1 md:flex md:items-center border-none md:justify-start md:px-4 md:py-3 w-full
               data-[state=active]:bg-gray-900 data-[state=active]:text-white rounded-md transition-colors"
          >
            <User className="h-4 w-4 hidden md:inline" />
            <span>Doctors</span>
          </TabsTrigger>
        </TabsList>

        <div className="md:col-span-3">{children}</div>
      </Tabs>
    </div>
  );
};

export default layout;
