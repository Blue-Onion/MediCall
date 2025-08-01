import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { creditBenefits, features, testimonials } from "@/lib/data";
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
import Pricing from "@/components/pricing";
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
                <Link href="/doctors">
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
      <section className="py-20 bg-muted/50 mt-56">
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
      <section id="pricing" className="py-20 mt-32">
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
            {/* Pricing Table */}
            <Pricing/>
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
                      <p
                        className="text-muted-foreground"
                        dangerouslySetInnerHTML={{ __html: benefit }}
                      />
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
        <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge
              variant="outline"
              className="bg-emerald-900/30 border-emerald-700/30 px-4 py-1 text-emerald-400 text-sm font-medium mb-4"
            >
              Success Stories
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              What Our Users Say
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Hear from patients and doctors who use our platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="border-emerald-900/20 hover:border-emerald-800/40 transition-all"
              >
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-900/20 flex items-center justify-center mr-4">
                      <span className="text-emerald-400 font-bold">
                        {testimonial.initials}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-emerald-400 text-xl">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    &quot;{testimonial.quote}&quot;
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section with green medical styling */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-r from-emerald-900/30 to-emerald-950/20 border-emerald-800/20">
            <CardContent className="p-8 md:p-12 lg:p-16 relative overflow-hidden">
              <div className="max-w-2xl relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Ready to take control of your healthcare?
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Join thousands of users who have simplified their healthcare
                  journey with our platform. Get started today and experience
                  healthcare the way it should be.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    asChild
                    size="lg"
                    className="bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    <Link href="/sign-up">Sign Up Now</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-emerald-700/30 hover:bg-muted/80"
                  >
                    <Link href="#pricing">View Pricing</Link>
                  </Button>
                </div>
              </div>

              {/* Decorative healthcare elements */}
              <div className="absolute right-0 top-0 w-[300px] h-[300px] bg-emerald-800/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
              <div className="absolute left-0 bottom-0 w-[200px] h-[200px] bg-emerald-700/10 rounded-full blur-3xl -ml-10 -mb-10"></div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
