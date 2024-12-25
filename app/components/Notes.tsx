'use client';
import React, { useState, useEffect, useRef } from 'react';
import '../globals.css';
import jwt from 'jsonwebtoken';

const Notes: React.FC = () => {
    const [isTitleVisible, setIsTitleVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [textValue, setTextValue] = useState('');
    const noteRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const titleRef = useRef<string>('');
    const textValueRef = useRef<string>('');

    const getAuthToken = (): string | null => {
        const match = document.cookie.match(new RegExp('(^| )authToken=([^;]+)'));
        return match ? match[2] : null;
    };

    const handleNoteClick = () => {
        setIsTitleVisible(true);
    };

    const handleClickOutside = async (event: MouseEvent) => {
        if (noteRef.current && !noteRef.current.contains(event.target as Node)) {
            setIsTitleVisible(false);
            const latestTitle = titleRef.current.trim();
            const latestTextValue = textValueRef.current.trim();

            if (latestTextValue && latestTitle) {
                try {
                    const token = getAuthToken();
                    if (!token) {
                        console.error('No auth token found');
                        return;
                    }

                    const decodedToken = jwt.decode(token) as { user?: { id?: string } };
                    const userId = decodedToken?.user?.id;

                    if (!userId) {
                        console.error('Invalid or missing user ID in token');
                        return;
                    }
                    const response = await fetch('/api/addNotes', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ userId, noteTitle: latestTitle, noteData: latestTextValue }),
                    });

                    if (!response.ok) {
                        throw new Error('Failed to save note');
                    }

                    const data = await response.json();
                    if (data) {
                        setTitle('');
                        setTextValue('');
                    }
                } catch (err) {
                    console.error('Error saving note:', err);
                }
            }
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
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
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
            const maxHeight = 25 * 20;
            if (textareaRef.current.scrollHeight > maxHeight) {
                textareaRef.current.style.overflowY = 'auto';
                textareaRef.current.style.height = `${maxHeight}px`;
            } else {
                textareaRef.current.style.overflowY = 'hidden';
            }
        }
    }, [textValue]);

    return (
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
    );
};

export default Notes;
