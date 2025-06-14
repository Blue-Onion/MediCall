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
const Navbar = () => {
  return (
    <header className="fixed top-0 bg-background/60 border border-b backdrop-blur-lg w-full z-100">
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
        <div className="">
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
