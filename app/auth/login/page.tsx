'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
const Page: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await fetch('/api/getUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            if (response.status === 307) {
                try {
                    const sendEmailResponse = await fetch('/api/sendEmail', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ name, email }),
                    });

                    if (!sendEmailResponse.ok) {
                        throw new Error('Failed to send email');
                    }

                    const data = await sendEmailResponse.json();
                    const { authtoken } = data;

                    if (authtoken === undefined) {
                        return;
                    }

                    router.push(`/auth/verification?token=${authtoken}`);
                } catch (error) {
                    setError((error as Error).message);
                }
                return;
            }
            if (!response.ok) {
                throw new Error('Login failed. Please check your credentials.');
            }
            const data = await response.json();
            const { authtoken } = data;
            if (authtoken) {
                document.cookie = `authToken=${authtoken}; path=/; SameSite=Strict; Secure;Expires=${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString()};`
                router.push('/');
            }
        } catch (err: unknown) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen w-screen flex justify-center items-center dark:bg-black-900">
            <div className="grid gap-8">
                <div
                    id="back-div"
                    className="bg-gradient-to-tr from-blue-500 to-purple-500 rounded-[26px] m-4"
                >
                    <div className="border-[20px] backdrop-blur-3xl border-transparent rounded-[20px] dark:bg-gray-900 bg-white shadow-lg xl:p-10 2xl:p-10 lg:p-10 md:p-10 sm:p-2 m-2">
                        <h1 className="pt-8 pb-6 font-bold dark:text-gray-400 text-5xl text-center cursor-default">
                            Log in
                        </h1>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="email" className="mb-2 dark:text-gray-400 text-lg">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    className="border p-3 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-700 shadow-md placeholder:text-base focus:scale-105 ease-in-out duration-300 border-gray-300 rounded-lg w-full"
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="mb-2 dark:text-gray-400 text-lg">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    className="border p-3 shadow-md dark:bg-gray-700 dark:text-gray-300 dark:border-gray-700 placeholder:text-base focus:scale-105 ease-in-out duration-300 border-gray-300 rounded-lg w-full"
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                            <Link
                                href={'/auth/forgot-password'}
                                className="group text-blue-400 transition-all duration-100 ease-in-out"
                            >
                                <span className="bg-left-bottom bg-gradient-to-r text-sm from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
                                    Forget your password?
                                </span>
                            </Link>
                            <button
                                className="bg-gradient-to-r dark:text-gray-300 from-blue-500 to-purple-500 shadow-lg mt-6 p-2 text-white rounded-lg w-full hover:scale-105 hover:from-purple-500 hover:to-blue-500 transition duration-300 ease-in-out"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? 'Logging in...' : 'LOG IN'}
                            </button>
                        </form>
                        <div className="flex flex-col mt-4 items-center justify-center text-sm">
                            <h3 className="dark:text-gray-300">
                                Don&apos;t have an account?
                                <Link href={'/auth/signup'} className="group text-blue-400 transition-all duration-100 ease-in-out">
                                    <span className="bg-left-bottom bg-gradient-to-r from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
                                        Sign Up
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
