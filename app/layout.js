import { Inter } from "next/font/google";
import { dark } from "@clerk/themes";
import {
  ClerkProvider,

} from "@clerk/nextjs";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/themeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "MediCall: Your Health Companion",
  description: "One stop Medical Platform",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}>
      <html lang="en" suppressHydrationWarning>

        <body className={`${inter.className}`}>
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
          <Navbar />
          <main className="min-h-screen mb-12 mt-36 ">{children}</main>
          <footer className="py-12 bg-muted">
            <div className="text-center px-4 text-white">
              © {new Date().getFullYear()} Blue Onion. All rights reserved.
            </div>
          </footer>

        </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
