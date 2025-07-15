"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Ban, Loader2, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useFetch from "@/hooks/useFetch";
import { updateDoctorActiveStatus } from "@/action/admin";
import { toast } from "sonner";

const VerfiedDoctor = ({ doctor }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDoctor, setFilteredDoctor] = useState(doctor);
  useEffect(() => {
    if (searchTerm) {
      const query = searchTerm.toLowerCase();
      const search = doctor.filter((doc) => {
        return (
          doc.name.toLowerCase().includes(query) ||
          doc.specialty.toLowerCase().includes(query) ||
          doc.email.toLowerCase().includes(query)
        );
      });
      setFilteredDoctor(search);
    } else {
      setFilteredDoctor(doctor);
    }
  }, [searchTerm]);

  const [targetDoctor, setTargetDoctor] = useState("");
  const {
    loading,
    data,
    fn: submitStatusUpdate,
    errors,
  } = useFetch(updateDoctorActiveStatus);
  const handleStatusChange = async (doc) => {
    if (loading) return;

    const confirmed = window.confirm(
      `Are you sure you want to suspend ${doc.name}?`
    );
    if (!confirmed) return;

    const formData = new FormData();
    formData.append("doctorId", doc.id);
    formData.append("suspend", true);

    setTargetDoctor(doc);
    await submitStatusUpdate(formData);
  };

  useEffect(() => {
    if (data?.success && targetDoctor) {
      toast.success(`Doctor ${targetDoctor.name} suspended successfully`);

      setFilteredDoctor((prev) =>
        prev.filter((doc) => doc.id !== targetDoctor.id)
      );

      setTargetDoctor(null);
    }
  }, [data, targetDoctor]);

  return (
    <div>
      <Card className={"border-emerald-950/20 "}>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="">
              <CardTitle className={"text-2xl font-bold gradient-title"}>
                Manage Doctor
              </CardTitle>
              <CardDescription>View and manage all doctors.</CardDescription>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={"Search Doctors....."}
                className={"pl-8 bg-background border-emerald-900/20"}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <CardContent className="grid gap-4 mt-4">
            {filteredDoctor.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm
                  ? "No doctors match your search criteria."
                  : "No verified doctors available."}
              </div>
            ) : (
              <>
                {filteredDoctor.map((doc) => (
                  <Card key={doc.id} className="border p-4">
                    <CardContent className={"p-4 "}>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex gap-4">
                          <div className="bg-muted/90 flex items-center rounded-full justify-center p-4 w-fit">
                            <User className="text-emerald-400 h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">{doc.name}</h3>
                            <p className="text-muted-foreground">
                              {doc.specialty}.{doc.experience} years
                            </p>
                          </div>
                        </div>
                        <div className="flex self-end md:self-auto gap-4">
                          <Badge className="bg-emerald-900/20 text-white border-emerald-900/30">
                            Active
                          </Badge>
                          <Button
                            variant={"outline"}
                            onClick={() => handleStatusChange(doc)}
                            size={"sm"}
                            className="border-red-900/30 text-red-400 hover:bg-red-900/10"
                          >
                            {loading && targetDoctor.id === doc.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Ban className="h-4 w-4" />
                            )}
                            Suspend
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            )}
          </CardContent>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerfiedDoctor;
