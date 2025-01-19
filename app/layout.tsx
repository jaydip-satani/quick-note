'use client'
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./components/Header";
import { usePathname } from "next/navigation";
import NoteState from "./context/notes/noteState";
import { useEffect } from "react";
import { UserProvider } from "./context/user/userContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname()
  const NavbarPaths = ["/dashboard", "/archive", "/bin", "/settings"];


  const defaultTitle = "Quick-Note";

  useEffect(() => {
    const titles: Record<string, string> = {
      "/auth/login": "Login | Quick-Note ",
      "/auth/signup": "Sign Up | Quick-Note ",
      "/auth/forgot-password": "Forgot Password | Quick-Note ",
      "/auth/verification": "Verification | Quick-Note ",
      "/secure-notes": "Secure Notes | Quick-Note ",
      "/archive": "Archive | Quick-Note ",
      "/bin": "Bin | Quick-Note ",
      "/resetPassword": "Reset Password | Quick-Note ",
      "/settings": "Settings | Quick-Note ",
      "/dashboard": "Dashboard | Quick-Note ",
    };
    const pageTitle = titles[pathname] || defaultTitle;
    document.title = pageTitle;
  }, [pathname]);

  return (
    <html lang="en">
      <body
        className={` bg-[#202124] ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UserProvider>
          {NavbarPaths.includes(pathname) && <><Navbar /></>}
          <NoteState>
            {children}
          </NoteState>
        </UserProvider>
      </body>
    </html>
  );
}
