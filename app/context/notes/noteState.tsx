'use client'
import React, { createContext, useState, ReactNode, useCallback } from "react";

interface NoteData {
    _id: string;
    noteTitle: string;
    noteData: string;
    pinned: boolean;
    archive: boolean;
    secureNote: boolean;
    bin: boolean;
}

interface NoteContextType {
    notes: NoteData[];
    getAllNotes: () => Promise<void>;
    deleteNote: (id: string) => void;
    addNotes: (note: NoteData) => void;
    updateNotes: (note: NoteData) => void;
}
interface NoteStateProps {
    children: ReactNode;
}
const hostURL = process.env.NEXT_PUBLIC_USER_HOST as string;
export const NoteContext = createContext<NoteContextType | undefined>(undefined);
const NoteState: React.FC<NoteStateProps> = ({ children }) => {
    const host = hostURL;
    const api = "api/";
    const getURL = "getNotes/";
    const addURL = "addNotes/";
    const updateURL = "updateNotes/";

    const [notes, setNotes] = useState<NoteData[]>([]);

    const getAuthToken = (): string | null => {
        const match = document.cookie.match(new RegExp('(^| )authToken=([^;]+)'));
        return match ? match[2] : null;
    };

    const getAllNotes = useCallback(async (): Promise<void> => {
        const token = getAuthToken();
        if (!token) {
            console.warn("No auth token found. User might not be authenticated.");
            return;
        }

        try {
            const response = await fetch(`${host}${api}${getURL}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": token,
                },
            });

            if (!response.ok) {
                console.error(`Failed to fetch notes: ${response.status} ${response.statusText}`);
                return;
            }

            const fetchedNotes: NoteData[] = await response.json();
            setNotes(fetchedNotes);
        } catch (error) {
            console.error("Error occurred while fetching notes:", error);
        }
    }, [host]);

    const deleteNote = (id: string) => {
        setNotes(notes.filter((note) => note._id !== id));
    };

    const addNotes = async (note: NoteData): Promise<void> => {
        const token = getAuthToken();
        if (!token) {
            return;
        }

        try {
            const response = await fetch(`${host}${api}${addURL}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": token,
                },
                body: JSON.stringify(note)
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const newNote = await response.json()
            setNotes(notes.concat(newNote))
        } catch (error) {
            console.error("Failed to fetch notes:", error);
        }
    };
    const updateNotes = async (updatedNote: NoteData): Promise<void> => {
        if (!updatedNote || !updatedNote._id) {
            console.error('Invalid note object passed to updateNotes:', updatedNote);
            return;
        }
        const token = getAuthToken();
        if (!token) {
            return;
        }

        try {
            const response = await fetch(`${host}${api}${updateURL}/${updatedNote._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": token,
                },
                body: JSON.stringify(updatedNote),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const { updatedNote: updatedData } = await response.json();

            setNotes(prevNotes =>
                prevNotes.map(note =>
                    note._id === updatedData._id ? updatedData : note
                )
            );
            console.log(notes)
        } catch (error) {
            console.error("Failed to update note:", error);
        }
    };


    return (
        <NoteContext.Provider value={{ notes, getAllNotes, deleteNote, addNotes, updateNotes }}>
            {children}
        </NoteContext.Provider>
    );
};


export default NoteState;
