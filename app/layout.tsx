'use client'
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./components/Header";
import { usePathname } from "next/navigation";
import Sidebar from "./components/floatingActionButton";


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
  const noNavbarPaths = ["/auth/login", "/auth/signup", "/auth/forgot-password", "/auth/verification", "/secure-notes"];
  return (
    <html lang="en">
      <body
        className={` bg-[#202124] ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {!noNavbarPaths.includes(pathname) && <><Navbar /><Sidebar /></>}
        {children}
      </body>
    </html>
  );
}
