import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-background">
      <section className="relative overflow-hidden">
        <div className="container max-w-none mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            <div className="space-y-8">
              <Badge
                variant={"outline"}
                className="bg-emerald-900/30 text-emerald-400 px-4 py-2 border-emerald-900"
              >
                HealthCare Made Simple
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-white mt-4">
                Connect <br/> With <br/>Your Dcotor <br /> <span className="gradient-title">anytime,anywhere</span>
              </h1>
            </div>
            <div className=""></div>
          </div>
        </div>
      </section>
    </div>
  );
}
