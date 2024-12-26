"use client";
import React, { useState, useEffect, useRef } from "react";
import jwt from "jsonwebtoken";

interface NoteData {
    _id: string;
    title: string;
    content: string;
}

const NotesApp: React.FC = () => {
    const [notes, setNotes] = useState<NoteData[]>([]);
    const [isTitleVisible, setIsTitleVisible] = useState(false);
    const [title, setTitle] = useState("");
    const [textValue, setTextValue] = useState("");
    const [selectedNote, setSelectedNote] = useState<NoteData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const noteRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const titleRef = useRef<string>("");
    const textValueRef = useRef<string>("");

    const getAuthToken = (): string | null => {
        const match = document.cookie.match(new RegExp("(^| )authToken=([^;]+)"));
        return match ? match[2] : null;
    };

    const fetchNotes = async () => {
        setLoading(true);
        setError(null);

        const token = getAuthToken();
        if (!token) {
            setError("No auth token found");
            setLoading(false);
            return;
        }

        const decodedToken = jwt.decode(token) as { user?: { id?: string } };
        const userId = decodedToken?.user?.id;

        if (!userId) {
            setError("Invalid or missing user ID in token");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("/api/getNotes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId }),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch notes");
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
            setError(err instanceof Error ? err.message : "An unknown error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleNoteClick = () => {
        setIsTitleVisible(true);
    };

    const [saving, setSaving] = useState(false);

    const handleClickOutside = async (event: MouseEvent) => {
        if (noteRef.current && !noteRef.current.contains(event.target as Node)) {
            setIsTitleVisible(false);

            const latestTitle = titleRef.current.trim();
            const latestTextValue = textValueRef.current.trim();

            if (!latestTextValue || !latestTitle || saving) return;

            setSaving(true);
            try {
                const token = getAuthToken();
                if (!token) {
                    console.error("No auth token found");
                    return;
                }

                const decodedToken = jwt.decode(token) as { user?: { id?: string } };
                const userId = decodedToken?.user?.id;

                if (!userId) {
                    console.error("Invalid or missing user ID in token");
                    return;
                }

                // Save the note via API
                const response = await fetch("/api/addNotes", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ userId, noteTitle: latestTitle, noteData: latestTextValue }),
                });

                if (!response.ok) {
                    throw new Error("Failed to save note");
                }

                const data = await response.json();

                if (!data?.note?._id) {
                    throw new Error("Invalid response from API");
                }

                const newNote: NoteData = {
                    _id: data.note._id,
                    title: latestTitle,
                    content: latestTextValue,
                };

                setNotes((prevNotes) => [...prevNotes, newNote]);
                setTitle("");
                setTextValue("");
            } catch (err) {
                console.error("Error saving note:", err);
            } finally {
                setSaving(false);
            }
        }
    };



    const openNote = (note: NoteData) => setSelectedNote(note);

    const closeNote = () => setSelectedNote(null);

    const handleChange = (key: "title" | "content", value: string) => {
        if (selectedNote) {
            setSelectedNote({ ...selectedNote, [key]: value });
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    useEffect(() => {
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        titleRef.current = title;
    }, [title]);

    useEffect(() => {
        textValueRef.current = textValue;
    }, [textValue]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
            const maxHeight = 25 * 20;
            if (textareaRef.current.scrollHeight > maxHeight) {
                textareaRef.current.style.overflowY = "auto";
                textareaRef.current.style.height = `${maxHeight}px`;
            } else {
                textareaRef.current.style.overflowY = "hidden";
            }
        }
    }, [textValue]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="relative bg-[#202124] min-h-screen text-[#E8EAED] p-4">
            <div
                ref={noteRef}
                className="absolute top-[20%] left-1/2 w-1/3 -translate-x-1/2 p-1 bg-[#202124] shadow-[0_6px_18px_4px_rgba(0,0,0,0.3)] rounded-xl text-gray-300 border border-[#969696] flex flex-col"
            >
                <form action="" className="flex flex-col">
                    {isTitleVisible && (
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value.trimStart())}
                            placeholder="Title"
                            className="w-full p-1 bg-transparent border-none outline-none text-lg font-semibold text-[#E8EAED] mb-2"
                        />
                    )}
                    <textarea
                        ref={textareaRef}
                        placeholder="Take a note..."
                        value={textValue}
                        onChange={(e) => setTextValue(e.target.value.trimStart())}
                        onClick={handleNoteClick}
                        className="w-full p-1 bg-transparent border-none outline-none resize-none text-sm text-[#E8EAED] mb-2"
                        rows={2}
                    ></textarea>
                </form>
            </div>
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
                            onChange={(e) => handleChange("title", e.target.value)}
                            className="w-full bg-transparent text-lg font-semibold mb-4 outline-none border-none text-[#E8EAED]"
                            placeholder="Title"
                        />
                        <textarea
                            value={selectedNote.content}
                            onChange={(e) => handleChange("content", e.target.value)}
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

export default NotesApp;
