import React, { useState, useContext } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useRouter } from 'next/navigation';
import failure from '@/public/animations/failure.json';
import success from '@/public/animations/success.json';
import fingerprint from '@/public/animations/fingerprint.json';
import { NoteContext } from '../context/notes/noteState';
import NotesItem from '../components/NotesItem';
import Navbar from '../components/Header';

const SecureNotesPage: React.FC = () => {
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
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    const currentAnimation = animations[currentState];

    // Get the auth token only on the client-side (after the component has mounted)
    const getAuthToken = (): string | null => {
        if (typeof window === 'undefined') return null; // Ensure this only runs on the client
        const match = document.cookie.match(new RegExp('(^| )authToken=([^;]+)'));
        return match ? match[2] : null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = getAuthToken();

        if (!token) {
            console.error('No token found');
            return;
        }

        try {
            const response = await fetch('/api/secureNotes', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": token,
                },
                body: JSON.stringify({ passcode }),
            });

            if (!response.ok) {
                setCurrentState(AnimationState.Failure);
                return;
            }

            setCurrentState(AnimationState.Success);
            setTimeout(() => {
                setIsAuthenticated(true);
            }, 3000);
        } catch (err: unknown) {
            console.error(err);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasscode(e.target.value);
    };

    const handleLogOut = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (typeof document !== "undefined") {
            document.cookie = "authToken=; path=/; SameSite=Strict; Secure; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
        setIsAuthenticated(false);
        router.push('/');
    };

    const context = useContext(NoteContext);
    if (!context) {
        throw new Error('NoteContext is not provided. Ensure Notes is wrapped in NoteState.');
    }
    const { notes } = context;

    return (
        <div className="container">
            {!isAuthenticated ? (
                <div className="h-screen bg-[#202124] flex justify-center items-center">
                    <div className="bg-[#202124] rounded-lg p-8 w-96 shadow-[0_6px_18px_4px_rgba(0,0,0,0.3)]">
                        <div>
                            <div className="flex justify-center mb-4">
                                <div className="w-30 h-30">
                                    <Player
                                        autoplay
                                        loop={true}
                                        src={currentAnimation}
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
                                    Log out if you don&rsquo;t remember your passcode.
                                </p>
                                <button onClick={handleLogOut} className="text-purple-600 hover:underline">LOG OUT</button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <Navbar />
                    <div className="absolute top-[20%] text-center left-1/2 w-auto -translate-x-1/2 p-3 bg-[#202124] shadow-[0_6px_18px_4px_rgba(0,0,0,0.3)] rounded-xl text-gray-300 border border-[#969696] flex flex-col text-2xl">
                        <h1>Secured Notes</h1>
                    </div>
                    <div className="relative min-h-screen flex items-center justify-center">
                        <div className="absolute w-[90%] max-w-[1000px] top-[40%] bg-[#202124] text-[#E8EAED] p-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                                {notes
                                    .filter((note) => note.secureNote)
                                    .sort((a, b) => Number(b.pinned) - Number(a.pinned))
                                    .map((note) => (
                                        <NotesItem key={note._id} note={note} />
                                    ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default SecureNotesPage;
