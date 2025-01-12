import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface UserContextType {
    name: string | null;
    email: string | null;
    profilePhoto: string | null;
    loading: boolean;
    error: string | null;
    setUserData: (name: string, email: string, profilePhoto: string) => void;
    fetchUserData: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);
const host = "http://localhost:3000/";
const api = "api/";
const getDetails = "getDetail";

const getAuthToken = (): string | null => {
    const match = document.cookie.match(new RegExp('(^| )authToken=([^;]+)'));
    return match ? match[2] : null;
};

const fetchUserData = async (
    setUserData: (name: string, email: string, profilePhoto: string) => void,
    setLoading: (loading: boolean) => void,
    setError: (error: string | null) => void
) => {
    try {
        setLoading(true);
        setError(null);

        const token = getAuthToken();
        if (!token) {
            setError('No authentication token found');
            setLoading(false);
            return;
        }

        const response = await fetch(`${host}${api}${getDetails}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": token,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }

        const data = await response.json();

        if (data.name && data.email) {
            setUserData(data.name, data.email, data.profilePhoto);
        } else {
            setError('User data is incomplete');
        }
    } catch (error) {
        setError('Error fetching user data');
        console.log(error);
    } finally {
        setLoading(false);
    }
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [name, setName] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const setUserData = (name: string, email: string, profilePhoto: string) => {
        setName(name);
        setEmail(email);
        setProfilePhoto(profilePhoto);
    };

    const fetchData = async () => {
        await fetchUserData(setUserData, setLoading, setError);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <UserContext.Provider value={{ name, email, profilePhoto, loading, error, setUserData, fetchUserData: fetchData }}>
            {children}
        </UserContext.Provider>
    );
};

export const globalUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
