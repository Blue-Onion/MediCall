import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { User,Mail, Verified, Calendar } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import Link from "next/link";

const DoctorCard = ({ doctor }) => {
  return (
    <Card className="border-emerald-900/30 hover:border-emerald-700/40 transition-all ease-out duration-300 shadow-md">
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="h-14 w-14 rounded-full bg-emerald-900/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
          {doctor.imageUrl ? (
            <img
              src={doctor.imageUrl}
              alt={doctor.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="h-6 w-6 tebg-emerald-600 hover:bg-emerald-700 text-white" />
          )}
        </div>
        <div className="space-y-1">
          <CardTitle className="text-lg h-full gap-3 flex items-center  font-semibold text-white">
            <div className="">{doctor.name}</div>
            <Badge className={"bg-emerald-600 hover:bg-emerald-700 text-white rounded-full"}>
              <Verified className="h-4 w-4" />
            </Badge>
          </CardTitle>
          <CardDescription className="text-muted-foreground flex items-center gap-2 flex-wrap">
            {doctor.specialty} • {doctor.experience}+ yrs
            <div className="flex flex-wrap gap-2 mt-2">
              <a
                href={`mailto:${doctor.email}`}
                className="no-underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Badge className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white  text-xs">
                  <Mail className="h-3 w-3" />
                  Email
                </Badge>
              </a>
            </div>
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 flex flex-col gap-3">
        <p className="mb-4 text-muted-foreground line-clamp-3">
          {doctor.description || "No description provided."}
        </p>
        <Link href={`/doctors/${doctor.specialty}/${doctor.id}`}>
          <Button className={"w-full bg-emerald-600 font-bold hover:bg-emerald-700 text-white"}>
            <Calendar className="h-4 w-4 mr-2 " />
            View & Book Profile
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default DoctorCard;
