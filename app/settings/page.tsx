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
    const [image, setImage] = useState<string | null>(null);
    const [croppedImage, setCroppedImage] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [cropModalOpen, setCropModalOpen] = useState(false);
    const [authToken, setAuthToken] = useState<string | null>(null);

    const dataSaved = () => {
        toast.info("Data saved ", {
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
    const inProgress = () => {
        toast.info("In Progress ", {
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
                dataSaved();
            } else {
                console.log('Error removing profile:', data);
            }
        } catch (error) {
            console.log('Error Removing changes:', error);
        }
    }
    const onCropComplete = async (croppedArea: any, croppedAreaPixels: any) => {
        try {
            const croppedImg = await getCroppedImg(image ?? '', croppedAreaPixels);
            setCroppedImage(croppedImg);
            setCropModalOpen(false);
        } catch (error) {
            console.log('Error cropping image:', error);
        }
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
                dataSaved();
            } else {
                console.log('Error updating profile:', data);
            }
        } catch (error) {
            console.log('Error saving changes:', error);
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="absolute top-[10%] bg-[#202124] w-full flex flex-col gap-5 px-3 md:px-16 lg:px-28 md:flex-row text-white">
                <aside className="hidden py-4 md:w-1/3 lg:w-1/4 md:block">
                    <div className="sticky flex flex-col gap-2 p-4 text-sm border-r border-gray-700 top-12">
                        <h2 className="pl-3 mb-4 text-2xl font-semibold">Settings</h2>
                        <a
                            href="#"
                            className="flex items-center px-3 py-2.5 font-bold bg-gray-800 text-indigo-300 border rounded-full hover:bg-gray-700"
                        >
                            Public Profile
                        </a>
                        <div
                            onClick={inProgress}
                            className="flex items-center px-3 py-2.5 font-semibold text-gray-300 hover:text-indigo-300 hover:border hover:rounded-full"
                        >
                            Account Settings
                        </div>
                    </div>
                </aside>
                <main className="w-full min-h-screen py-1 md:w-2/3 lg:w-3/4">
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
                                                id="first_name"
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
                </main>
            </div>

            {cropModalOpen && (
                <div className="fixed top-0 left-0 z-50 w-full h-full bg-black bg-opacity-75 flex items-center justify-center">
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <Cropper
                            image={image ?? undefined}
                            crop={crop}
                            zoom={zoom}
                            aspect={1}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={onCropComplete}
                        />
                        <button
                            className="mt-4 text-white bg-indigo-700 px-4 py-2 rounded-lg"
                            onClick={() => setCropModalOpen(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Page;
