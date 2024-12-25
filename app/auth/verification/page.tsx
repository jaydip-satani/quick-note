'use client'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation';
import jwt from 'jsonwebtoken';
import { useRouter } from 'next/navigation';
const Page: React.FC = () => {
    const inputsRef = useRef<HTMLInputElement[]>([]);
    const formRef = useRef<HTMLFormElement | null>(null);
    const submitButtonRef = useRef<HTMLButtonElement | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const searchParams = useSearchParams();
    const encodedEmail = searchParams.get('token') as string;
    const decodedToken = jwt.decode(`${encodedEmail}`);
    const router = useRouter();
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const inputs = inputsRef.current;
        const otp = inputs.map((input) => input.value).join('');
        if (otp.length !== inputs.length || !/^\d+$/.test(otp)) {
            alert('Please enter a valid OTP');
            return;
        }
        setError("");
        setLoading(true);
        try {
            const response = await fetch('/api/verifyOTP', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ decodedToken, otp }),
            });
            if (!response.ok) {
                throw new Error('Invalid OTP');
            }
            const data = await response.json();
            const { success } = data;
            if (success) {
                router.push(`/auth/login/`);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        const inputs = inputsRef.current;
        const form = formRef.current;
        const submit = submitButtonRef.current;
        const handleKeyDown = (e: KeyboardEvent) => {
            const target = e.target as HTMLInputElement;
            const index = inputs.indexOf(target);
            if (
                !/^[0-9]{1}$/.test(e.key) &&
                e.key !== 'Backspace' &&
                e.key !== 'Delete' &&
                e.key !== 'Tab' &&
                !e.metaKey
            ) {
                e.preventDefault();
            }

            if (e.key === 'Delete' || e.key === 'Backspace') {
                if (target.value) {
                    target.value = '';
                } else if (index > 0) {
                    inputs[index - 1].value = '';
                    inputs[index - 1].focus();
                }
            }
        };


        const handleInput = (e: Event) => {
            const target = e.target as HTMLInputElement;
            const index = inputs.indexOf(target);
            if (target.value && inputs) {
                if (index < inputs.length - 1) {
                    inputs[index + 1].focus();
                } else {
                    submit?.focus();
                }
            }
        };

        const handleFocus = (e: FocusEvent) => {
            (e.target as HTMLInputElement).select();
        };

        const handlePaste = (e: ClipboardEvent) => {
            e.preventDefault();
            const text = e.clipboardData?.getData('text');
            if (text && /^[0-9]{4}$/.test(text)) {
                const digits = text.split('');
                digits.forEach((digit, index) => {
                    if (inputs[index]) {
                        inputs[index].value = digit;
                    }
                });
                submit?.focus();
            }
        };

        inputs.forEach((input) => {
            input.addEventListener('input', handleInput);
            input.addEventListener('keydown', handleKeyDown);
            input.addEventListener('focus', handleFocus);
            input.addEventListener('paste', handlePaste);
        });

        return () => {
            inputs.forEach((input) => {
                input.removeEventListener('input', handleInput);
                input.removeEventListener('keydown', handleKeyDown);
                input.removeEventListener('focus', handleFocus);
                input.removeEventListener('paste', handlePaste);
            });
        };
    }, []);

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
                        <form ref={formRef} id="otp-form" onSubmit={handleSubmit}>
                            <div className="flex items-center justify-center gap-3">
                                {Array.from({ length: 6 }).map((_, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        ref={(el) => {
                                            if (el) inputsRef.current[index] = el;
                                        }}
                                        className="w-14 h-14 text-center text-2xl font-extrabold text-slate-900 bg-slate-400 border border-transparent hover:border-slate-200 appearance-none rounded p-4 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                                        style={{
                                            textSecurity: 'disc',
                                            WebkitTextSecurity: 'disc',
                                        } as React.CSSProperties}
                                        pattern="\d*"
                                        maxLength={1}
                                    />
                                ))}
                            </div>
                            {error && <div className="text-red-500 text-sm">{error}</div>}
                            <div className="max-w-[260px] mx-auto mt-4">
                                <button
                                    ref={submitButtonRef}
                                    className="bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg mt-6 p-2 text-white rounded-lg w-full hover:scale-105 hover:from-purple-500 hover:to-blue-500 transition duration-300 ease-in-out"
                                    type="submit"
                                >
                                    {loading ? 'Verifying...' : 'Verify'}
                                </button>
                            </div>
                        </form>
                        <div className="flex flex-col mt-4 items-center justify-center text-sm">
                            <h3 className="dark:text-gray-300">
                                Didn't receive code?
                                <Link href={'/login'}
                                    className="group text-blue-400 transition-all duration-100 ease-in-out"
                                >
                                    <span className="bg-left-bottom bg-gradient-to-r from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
                                        Resend
                                    </span>
                                </Link>
                            </h3>
                        </div>
                        <div className="text-gray-500 flex text-center flex-col mt-4 items-center text-sm">
                            <p className="cursor-default">
                                By signing in, you agree to our
                                <a
                                    className="group text-blue-400 transition-all duration-100 ease-in-out"

                                >
                                    <span className="cursor-pointer bg-left-bottom bg-gradient-to-r from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
                                        Terms
                                    </span>
                                </a>
                                and
                                <a
                                    className="group text-blue-400 transition-all duration-100 ease-in-out"

                                >
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
