'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import jwt from 'jsonwebtoken'

const Page = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [decodedToken, setDecodedToken] = useState<unknown>(null);
    const [isClient, setIsClient] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsClient(true);

        const encodedEmail = new URLSearchParams(window.location.search).get('token');
        if (encodedEmail) {
            const decoded = jwt.decode(encodedEmail);
            setDecodedToken(decoded);
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const otp = [...document.querySelectorAll('input')].map(input => (input as HTMLInputElement).value).join('');

        if (otp.length !== 6 || !/^\d+$/.test(otp)) {
            setError('Please enter a valid OTP');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const response = await fetch('/api/verifyOTP', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ decodedToken, otp }),
            });

            if (!response.ok) throw new Error('Invalid OTP');

            const data = await response.json();
            if (data.success) {
                router.push('/auth/login');
            }
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    if (!isClient) {
        return <p>Loading...</p>;
    }

    return (
        <div className="h-screen w-screen flex justify-center items-center">
            <div className="grid gap-8">
                <div
                    id="back-div"
                    className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-[26px] m-4"
                >
                    <div className="border-[20px] border-transparent rounded-[20px] dark:bg-gray-900 bg-white shadow-lg xl:p-10 2xl:p-10 lg:p-10 md:p-10 sm:p-2 m-2">
                        <h1 className="pt-8 pb-6 font-bold dark:text-gray-400 text-5xl text-center cursor-default">
                            Enter OTP
                        </h1>
                        <form onSubmit={handleSubmit}>
                            <div className="flex items-center justify-center gap-3">
                                {Array.from({ length: 6 }).map((_, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        className="w-14 h-14 text-center text-2xl font-extrabold text-slate-900 bg-slate-400 border border-transparent hover:border-slate-200 appearance-none rounded p-4 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                                        maxLength={1}
                                    />
                                ))}
                            </div>
                            {error && <div className="text-red-500 text-sm">{error}</div>}
                            <div className="max-w-[260px] mx-auto mt-4">
                                <button
                                    className="bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg mt-6 p-2 text-white rounded-lg w-full hover:scale-105 hover:from-purple-500 hover:to-blue-500 transition duration-300 ease-in-out"
                                    type="submit"
                                >
                                    {loading ? 'Verifying...' : 'Verify'}
                                </button>
                            </div>
                        </form>
                        <div className="flex flex-col mt-4 items-center justify-center text-sm">
                            <h3 className="dark:text-gray-300">
                                Didn&apos;t receive code?
                                <a href="/login" className="group text-blue-400 transition-all duration-100 ease-in-out">
                                    <span className="bg-left-bottom bg-gradient-to-r from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
                                        Resend
                                    </span>
                                </a>
                            </h3>
                        </div>
                        <div className="text-gray-500 flex text-center flex-col mt-4 items-center text-sm">
                            <p className="cursor-default">
                                By signing in, you agree to our
                                <a href="#" className="group text-blue-400 transition-all duration-100 ease-in-out">
                                    <span className="cursor-pointer bg-left-bottom bg-gradient-to-r from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
                                        Terms
                                    </span>
                                </a>
                                and
                                <a href="#" className="group text-blue-400 transition-all duration-100 ease-in-out">
                                    <span className="cursor-pointer bg-left-bottom bg-gradient-to-r from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
                                        Privacy Policy
                                    </span>
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;
