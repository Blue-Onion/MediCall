"use client";
import { updateDoctorStatus } from "@/action/admin";
import useFetch from "@/hooks/useFetch";
import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, ExternalLink, FileText, Medal, User, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { BarLoader } from "react-spinners";
const PendingDoctors = ({ doctor }) => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const {
    loading,
    data,
    fn: submitUpdateStatus,
    errors,
  } = useFetch(updateDoctorStatus);
  const handleCloseDialog = () => {
    setSelectedDoctor(null);
  };
  const handleUpadteStatus = async (doctorId, status) => {
    if (loading) return;
    const formData = new FormData();
    formData.append("doctorId", doctorId);
    formData.append("status", status);
    console.log("Submitting to backend:", {
      doctorId,
      status,
    });
    await submitUpdateStatus(formData);
  };

  useEffect(() => {
    if (data && data?.success) {
      handleCloseDialog();
    }
  }, [data]);

  return (
    <div>
      <Card className={"border-emerald-950/20 "}>
        <CardHeader>
          <CardTitle className={"text-2xl font-bold gradient-title"}>
            Pending Doctor Verification
          </CardTitle>
          <CardDescription>
            Review and approve doctor application
          </CardDescription>
        </CardHeader>
        <CardContent>
          {doctor.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No Pending Verification request at this time
            </div>
          ) : (
            <div className="space-y-4">
              {doctor.map((doc) => {
                return (
                  <Card
                    key={doc.id}
                    className={
                      "border-emerald-900/20 bg-muted/60 hover:border-emerald-800/40 transition-all duration-300 "
                    }
                  >
                    <CardContent className={"p-4 "}>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex flex-col gap-4">
                          <div className="bg-muted/90 rounded-full p-2 w-fit">
                            <User className="text-emerald-400 h-5 w-5" />
                          </div>
                          <div className="">
                            <h3 className="font-bold text-lg">{doc.name}</h3>
                            <p className="text-muted-foreground">
                              {doc.specialty}. {doc.experience}years
                            </p>
                          </div>
                        </div>
                        <div className="flex self-end md:self-auto gap-4">
                          <Badge
                            className={
                              "text-amber-400 bg-amber-900/20 border-amber-900/30"
                            }
                          >
                            Pending
                          </Badge>
                          <Button
                            variant={"outline"}
                            onClick={() => setSelectedDoctor(doc)}
                            size={"sm"}
                            className={
                              "border-emerald-900/30 hover:bg-muted/80"
                            }
                          >
                            View more details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
      {selectedDoctor && (
        <Dialog open={!!selectedDoctor} onOpenChange={handleCloseDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className={"text-lg font-bold text-white"}>
                Doctor Verification Details
              </DialogTitle>
              <DialogDescription>
                Review the doctor&apos;s information carefully before making
                decision
              </DialogDescription>
              <div className="space-y-6 py-4">
                {/* Basic Info */}
                <div className="flex flex-col gap-6">
                  <div className="space-y-1 flex gap-2">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Full Name
                    </h4>
                    <p className="text-base font-medium text-white">
                      {selectedDoctor.name}
                    </p>
                  </div>
                  <div className="space-y-1 flex gap-2">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Email
                    </h4>
                    <p className="text-base font-medium text-white">
                      {selectedDoctor.email}
                    </p>
                  </div>
                  <div className="space-y-1 flex gap-2">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Application Date
                    </h4>
                    <p className="text-base font-medium text-white">
                      {format(new Date(selectedDoctor.createdAt), "PPP")}
                    </p>
                  </div>
                </div>

                <Separator className="bg-emerald-900/20" />

                {/* Professional Details */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Medal className="h-5 w-5 text-emerald-400" />
                    <h3 className="text-white font-medium">
                      Professional Information
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Specialty
                      </h4>
                      <p className="text-white">{selectedDoctor.specialty}</p>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Years of Experience
                      </h4>
                      <p className="text-white">
                        {selectedDoctor.experience} years
                      </p>
                    </div>

                    <div className="space-y-1 col-span-2">
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Credentials
                      </h4>
                      <div className="flex items-center">
                        <a
                          href={selectedDoctor.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-400 hover:text-emerald-300 flex items-center"
                        >
                          View Credentials
                          <ExternalLink className="h-4 w-4 ml-1" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="bg-emerald-900/20" />

                {/* Description */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-emerald-400" />
                    <h3 className="text-white font-medium">
                      Service Description
                    </h3>
                  </div>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {selectedDoctor.description}
                  </p>
                </div>
              </div>
              {loading && <BarLoader width={"100%"} color="#36d7b7" />}
              <DialogFooter className={"flex sm:justify-between"}>
                <Button
                  onClick={() =>
                    handleUpadteStatus(selectedDoctor.id, "REJECTED")
                  }
                  variant={"destructive"}
                  disabled={loading}
                  className={"bg-red-600  font-bold hover:bg-red-700"}
                >
                  <X className="h-4 w-5 mr-2" />
                  Reject
                </Button>
                <Button
                  onClick={() =>
                    handleUpadteStatus(selectedDoctor.id, "VERIFIED")
                  }
                  disabled={loading}
                  className={"bg-emerald-600 font-bold hover:bg-emerald-700"}
                >
                  <Check className="h-4 w-5 mr-2" />
                  Approve
                </Button>
              </DialogFooter>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default PendingDoctors;
