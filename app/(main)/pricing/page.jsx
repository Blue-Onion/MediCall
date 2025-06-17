import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className="conainer mx-auto px-4 py-8">
      <div className="flex flex-col justify-start gap-6 mb-2">
        <Link href={"/"} className="flex items-center text-sm font-medium text-muted-foreground hover:text-white transition-colors">
        <ArrowLeft className="w-6 h-6 text-muted-foreground" />
        <span className="text-muted-foreground ml-2">Back to Home</span>
        </Link>
        <div className="">
            <Badge
                variant={"outline"}
                className="bg-emerald-900/30 text-emerald-400 px-4 py-2 border-emerald-900"
              >
                HealthCare Made Affordable
              </Badge>
              <h1 className="text-4xl gradient-title font-bold mt-4">
                Simple and Transparent Pricing
              </h1>

        </div>
      </div>
    </div>
  );
};

export default page;
