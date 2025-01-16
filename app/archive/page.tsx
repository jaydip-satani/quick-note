import React from 'react';
import NotesPage from './NotesPage';

const Page = async () => {

    return (
        <div><div className="absolute top-[20%] text-center left-1/2 w-auto -translate-x-1/2 p-3 bg-[#202124] shadow-[0_6px_18px_4px_rgba(0,0,0,0.3)] rounded-xl text-gray-300 border border-[#969696] flex flex-col text-2xl">
            <h1>Archived Notes</h1>
        </div>
            <div className="relative min-h-screen flex items-center justify-center">
                <div className="absolute w-[90%] max-w-[1000px] top-[40%] bg-[#202124] text-[#E8EAED] p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                        <NotesPage />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;
