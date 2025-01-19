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
      "/auth/login": "Login ",
      "/auth/signup": "Sign Up ",
      "/auth/forgot-password": "Forgot Password ",
      "/auth/verification": "Verification ",
      "/secure-notes": "Secure Notes ",
      "/archive": "Archive ",
      "/bin": "Bin ",
      "/resetPassword": "Reset Password ",
      "/settings": "Settings ",
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
