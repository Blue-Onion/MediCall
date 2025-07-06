import { SPECIALTIES } from "@/lib/specialty";
import Link from "next/link";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
const page = () => {
  return (
    <>
      <div className="flex flex-col justify-center mb-8 text-center">
        {" "}
        <h3 className="text-4xl font-bold gradient-title mb-2">
          Find your doctor
        </h3>
        <p className="text-muted-foreground">
          Browse by specialty or view all available healthcare provider
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {SPECIALTIES.map((specialty) => {
          return (
            <Link key={specialty.name} href={`/doctors/${specialty.name}`}>
              <Card className="hover:border-emerald-700/40 transition-all cursor-pointer border-emerald-900/20 h-full">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                  <div className="w-12 h-12 rounded-full bg-emerald-900/20 flex items-center justify-center mb-4">
                    <div className="text-emerald-400">{specialty.icon}</div>
                  </div>
                  <h3 className="font-medium text-white">{specialty.name}</h3>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </>
  );
};

export default page;
