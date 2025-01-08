'use client'
import React, { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import logo from "../../assets/logo.svg"
import Link from 'next/link'
import { globalUser } from '@/app/context/user/userContext';
import { useRouter } from 'next/navigation';
const Navbar: React.FC = () => {
    const router = useRouter();
    const [userDropDownIsOpen, setUserDropDownIsOpen] = useState(false);
    const [openWithKeyboard, setOpenWithKeyboard] = useState(false);
    const dropdownRef = useRef<HTMLUListElement>(null);
    const handleLogOut = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        document.cookie = "authToken=; path=/; SameSite=Strict; Secure; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        router.push('/');
    }
    const handleOutsideClick = (event: MouseEvent) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target as Node)
        ) {
            setUserDropDownIsOpen(false);
            setOpenWithKeyboard(false);
        }
    };
    const { name, email, profilePhoto, loading, fetchUserData } = globalUser();
    useEffect(() => {
        fetchUserData();
    }, [])

    useEffect(() => {
        if (userDropDownIsOpen || openWithKeyboard) {
            document.addEventListener('mousedown', handleOutsideClick);
        } else {
            document.removeEventListener('mousedown', handleOutsideClick);
        }

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [userDropDownIsOpen, openWithKeyboard]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
        if (event.key === ' ') {
            event.preventDefault();
            setOpenWithKeyboard(true);
        } else if (event.key === 'Enter') {
            event.preventDefault();
            setOpenWithKeyboard(true);
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            setOpenWithKeyboard(true);
        }
    };
    const [isFocused, setIsFocused] = useState(false);
    return (
        <>
            <header className="fixed inset-x-0 top-0 z-30  mx-auto w-full max-w-screen-md border border-gray-400 bg-white/40  py-3 shadow backdrop-blur-lg md:top-6 md:rounded-3xl lg:max-w-screen-lg">
                <div className="px-4">
                    <div className="flex items-center justify-between">
                        <div className="flex shrink-0">
                            <Link aria-current="page" className="flex items-center" href="/">
                                <Image
                                    className="h-7 w-auto light:invert"
                                    src={logo}
                                    alt="Next.js logo"
                                />
                            </Link>
                        </div>
                        <div className="relative">
                            <div
                                className={`fixed inset-0 bg-black/20 backdrop-blur-lg z-10 transition-opacity duration-300 ${isFocused ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                                    } rounded-3xl`}
                            ></div>
                            <div
                                className={`relative z-20 mx-auto text-gray-600 w-full max-w-sm flex justify-center transition-transform duration-300 ${isFocused ? "scale-110" : "scale-100"
                                    }`}
                            >
                                <input
                                    className="border rounded-lg placeholder-current h-10 sm:h-12 px-3 pr-12 sm:rounded-md text-sm focus:outline-none backdrop-blur-3xl dark:bg-gray-400 dark:text-black w-full"
                                    type="search"
                                    name="search"
                                    placeholder="Search Notes"
                                    onFocus={() => setIsFocused(true)}
                                    onBlur={() => setIsFocused(false)}
                                />
                                <button
                                    type="submit"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                >
                                    <svg
                                        className="text-gray-600 dark:text-black h-5 w-5 fill-current"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 56.966 56.966"
                                        style={{ background: "new 0 0 56.966 56.966" }}
                                        xmlSpace="preserve"
                                    >
                                        <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17s-17-7.626-17-17S14.61,6,23.984,6z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-3">
                            <li className="relative flex items-center">
                                <button
                                    onClick={() => setUserDropDownIsOpen(!userDropDownIsOpen)}
                                    aria-expanded={userDropDownIsOpen}
                                    onKeyDown={handleKeyDown}
                                    className="rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:focus-visible:outline-white"
                                    aria-controls="userMenu"
                                >
                                    <img
                                        src={profilePhoto || '/default.jpg'}
                                        alt="User Profile"
                                        className="object-cover rounded-full size-10"
                                    />

                                </button>

                                {(userDropDownIsOpen || openWithKeyboard) && (
                                    <ul
                                        ref={dropdownRef}
                                        id="userMenu"
                                        className="absolute right-0 top-12 flex w-full min-w-[12rem] flex-col overflow-hidden rounded-md border border-neutral-300 bg-neutral-50 py-1.5 dark:border-neutral-700 dark:bg-neutral-900"
                                    >
                                        <li className="border-b border-neutral-300 dark:border-neutral-700">
                                            <div className="flex flex-col px-4 py-2">
                                                <span className="text-sm font-medium text-neutral-900 dark:text-white">
                                                    {name ? name?.charAt(0).toUpperCase() + name?.slice(1) : ''}
                                                </span>
                                                <p className="text-xs text-neutral-600 dark:text-neutral-300">
                                                    {loading ? (
                                                        <span>Loading...</span>
                                                    ) : (
                                                        <>
                                                            {email}
                                                        </>
                                                    )}
                                                </p>
                                            </div>
                                        </li>
                                        <li>
                                            <Link
                                                href={'/settings'}
                                                className="block px-4 py-2 text-sm bg-neutral-50 text-neutral-600 hover:bg-neutral-900/5 hover:text-neutral-900 focus-visible:bg-neutral-900/10 focus-visible:text-neutral-900 focus-visible:outline-none dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-50/5 dark:hover:text-white dark:focus-visible:bg-neutral-50/10 dark:focus-visible:text-white"
                                            >
                                                Settings
                                            </Link>
                                        </li>
                                        <li>
                                            <div
                                                onClick={handleLogOut}
                                                className="block px-4 py-2 text-sm bg-neutral-50 text-neutral-600 hover:bg-neutral-900/5 hover:text-neutral-900 focus-visible:bg-neutral-900/10 focus-visible:text-neutral-900 focus-visible:outline-none dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-50/5 dark:hover:text-white dark:focus-visible:bg-neutral-50/10 dark:focus-visible:text-white cursor-pointer"
                                            >
                                                Sign Out
                                            </div>
                                        </li>
                                    </ul>
                                )}
                            </li>
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}

export default Navbar