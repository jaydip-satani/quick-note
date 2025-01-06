'use client'
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { globalUser } from '@/app/context/user/userContext';
const Sidebar: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    let timeOfDay
    let currentTime = new Date().getHours();
    if (currentTime < 12) {
        timeOfDay = 'Good Morning ';
    } else if (currentTime < 18) {
        timeOfDay = 'Godd Afternoon ';
    } else {
        timeOfDay = 'Good Evening ';
    }
    const { name, loading, fetchUserData } = globalUser();
    useEffect(() => {
        fetchUserData();
    }, [])

    return (
        <div className="text-[#E8EAED] bg-gray-100  dark:bg-dark dark:text-light">
            <div
                className={`fixed inset-y-0 z-10 flex w-80 opacity-80  transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} ease-linear`}
            >
                <svg
                    className="absolute inset-0 w-full h-full text-white"
                    style={{ filter: 'drop-shadow(10px 0 10px #00000030)' }}
                    preserveAspectRatio="none"
                    viewBox="0 0 309 800"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M268.487 0H0V800H247.32C207.957 725 207.975 492.294 268.487 367.647C329 243 314.906 53.4314 268.487 0Z"
                        fill="#191a1e"
                    />
                </svg>
                <div className="z-10 flex flex-col flex-1">
                    <div className="flex items-center justify-between flex-shrink-0 w-64 p-4">
                        <div className="relative overflow-hidden w-48">
                            <div className="animate-marquee whitespace-nowrap">
                                <div>
                                    {loading ? (
                                        <span>Loading...</span>
                                    ) : (
                                        <>
                                            {timeOfDay}
                                            {name ? name.charAt(0).toUpperCase() + name.slice(1) : ''}
                                        </>
                                    )}
                                </div>

                            </div>

                        </div>
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className=" p-1 rounded-lg focus:outline-none focus:ring"
                        >
                            <svg
                                className="w-6 h-6"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span className="sr-only">Close sidebar</span>
                        </button>
                    </div>
                    <nav className="flex flex-col flex-1 w-64 p-4 mt-4 gap-2">
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
            <main className="flex flex-col items-center justify-center flex-1">
                {!isSidebarOpen && (
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="fixed p-2 text-white bg-[#202124]  shadow-[0_0px_18px_4px_#000000] rounded-lg top-10 left-5 z-50 focus:outline-none"
                    >
                        <svg
                            className="w-6 h-6"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                        <span className="sr-only">Open menu</span>
                    </button>
                )}

                <h1 className="sr-only">Home</h1>
            </main>
        </div >
    );
};

export default Sidebar;
