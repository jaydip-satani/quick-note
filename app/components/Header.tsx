'use client'
import React, { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import logo from "../../assets/logo.svg"
import Link from 'next/link'
import { useGlobalUser } from '@/app/context/user/userContext';
import { useRouter } from 'next/navigation';
const Navbar: React.FC = () => {
    const router = useRouter();
    const [userDropDownIsOpen, setUserDropDownIsOpen] = useState(false);
    const [openWithKeyboard, setOpenWithKeyboard] = useState(false);
    const dropdownRef = useRef<HTMLUListElement>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

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
    const { name, email, profilePhoto, loading, fetchUserData } = useGlobalUser();
    useEffect(() => {
        fetchUserData();
    }, [fetchUserData])

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
            <div
                className={`fixed inset-y-0 z-10 flex bg-[#191a1e] w-60 opacity-80  transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} ease-linear`}>
                <div className="absolute top-[10%] z-10 flex flex-col flex-1">
                    <nav className="flex flex-col flex-1 w-64 p-4 mt-4 gap-2 text-[#E9E9E9]">
                        <Link href={"/"} className="flex items-center space-x-2">
                            <svg
                                className="w-6 h-6"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                />
                            </svg>
                            <span>Home</span>
                        </Link>
                        <Link href={"/archive"} className="flex items-center space-x-2 ">
                            <svg xmlns="http://www.w3.org/2000/svg" className='w-6 h-6' viewBox="0 0 24 24">
                                <path fill='currentColor' d="M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM6.24 5h11.52l.83 1H5.42l.82-1zM5 19V8h14v11H5zm11-5.5l-4 4-4-4 1.41-1.41L11 13.67V10h2v3.67l1.59-1.59L16 13.5z" />
                            </svg>
                            <span>Archive</span>
                        </Link>
                        <Link href={"/bin"} className="flex items-center space-x-2 ">
                            <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path fill='currentColor' d="M15 4V3H9v1H4v2h1v13c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V6h1V4h-5zm2 15H7V6h10v13z" />
                                <path fill='currentColor' d="M9 8h2v9H9zm4 0h2v9h-2z" />
                            </svg>
                            <span>Bin</span>
                        </Link>
                        <Link href={"/secure-notes"} className="flex items-center space-x-2 ">
                            <svg className='w-6 h-5' viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">

                                <g id="SVGRepo_bgCarrier" strokeWidth="0" />

                                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />

                                <g id="SVGRepo_iconCarrier"> <path d="M20 10V6.8C20 5.11984 20 4.27976 19.673 3.63803C19.3854 3.07354 18.9265 2.6146 18.362 2.32698C17.7202 2 16.8802 2 15.2 2H8.8C7.11984 2 6.27976 2 5.63803 2.32698C5.07354 2.6146 4.6146 3.07354 4.32698 3.63803C4 4.27976 4 5.11984 4 6.8V17.2C4 18.8802 4 19.7202 4.32698 20.362C4.6146 20.9265 5.07354 21.3854 5.63803 21.673C6.27976 22 7.11984 22 8.8 22H10.5M13 11H8M11 15H8M16 7H8M19.25 17V15.25C19.25 14.2835 18.4665 13.5 17.5 13.5C16.5335 13.5 15.75 14.2835 15.75 15.25V17M15.6 21H19.4C19.9601 21 20.2401 21 20.454 20.891C20.6422 20.7951 20.7951 20.6422 20.891 20.454C21 20.2401 21 19.9601 21 19.4V18.6C21 18.0399 21 17.7599 20.891 17.546C20.7951 17.3578 20.6422 17.2049 20.454 17.109C20.2401 17 19.9601 17 19.4 17H15.6C15.0399 17 14.7599 17 14.546 17.109C14.3578 17.2049 14.2049 17.3578 14.109 17.546C14 17.7599 14 18.0399 14 18.6V19.4C14 19.9601 14 20.2401 14.109 20.454C14.2049 20.6422 14.3578 20.7951 14.546 20.891C14.7599 21 15.0399 21 15.6 21Z" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /> </g>

                            </svg>
                            <span>Secure Notes</span>
                        </Link>
                    </nav>
                </div>
            </div>
            <header className="fixed inset-x-0 z-30  mx-auto w-full  border-b border-[#696969]  bg-[#202124]  py-3  shadow backdrop-blur-lg ">
                <div className="px-4">
                    <div className="flex items-center justify-between">
                        <div className="flex shrink-0 gap-2">
                            <div aria-current="page" className="flex items-center cursor-pointer" onClick={handleSidebar}>
                                <svg
                                    className="h-8"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="#E9E9E9"
                                >
                                    <path fill='currentColor' strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </div>
                            <Link aria-current="page" className="flex items-center" href="/">
                                <Image
                                    className="h-8 w-auto"
                                    src={logo}
                                    alt="Logo"
                                />
                            </Link>
                            <span className="text-lg font-semibold tracking-wide text-[#E9E9E9] dark:text-gray-100">
                                Quick-Note
                            </span>
                        </div>
                        <div className="relative">
                            <div
                                className={`fixed inset-0 bg-[#202124]/2 backdrop-blur-sm z-10 transition-opacity duration-300 ${isFocused ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                                    } rounded-3xl`}
                            ></div>
                            <div
                                className={`relative z-20 mx-auto text-gray-600 w-full max-w-sm flex justify-center transition-transform duration-300 ${isFocused ? "scale-110" : "scale-100"
                                    } sm:block hidden`}
                            >
                                <input
                                    className="rounded-md placeholder-current h-10 sm:h-12 px-3 pr-12 sm:rounded-md text-sm focus:outline-none backdrop-blur-3xl bg-[#525355] text-[#E9E9E9] max-w-full "
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
                                        className="text-[#E9E9E9] dark:text-black h-5 w-5"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 56.966 56.966"
                                        style={{ background: "new 0 0 56.966 56.966" }}
                                        xmlSpace="preserve"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17s-17-7.626-17-17S14.61,6,23.984,6z"
                                            fill='#E9E9E9'
                                        />
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
                                    <Image
                                        src={profilePhoto || '/default.jpg'}
                                        alt="User Profile"
                                        className="object-cover rounded-full size-12"
                                        width={6}
                                        height={6}
                                    />

                                </button>

                                {(userDropDownIsOpen || openWithKeyboard) && (
                                    <ul
                                        ref={dropdownRef}
                                        id="userMenu"
                                        className="absolute right-0 top-12 flex w-full min-w-[12rem] flex-col overflow-hidden rounded-md border  py-1.5 border-neutral-700 bg-neutral-900"
                                    >
                                        <li className="border-b border-neutral-700">
                                            <div className="flex flex-col px-4 py-2">
                                                <span className="text-sm font-medium  text-white">
                                                    {name ? name?.charAt(0).toUpperCase() + name?.slice(1) : ''}
                                                </span>
                                                <p className="text-xs text-neutral-300">
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
                                                className="block px-4 py-2 text-sm focus-visible:outline-none bg-neutral-900 text-neutral-300 hover:bg-neutral-50/5 hover:text-white focus-visible:bg-neutral-50/10 focus-visible:text-white"
                                            >
                                                Settings
                                            </Link>
                                        </li>
                                        <li>
                                            <div
                                                onClick={handleLogOut}
                                                className="block px-4 py-2 text-sm focus-visible:outline-none bg-neutral-900 text-neutral-300 hover:bg-neutral-50/5 hover:text-white focus-visible:bg-neutral-50/10 focus-visible:text-white cursor-pointer"
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