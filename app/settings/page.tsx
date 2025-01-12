'use client'
import React, { useEffect, useState } from 'react';
import { globalUser } from '@/app/context/user/userContext';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '@/app/utils/cropImage';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';

const Page: React.FC = () => {
    const { name, email, profilePhoto, loading, fetchUserData } = globalUser();
    const [newName, setNewName] = useState('');
    const [exsitingPin, setExsitingPin] = useState('');
    const [newPin, setNewPin] = useState('');
    const [confirmNewPin, setConfirmNewPin] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [croppedImage, setCroppedImage] = useState<string | null>(null);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [cropModalOpen, setCropModalOpen] = useState(false);
    const [authToken, setAuthToken] = useState<string | null>(null);
    const [accountSettings, setAccountSettings] = useState<boolean>(false);
    const [pinMsg, setPinMsg] = useState('');
    useEffect(() => {
        if (pinMsg) {
            toast.info(pinMsg, {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                theme: 'dark',
                transition: Bounce,
            });
        }
    }, [pinMsg]);
    const failed = () => {
        toast.error('failed to update', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
        });
    };
    useEffect(() => {
        const getAuthToken = (): string | null => {
            const match = document.cookie.match(new RegExp('(^| )authToken=([^;]+)'));
            return match ? match[2] : null;
        };

        const token = getAuthToken();
        setAuthToken(token);
        fetchUserData();
    }, []);
    const handleRemove = async () => {
        try {
            if (!authToken) {
                console.log('No auth token available');
                return;
            }
            const response = await fetch('/api/updateUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': authToken,
                },
                body: JSON.stringify({
                    profilePhoto: '/default.jpg',
                }),
            });
            const data = await response.json();
            if (response.ok) {
                fetchUserData();
                setPinMsg('Data saved');
            } else {
                console.log('Error removing profile:', data);
            }
        } catch (error) {
            console.log('Error Removing changes:', error);
        }
    }
    const onCropComplete = (_croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };



    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImage(reader.result as string);
                setCropModalOpen(true);
            };
            reader.readAsDataURL(file);
        }
    };
    const handleAccount = () => {
        setAccountSettings(true);
    }
    const handlePublic = () => {
        setAccountSettings(false);
    }
    const savePin = async () => {
        if (newPin !== confirmNewPin) {
            setPinMsg(`password doesn't match`)
            return;
        }
        if (!newPin || !exsitingPin || !confirmNewPin) {
            setPinMsg('Please enter a valid password');
            return;
        }

        try {
            if (!authToken) {
                console.log('No auth token available');
                return;
            }
            const response = await fetch('/api/setPin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': authToken,
                },
                body: JSON.stringify({
                    securePin: exsitingPin,
                    newSecurePin: newPin,
                    confirmNewSecurePin: confirmNewPin
                }),
            });

            const data = await response.json();
            if (response.ok) {
                fetchUserData();
                setPinMsg('Pin updated')
                setExsitingPin('')
                setConfirmNewPin('')
                setNewPin('')
            } else {
                failed()
                console.log('Error updating Pin');
            }
        } catch (error) {
            failed()
            console.log('Error saving pin:');
        }
    }
    const saveChange = async () => {
        const updatedName = newName || name;
        const profilePhotoToSave = croppedImage;

        try {
            if (!authToken) {
                console.log('No auth token available');
                return;
            }

            const response = await fetch('/api/updateUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': authToken,
                },
                body: JSON.stringify({
                    name: updatedName,
                    profilePhoto: profilePhotoToSave,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                fetchUserData();
                setPinMsg('Data saved');
            } else {
                failed()
                console.log('Error updating profile:', data);
            }
        } catch (error) {
            failed()
            console.log('Error saving changes:', error);
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="absolute top-[10%] bg-[#202124] w-full flex flex-col gap-5 px-3 md:px-16 lg:px-28 md:flex-row text-white">
                <aside className="py-4 md:w-1/3 lg:w-1/4 w-full md:block">
                    <div className="sticky flex flex-col gap-2 p-4 text-sm border-r border-gray-700 top-12">
                        <h2 className="pl-3 mb-4 text-2xl font-semibold">Settings</h2>
                        <div
                            onClick={handlePublic}
                            className={`flex items-center cursor-pointer px-3 py-2.5 font-bold rounded-full ${!accountSettings
                                ? 'bg-gray-800 text-indigo-300 hover:bg-gray-700 border'
                                : 'text-gray-300 hover:text-indigo-300 hover:border'
                                }`}
                        >
                            Public Profile
                        </div>
                        <div
                            onClick={handleAccount}
                            className={`flex items-center cursor-pointer px-3 py-2.5 font-bold rounded-full ${accountSettings
                                ? 'bg-gray-800 text-indigo-300 hover:bg-gray-700 border'
                                : 'text-gray-300 hover:text-indigo-300 hover:border'
                                }`}
                        >
                            Account Settings
                        </div>
                    </div>
                </aside>
                {!accountSettings ? <main className="w-full min-h-screen py-1 md:w-2/3 lg:w-3/4">
                    <div className="p-2 md:p-4">
                        <div className="w-full px-6 pb-8 mt-8 sm:max-w-xl sm:rounded-lg">
                            <h2 className="pl-6 text-2xl font-bold sm:text-xl">Public Profile</h2>
                            <div className="grid max-w-2xl mx-auto mt-8">
                                <div className="flex flex-col items-center space-y-5 sm:flex-row sm:space-y-0">
                                    <Image
                                        className="object-cover w-40 h-40 p-1 rounded-full ring-2 ring-indigo-300"
                                        src={croppedImage || profilePhoto || '/default.jpg'}
                                        alt="Avatar"
                                        width={40}
                                        height={40}
                                    />
                                    <div className="flex flex-col space-y-5 sm:ml-8">
                                        <label className="py-3.5 px-7 text-base font-medium text-white focus:outline-none bg-indigo-700 rounded-lg border border-indigo-500 hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-300 cursor-pointer">
                                            Change Picture
                                            <input
                                                type="file"
                                                accept=".jpg,.jpeg,.png"
                                                className="hidden"
                                                onChange={handleImageChange}
                                            />
                                        </label>
                                        <div className='flex space-x-2'>
                                            <svg
                                                onClick={handleRemove}
                                                className="w-6 h-6 cursor-pointer"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                            >
                                                <path fill="currentColor" d="M15 4V3H9v1H4v2h1v13c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V6h1V4h-5zm2 15H7V6h10v13z" />
                                                <path fill="currentColor" d="M9 8h2v9H9zm4 0h2v9h-2z" />
                                            </svg>
                                            <span>Remove Picture</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="items-center mt-8 sm:mt-14">
                                    <div className="flex flex-col items-center w-full mb-2 space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 sm:mb-6">
                                        <div className="w-full">
                                            <label
                                                htmlFor="first_name"
                                                className="block mb-2 text-sm font-medium text-gray-300"
                                            >
                                                Your name
                                            </label>
                                            <input
                                                type="text"
                                                value={newName === '' ? (name || '') : newName}
                                                onChange={(e) => setNewName(e.target.value)}
                                                className="bg-gray-700 border border-gray-600 text-gray-300 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                                                placeholder="Your name"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-2 sm:mb-6">
                                        <label
                                            htmlFor="email"
                                            className="block mb-2 text-sm font-medium text-gray-300"
                                        >
                                            Your email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            className="bg-gray-700 border border-gray-600 text-gray-300 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 cursor-not-allowed"
                                            placeholder="your.email@mail.com"
                                            defaultValue={email ? email : ''}
                                            readOnly
                                        />
                                    </div>
                                    <div className="flex justify-end">
                                        <button
                                            onClick={saveChange}
                                            type="button"
                                            className="text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main> : <main className="w-full min-h-screen py-1 md:w-2/3 lg:w-3/4">
                    <div className="p-2 md:p-4">
                        <div className="w-full px-6 pb-8 mt-8 sm:max-w-xl sm:rounded-lg">
                            <h2 className="pl-6 text-2xl font-bold sm:text-xl">Account Settings</h2>
                            <div className="grid max-w-2xl mx-auto mt-8">
                                <div className="flex flex-col items-center space-y-5 sm:flex-row sm:space-y-0">
                                    <Image
                                        className="object-cover w-40 h-40 p-1 rounded-full ring-2 ring-indigo-300"
                                        src={croppedImage || profilePhoto || '/default.jpg'}
                                        alt="Avatar"
                                        width={40}
                                        height={40}
                                    />
                                </div>
                                <div className="items-center mt-8 sm:mt-14">
                                    <div className="contianer m-1">
                                        Change Secure Pin
                                    </div>
                                    <div className="flex flex-col items-center w-full mb-2 space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 sm:mb-6">
                                        <div className="w-full">
                                            <input
                                                type="password"
                                                value={exsitingPin}
                                                onChange={(e) => setExsitingPin(e.target.value)}
                                                className="bg-gray-700 border border-gray-600 text-gray-300 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                                                placeholder="Exsiting Pin"
                                                required
                                            />
                                        </div>
                                        <div className="w-full">
                                            <input
                                                type="password"
                                                value={newPin}
                                                onChange={(e) => setNewPin(e.target.value)}
                                                className="bg-gray-700 border border-gray-600 text-gray-300 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                                                placeholder="New Pin"
                                                required
                                            />
                                        </div>
                                        <div className="w-full">
                                            <input
                                                type="password"
                                                value={confirmNewPin}
                                                onChange={(e) => setConfirmNewPin(e.target.value)}
                                                className="bg-gray-700 border border-gray-600 text-gray-300 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                                                placeholder="Confirm New Pin"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-2 sm:mb-6">
                                        <label
                                            htmlFor="email"
                                            className="block mb-2 text-sm font-medium text-gray-300"
                                        >
                                            Your email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            className="bg-gray-700 border border-gray-600 text-gray-300 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 cursor-not-allowed"
                                            placeholder="your.email@mail.com"
                                            defaultValue={email ? email : ''}
                                            readOnly
                                        />
                                    </div>
                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            onClick={savePin}
                                            className="text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>}
            </div>

            {cropModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-gray-800 p-4 rounded-lg w-4/5 max-w-xl">
                        <h3 className="text-white text-lg mb-4">Crop Image</h3>
                        <div className="relative h-64 w-full bg-black">
                            <Cropper
                                image={image!}
                                crop={crop}
                                zoom={zoom}
                                aspect={1} // Maintain square aspect ratio
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                            />
                        </div>
                        <div className="flex justify-end mt-4 space-x-2">
                            <button
                                onClick={() => setCropModalOpen(false)}
                                className="text-gray-300 bg-gray-600 px-4 py-2 rounded-lg hover:bg-gray-500"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={async () => {
                                    const croppedImg = await getCroppedImg(image!, croppedAreaPixels!);
                                    setCroppedImage(croppedImg);
                                    setCropModalOpen(false);
                                }}
                                className="text-white bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-500"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </>
    );
};

export default Page;
