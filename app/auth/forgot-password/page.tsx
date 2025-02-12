'use client'
import Link from 'next/link'
import React, { useState } from 'react'
const Page: React.FC = () => {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            setLoading(true);
            const response = await fetch('/api/forgotEmail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });
            if (!response.ok) {
                throw new Error('Something went wrong... Try again later ');
            }
            alert('Password link is successfully sent');
            setEmail('')
        } catch (error) {
            console.log(error)
        }
        finally {
            setLoading(false)
        }
        return;
    }
    return (
        <div className="h-screen w-screen flex justify-center items-center dark:bg-black-900">
            <div className="grid gap-8">
                <div
                    id="back-div"
                    className="bg-gradient-to-r dark:from-blue-500 dark:to-purple-500 from-blue-500 to-purple-500 rounded-[26px] m-4"
                >
                    <div className="border-[20px] border-transparent rounded-[20px] bg-gray-900 shadow-lg xl:p-10 2xl:p-10 lg:p-10 md:p-10 sm:p-2 m-2">
                        <h1 className="pt-8 pb-6 font-bold dark:text-gray-400 text-5xl text-center cursor-default">
                            Forgot Password
                        </h1>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="email" className="mb-2 dark:text-gray-400 text-lg">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="border p-3 bg-gray-700 dark:text-gray-300 border-gray-700 shadow-md placeholder:text-base focus:scale-105 ease-in-out duration-300 rounded-lg w-full"
                                    type="email"
                                    placeholder="Email"
                                    required
                                />
                            </div>
                            <span className='dark:text-gray-500'>We will email you a link to reset your password.</span>
                            <button
                                className="bg-gradient-to-r dark:text-gray-300 from-blue-500 to-purple-500 shadow-lg mt-6 p-2 text-white rounded-lg w-full hover:scale-105 hover:from-purple-500 hover:to-blue-500 transition duration-300 ease-in-out"
                                type="submit"
                            >
                                {loading ? 'Reset...' : 'Reset'}
                            </button>
                        </form>
                        <div className="flex flex-col mt-4 items-center justify-center text-sm">
                            <h3 className="dark:text-gray-300">
                                Already have an account?
                                <Link href={'/auth/login'}
                                    className="group text-blue-400 transition-all duration-100 ease-in-out"
                                >
                                    <span className="bg-left-bottom bg-gradient-to-r from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
                                        Login
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
                                <Link href={'#'}
                                    className="group text-blue-400 transition-all duration-100 ease-in-out"
                                >
                                    <span className="cursor-pointer bg-left-bottom bg-gradient-to-r from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
                                        Privacy Policy
                                    </span>
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Page