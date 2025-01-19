import { Button } from "@/app/components/ui/button";
import Link from 'next/link';
import Image from "next/image";
import logo from '@/assets/logo.svg'
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import Footer from "./components/Footer";
import Features from "./components/Features";
import FAQ from "./components/FAQ";
export default async function Home() {
    return (
        <>
            <nav className="border-b border-[hsl(215,_27.9%,_16.9%)] bg-background h-16 flex items-center sticky top-0 z-50">
                <div className="container mx-auto flex items-center justify-between px-4 md:px-24">
                    <Link href="/">
                        <h2 className="font-bold text-2xl md:text-3xl flex items-center">
                            <span className="text-primary flex-shrink-0">
                                <Image
                                    src={logo}
                                    alt="Logo"
                                    height={28}
                                    width={28}
                                    className="mr-2"
                                />
                            </span>
                            <span className="flex-shrink-0">
                                Quick<span className="text-primary">Note</span>
                            </span>
                        </h2>
                    </Link>
                    <div className="flex items-center gap-4">

                        <div className="flex items-center gap-4">
                            <div>
                                <Button className="w-full  bg-[#F9FAFB] text-[#111827]">
                                    <Link href={'/auth/login'}>Sign In</Link>
                                </Button>
                            </div>
                            <div>
                                <Link href={'/auth/signup'}>
                                    <Button variant="secondary">Sign Up</Button>
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </nav>
            <section className="flex items-center justify-center bg-background h-[90vh]">
                <div className="relative items-center w-full px-5 py-12 mx-auto lg:px-16 max-w-7xl md:px-12">
                    <div className="max-w-3xl mx-auto text-center">
                        <div>
                            <Link
                                href="https://linkedin.com/in/jaydip-satani/"
                                target="_blank"
                                passHref
                            >
                                <Button
                                    variant="secondary"
                                    className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-secondary-foreground hover:bg-[#1F2937]/80 h-10 w-auto px-6 py-3 rounded-full bg-[#1F2937]"
                                >
                                    <FaLinkedin className="mr-2" />
                                    <span className="text-sm font-medium text-primary">
                                        Introducing a modern note taking app
                                    </span>
                                </Button>
                            </Link>
                            <h1 className="mt-8 text-4xl lg:text-6xl text-balance bg-gradient-to-br from-gray-100 to-gray-900 bg-clip-text text-center font-heading text-[40px] font-bold leading-tight tracking-[-0.02em] text-transparent drop-shadow-sm duration-300 ease-linear [word-spacing:theme(spacing.1)] md:text-7xl md:leading-[5rem]">
                                Organize Your Notes
                            </h1>

                            <h2 className="text-3xl lg:text-5xl text-balance bg-gradient-to-br from-gray-100 to-gray-900 bg-clip-text text-center font-heading text-[40px] font-bold leading-tight tracking-[-0.02em] text-transparent drop-shadow-sm duration-300 ease-linear [word-spacing:theme(spacing.1)] md:text-6xl md:leading-[5rem]">
                                Simplify Your Life
                            </h2>

                            <p className="mx-w-xl mx-auto mt-8 text-base lg:text-xl text-secondary-foreground ">
                                Quick-Note is a powerful note-taking platform that allows you to archive notes, move them to a bin, and secure your important notes with a secure note feature. Users can also pin notes to ensure they appear at the top for quick access.
                            </p>
                        </div>
                        <div className="flex justify-center max-w-sm mx-auto mt-10 space-x-4">
                            <div>
                                <Link href={'/dashboard'}>
                                    <Button size="lg" className="w-full bg-[#F9FAFB] text-[#111827]">
                                        Get Started
                                    </Button>
                                </Link>
                            </div>
                            <Link
                                href="https://github.com/jaydip-satani"
                                passHref
                                target="_blank"
                                rel="noreferrer"
                            >
                                <Button
                                    variant="secondary"
                                    size="lg"
                                    className="w-full"
                                >
                                    <FaGithub className="mr-2" />
                                    GitHub
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
            <section>
                <Features />
            </section>
            <section>
                <FAQ />
            </section>
            <footer>
                <Footer />
            </footer>
        </>
    );
}