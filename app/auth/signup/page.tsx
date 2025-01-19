"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';

const Page: React.FC = () => {
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (password.trim() !== confirmPassword.trim()) {
            setError("Passwords do not match");
            return;
        }
        setError("");
        setLoading(true);
        try {
            const response = await fetch('/api/addUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password, confirmPassword }),
            });
            if (!response.ok) {
                throw new Error('Failed to create user...');
            }
            try {
                const sendEmailResponse = await fetch('/api/sendEmail', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name, email }),
                });

                if (!sendEmailResponse.ok) {
                    throw new Error('Failed to send mail...');
                }

                const data = await sendEmailResponse.json();
                const { authtoken } = data;

                if (authtoken === undefined) {
                    return;
                }

                router.push(`/auth/verification?token=${authtoken}`);
            } catch (error: unknown) {
                setError((error as Error).message);
            }
            if (!response.ok) {
                throw new Error('Failed to send mail...');
            }
        } catch (err: unknown) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-auto w-auto flex justify-center items-center dark:bg-black-900">
            <div className="grid gap-8">
                <div
                    id="back-div"
                    className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-[26px] m-3"
                >
                    <div className="border-[20px] border-transparent rounded-[20px] bg-gray-900  shadow-lg xl:p-10 2xl:p-10 lg:p-10 md:p-10 sm:p-2 m-2">
                        <h1 className="pt-8 pb-6 font-bold text-5xl dark:text-gray-400 text-center cursor-default">
                            Sign Up
                        </h1>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="mb-2 dark:text-gray-400 text-lg">
                                    Name
                                </label>
                                <input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="border bg-gray-700 dark:text-gray-300 border-gray-700 p-3 shadow-md placeholder:text-base  rounded-lg w-full focus:scale-105 ease-in-out duration-300"
                                    type="text"
                                    placeholder="Name"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="mb-2 dark:text-gray-400 text-lg">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="border bg-gray-700 dark:text-gray-300 border-gray-700 p-3 shadow-md placeholder:text-base  rounded-lg w-full focus:scale-105 ease-in-out duration-300"
                                    type="email"
                                    placeholder="Email"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="mb-2 dark:text-gray-400 text-lg">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="border bg-gray-700 dark:text-gray-300 border-gray-700 p-3 mb-2 shadow-md placeholder:text-base  rounded-lg w-full focus:scale-105 ease-in-out duration-300"
                                    type="password"
                                    placeholder="Password"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="confirm-password" className="mb-2 dark:text-gray-400 text-lg">
                                    Confirm Password
                                </label>
                                <input
                                    id="confirm-password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="border bg-gray-700 dark:text-gray-300 border-gray-700 p-3 mb-2 shadow-md placeholder:text-base  rounded-lg w-full focus:scale-105 ease-in-out duration-300"
                                    type="password"
                                    placeholder="Confirm Password"
                                    required
                                />
                            </div>
                            {error && <div className="text-red-500 text-sm">{error}</div>}
                            <button
                                className="bg-gradient-to-r dark:text-gray-300 from-blue-500 to-purple-500 shadow-lg mt-6 p-2 text-white rounded-lg w-full hover:scale-105 hover:from-purple-500 hover:to-blue-500 transition duration-300 ease-in-out"
                                type="submit"
                            >
                                {loading ? 'Signing up...' : 'SIGN UP'}
                            </button>
                        </form>
                        <div className="flex flex-col mt-4 items-center justify-center text-sm">
                            <h3>
                                <span className="cursor-default dark:text-gray-300">
                                    Have an account?
                                </span>
                                <Link
                                    href={"/auth/login"}
                                    className="group text-blue-400 transition-all duration-100 ease-in-out"
                                >
                                    <span className="bg-left-bottom ml-1 bg-gradient-to-r from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
                                        Log In
                                    </span>
                                </Link>
                            </h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default Page;
