'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { jwtVerify } from 'jose';


const ResetPasswordPage: React.FC = () => {
    const [isTokenValid, setIsTokenValid] = useState<boolean | null>(false);
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const router = useRouter();
    useEffect(() => {
        const verifyToken = async () => {
            const token = searchParams.get('token');
            const JWT_SECRET = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_EMAIL);
            if (!JWT_SECRET) {
                throw new Error('JWT_EMAIL environment variable is not defined');
            }
            if (token) {
                try {
                    await jwtVerify(token, JWT_SECRET);
                    setIsTokenValid(true);
                } catch (err) {
                    setIsTokenValid(false);
                    setError('The reset link has expired or is invalid.');
                }
            } else {
                setIsTokenValid(false);
                setError('No token provided.');
            }
        };
        verifyToken();
    }, [searchParams]);


    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        try {
            const token = searchParams.get('token');
            const response = await fetch('/api/resetPassword', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token, newPassword: password }),
            })
            const data = await response.json();
            if (response.ok) {
                alert('Password reset successfully!');
                router.push('/login');
            } else {
                setError(data.message || 'Failed to reset password.');
            }
        } catch (err) {
            console.error('Error resetting password:', err);
            setError('An unexpected error occurred. Please try again.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            {isTokenValid === null ? (
                <p className="text-white">Loading...</p>
            ) : isTokenValid ? (
                <form
                    onSubmit={handlePasswordReset}
                    className="bg-gray-800 text-white p-6 rounded-lg shadow-md w-full max-w-sm"
                >
                    <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
                    <div className="mb-4">
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium mb-1 text-gray-300"
                        >
                            New Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium mb-1 text-gray-300"
                        >
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    <button
                        type="submit"
                        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200"
                    >
                        Reset Password
                    </button>
                </form>
            ) : (
                <p className="text-red-500">{error}</p>
            )}
        </div>

    );
};

export default ResetPasswordPage;
