'use client';
import React, { useEffect, useState } from 'react';
import jwt from 'jsonwebtoken';

interface NoteData {
    _id: string;
    title: string;
    content: string;
}

const getAuthToken = (): string | null => {
    const match = document.cookie.match(new RegExp('(^| )authToken=([^;]+)'));
    return match ? match[2] : null;
};

const Note: React.FC = () => {
    const [notes, setNotes] = useState<NoteData[]>([]);
    const [selectedNote, setSelectedNote] = useState<NoteData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNotes = async () => {
            setLoading(true);
            setError(null);

            const token = getAuthToken();
            if (!token) {
                setError('No auth token found');
                setLoading(false);
                return;
            }

            const decodedToken = jwt.decode(token) as { user?: { id?: string } };
            const userId = decodedToken?.user?.id;

            if (!userId) {
                setError('Invalid or missing user ID in token');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch('/api/getNotes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId }),
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch notes');
                }

                const responseData = await response.json();
                const notesArray = responseData.notes || [];
                const formattedNotes = notesArray.map((note: any) => ({
                    _id: note._id,
                    title: note.noteTitle,
                    content: note.noteData,
                }));

                setNotes(formattedNotes);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchNotes();
    }, []);

    const openNote = (note: NoteData) => setSelectedNote(note);

    const closeNote = () => setSelectedNote(null);

    const handleChange = (key: 'title' | 'content', value: string) => {
        if (selectedNote) {
            setSelectedNote({ ...selectedNote, [key]: value });
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="relative bg-[#202124] min-h-screen text-[#E8EAED] p-4">
            <div className="absolute top-[40%] left-[50%] transform -translate-x-[50%] 
                w-[90%] max-w-[1000px] bg-[#202124] shadow-md rounded-xl  p-4 overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                    {notes.map((note) => (
                        <div
                            key={note._id}
                            onClick={() => openNote(note)}
                            className="p-4 bg-[#202124] h-40 shadow-[0_6px_18px_4px_rgba(0,0,0,0.3)] rounded-xl overflow-auto border border-[#696969] text-[#E8EAED] cursor-pointer"
                        >
                            <h3 className="w-full text-lg font-semibold mb-2">{note.title}</h3>
                            <p className="w-full overflow-hidden text-ellipsis">
                                {note.content.length > 70 ? `${note.content.slice(0, 70)}...` : note.content}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
            {selectedNote && (
                <div
                    className="fixed inset-0 flex items-center backdrop-blur-sm justify-center bg-[#202124] bg-opacity-70 z-50"
                    onClick={closeNote}
                >
                    <div
                        className="w-full max-w-lg bg-opacity-20 backdrop-blur-sm bg-[#202124] rounded-lg p-6 shadow-lg border border-[#696969]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <input
                            type="text"
                            value={selectedNote.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                            className="w-full bg-transparent text-lg font-semibold mb-4 outline-none border-none text-[#E8EAED]"
                            placeholder="Title"
                        />
                        <textarea
                            value={selectedNote.content}
                            onChange={(e) => handleChange('content', e.target.value)}
                            rows={10}
                            className="w-full bg-transparent resize-none outline-none border-none text-[#E8EAED]"
                            placeholder="Take a note..."
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Note;
