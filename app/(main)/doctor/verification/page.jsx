import { getCurrentUser } from "@/action/onboarding";
import { redirect } from "next/navigation";
import React from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
const page = async () => {
  const user = await getCurrentUser();
  if (user?.verificationStatus === "VERIFIED") {
    redirect("/doctor");
  }
  const isRejected = user?.verificationStatus === "REJECTED";
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
            <CardAction>Card Action</CardAction>
          </CardHeader>
          <CardContent>
            <p>Card Content</p>
          </CardContent>
         
        </Card>
      </div>
    </div>
  );
};

export default page;
