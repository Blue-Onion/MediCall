import Image from "next/image";
import Link from "next/link";
import React from "react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "./ui/button";
import { checkUser } from "@/lib/checkuser";
import { Shield, Stethoscope, User } from "lucide-react";
const Navbar = async () => {
  const user = await checkUser();
  return (
    <header className="fixed top-0 bg-background/60 border border-b backdrop-blur-lg w-full z-2">
      <nav className=" container max-w-none mx-auto flex items-center justify-between py-4 px-6">
        <Link href={"/"}>
          <Image
            src="/logo-single.png"
            alt="Logo"
            width={60}
            height={200}
            className="cursor-pointer"
          />
        </Link>
        <div className="flex items-center gap-5 space-x-4">
          <SignInButton>
            <div className="">
              {user.role === "UNASSIGNED" && (
                <Button variant={"outline"} className="mr-2">
                  <Link href={"/onboarding"}>
                    <div className="flex gap-2">
                      <User className="h-4 w-4" />
                      <span className="hidden md:inline-block">
                        Complete Profile
                      </span>
                    </div>
                  </Link>
                </Button>
              )}
              {user.role === "DOCTOR" && (
                <Button variant={"outline"} className="mr-2">
                  <Link href={"/doctor"}>
                    <div className="flex items-center gap-2">
                      <Stethoscope className="h-4 w-4" />
                      <span className="hidden md:inline-block">
                        Doctor Dashboard
                      </span>
                    </div>
                  </Link>
                </Button>
              )}
              {user.role === "ADMIN" && (
                <Button variant={"outline"} className="mr-2">
                  <Link href={"/admin"}>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      <span className="hidden md:inline-block">
                        Admin Dashboard
                      </span>
                    </div>
                  </Link>
                </Button>
              )}
            </div>
          </SignInButton>
          <SignedOut>
            <SignInButton>
              <Button variant={"secondary"}>Sign In</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                  userButtonPopoverCard: "shadow-xl",
                  userPreviewMainIdentifiers: "font-semibold",
                },
              }}
            />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
