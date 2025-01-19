import Link from "next/link";
import Image from "next/image";
import logo from '@/assets/logo.svg';

export default function Footer() {
    return (
        <footer className="relative bg-background z-10 w-full border-t border-[hsl(215,_27.9%,_16.9%)] py-4">
            <div className="container flex flex-col items-center justify-center gap-4 md:h-14 md:flex-row md:gap-2">
                <div className="flex flex-col items-center gap-4 md:flex-row md:gap-2">
                    <span className="text-primary"></span>
                    <p className="text-center text-sm leading-loose text-muted-foreground md:text-left flex items-center gap-2">
                        <Image src={logo} height={24} alt="Logo" />
                        Developed by{" "}
                        <Link
                            href="https://jaydipsatani.com"
                            target="_blank"
                            rel="noreferrer"
                            className="font-medium"
                        >
                            Jaydip Satani
                        </Link>
                    </p>
                </div>
            </div>
        </footer>
    );
}
