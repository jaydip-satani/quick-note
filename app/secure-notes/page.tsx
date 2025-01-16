'use client';
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const SecureNotesPage = dynamic(() => import('./SecureNotesPage'), { ssr: false });

const Page: React.FC = () => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null; // Render nothing until it's client-side

    return (
        <div className="container">
            <SecureNotesPage />
        </div>
    );
};

export default Page;
