import Pricing from "@/components/pricing";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col justify-start gap-6 mb-2">
        <Link
          href={"/"}
          className="flex items-center text-sm font-medium text-muted-foreground hover:text-white transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-muted-foreground" />
          <span className="text-muted-foreground ml-2">Back to Home</span>
        </Link>

        <div className="text-center max-w-full mx-auto flex flex-col items-center gap-4">
          <Badge
            variant={"outline"}
            className="bg-emerald-900/30 text-emerald-400 px-4 py-2 border-emerald-900"
          >
            HealthCare Made Affordable
          </Badge>
          <h1 className="text-4xl lg:text-5xl gradient-title font-bold mt-4">
            Simple and Transparent Pricing
          </h1>
          <p className="max-w-2xl text-muted-foreground text-lg">
            Choose the Perfect Consultation Package for your Healthcare Needs with no Hidden Fees or Long-Term Commitment.
          </p>
        </div>

        <Pricing />

        <div className="text-center mt-8 text-muted-foreground text-sm">
          For more information, contact us at:{" "}
          <Link
            href="mailto:rawatadityasingh963@gmail.com"
            className="text-emerald-400 hover:underline"
          >
            rawatadityasingh963@gmail.com
          </Link>
        </div>
      </div>
    </div>
  );
};

export default page;
