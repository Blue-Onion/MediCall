import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { creditBenefits, features } from "@/lib/data";
import { ArrowRight, Check, Stethoscope } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
export default function Home() {
  return (
    <div className="bg-background">
      <section className="relative overflow-hidden">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge
                variant={"outline"}
                className="bg-emerald-900/30 text-emerald-400 px-4 py-2 border-emerald-900"
              >
                HealthCare Made Simple
              </Badge>
              <h1 className="text-4xl lg:text-7xl font-bold text-white space-y-4 mt-4">
                Connect <br /> With <br />
                Your Dcotor <br />{" "}
                <span className="gradient-title">anytime,anywhere</span>
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl max-w-md">
                Book appointments, consult with doctors, and manage your
                healthcare journey all in one place.
              </p>
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <Link href="/onboarding">
                  <Button
                    size="lg"
                    className={
                      "bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                    }
                  >
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/doctor">
                  <Button
                    size="lg"
                    variant={"outline"}
                    className={"font-semibold"}
                  >
                    Find Doctors
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-[450px] overflow-hidden lg:h-[550px]">
              <Image
                src="/banner2.png"
                fill
                priority
                alt="HealthCare Banner"
                className="object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="py-20 bg-muted/50 mt-32">
        <div className="container mx-auto ">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">
              How it works
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our platform make Healthcare more accesible with just few click
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={
                  "border-emerald-900/20 bg-muted/60 hover:border-emerald-800/40 transition-all duration-300"
                }
              >
                <CardHeader className={"pb-2"}>
                  <div className="bg-emerald-900/20 p-3 rounded-lg w-fit mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className={"text-xl font-bold text-emerald-400"}>
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 mt-32">
        <div className="container mx-auto ">
          <div className="text-center mb-16">
            <Badge
              className={
                "bg-emerald-900/30 text-emerald-400 px-4 py-2 border-emerald-900 text-sm font-medium mb-4"
              }
            >
              Affordable Packages
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-white">
              Consultaion Package
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Choose Perfect Consultation Package that fits your HealthCare
              needs
            </p>
          </div>
          <div className="">
            <Card className={"mt-12 bg-muted/20 border-emerald-900/30"}>
              <CardHeader className={"pb-2 "}>
                <CardTitle
                  className={
                    "text-xl font-bold flex gap-2 text-center items-center text-white"
                  }
                >
                  <Stethoscope className="h-5 w-5 mb-2  text-emerald-400" />
                  How our credit System works
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {creditBenefits.map((benefit, index) => (
                    <li key={index} className="flex items-center">
                      <div className="mr-3 mt-1 bg-emerald-900/20 p-2 rounded-full">
                        <Check className="h-5 w-5 text-emerald-400" />
                      </div>
                        <p className="text-muted-foreground" dangerouslySetInnerHTML={{__html:benefit}}/>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <section className="py-20 bg-muted/50 mt-32">
        <div className="container mx-auto ">
          <div className="text-center mb-16">
            <Badge
              className={
                "bg-emerald-900/30 text-emerald-400 px-4 py-2 border-emerald-900 text-sm font-medium mb-4"
              }
            >
              Sucess Strories
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-white">
              What Our Users Say
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Hear from pateintd and doctors who have transformed their healthcare experience with us.
            </p>
          </div>
          <div className="">
            
          </div>
        </div>
      </section>
    </div>
  );
}
