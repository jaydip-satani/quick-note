'use client';

import React, { useState, useEffect } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useRouter } from 'next/navigation';
import failure from '@/public/animations/failure.json';
import success from '@/public/animations/success.json';
import fingerprint from '@/public/animations/fingerprint.json';


const Page: React.FC = () => {
    enum AnimationState {
        Failure = "failure",
        Success = "success",
        Fingerprint = "fingerprint"
    }

    const animations = {
        [AnimationState.Failure]: failure,
        [AnimationState.Success]: success,
        [AnimationState.Fingerprint]: fingerprint,
    };

    const [passcode, setPasscode] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [currentState, setCurrentState] = useState<AnimationState>(AnimationState.Fingerprint);
    const [animationComplete, setAnimationComplete] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [isLoop, setIsLoop] = useState(true);
    const router = useRouter();

    const currentAnimation = animations[currentState];

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (passcode === "1234") {
            setCurrentState(AnimationState.Success);
            setAnimationComplete(false);
            setIsLoop(false);
        } else {
            setCurrentState(AnimationState.Failure);
            setIsLoop(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasscode(e.target.value);
    };

    const accessString = "dkjdibibiwrb";

    const handleAnimationComplete = () => {
        if (currentState === AnimationState.Success) {
            setAnimationComplete(true);
            setTimeout(() => {
                if (isClient) {
                    router.push(`/secure-notes/access?token=${accessString}`);
                }
            }, 600);
        }
    };

    if (!isClient) return null;

    return (
        <div className="h-screen bg-[#202124] flex justify-center items-center">
            <div className="bg-[#202124] rounded-lg p-8 w-96 shadow-[0_6px_18px_4px_rgba(0,0,0,0.3)]">
                <div className="flex justify-center mb-4">
                    <div className="w-30 h-30">
                        <Player
                            autoplay
                            loop={isLoop}
                            src={currentAnimation}
                            onEvent={(event) => {
                                if (event === 'complete') {
                                    handleAnimationComplete();
                                }
                            }}
                            style={{ height: '100%', width: '100%' }}
                        />
                    </div>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="relative mb-4">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="passcode"
                            value={passcode}
                            onChange={handleInputChange}
                            className="peer w-full p-3 cursor-auto border-2 rounded-lg bg-transparent border-[#969696] text-white focus:outline-none focus:ring-0 focus:border-[#d6d6d6]"
                            placeholder=" "
                        />
                        <label
                            htmlFor="passcode"
                            className={`absolute left-3 text-gray-400 text-base bg-[#202124] px-1 transition-all duration-300 transform
                            ${passcode.length > 0 || document.activeElement === document.getElementById('passcode') ? 'top-0 text-[#E8EAED] scale-75 -translate-y-1/2' : 'top-1/2 -translate-y-1/2 text-gray-400 scale-100'}
                            peer-placeholder-shown:top-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-gray-400
                            peer-focus:top-0 peer-focus:text-[#E8EAED] peer-focus:scale-75 peer-focus:bg-[#202124]`}
                        >
                            Enter your passcode
                        </label>

                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 focus:outline-none"
                        >
                            {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                        </button>
                    </div>
                    <button
                        type="submit"
                        disabled={!passcode.trim()}
                        className={`w-full py-2 rounded-md text-white ${passcode.trim()
                            ? 'bg-[#7D71CA]'
                            : 'bg-[#544B81]'
                            }`}
                    >
                        NEXT
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                        Log out if you don't remember your passcode.
                    </p>
                    <button className="text-purple-600 hover:underline">LOG OUT</button>
                </div>
            </div>
        </div>
    );
};

export default Page;