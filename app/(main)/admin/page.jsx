import { getPendingDoctor, getVerifiedDoctor } from "@/action/admin";
import { TabsContent } from "@/components/ui/tabs";
import React from "react";
import PendingDoctors from "./_components/PendingDoctors";
import VerfiedDoctor from "./_components/VerfiedDoctor";

const page = async() => {
    const [pendingDoctorsData,verifiedDoctorsData]=await Promise.all([
        getPendingDoctor(),
        getVerifiedDoctor()
    ])
 
  return (
    <div>
      <TabsContent value="pending">
       <PendingDoctors doctor={pendingDoctorsData.doctor||[]}/>
      </TabsContent>
      <TabsContent value="doctors">
        <VerfiedDoctor doctor={verifiedDoctorsData.doctor||[]} />
      </TabsContent>
    </div>
  );
};

export default page;
