'use client';
import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import '../globals.css';
import { NoteContext } from '../context/notes/noteState';

const Notes: React.FC = () => {
    const [isTitleVisible, setIsTitleVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [textValue, setTextValue] = useState('');
    const noteRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const context = useContext(NoteContext);
    if (!context) {
        throw new Error('NoteContext is not provided. Ensure Notes is wrapped in NoteProvider.');
    }
    const { addNotes } = context;

    const getAuthToken = (): string | null => {
        const match = document.cookie.match(new RegExp('(^| )authToken=([^;]+)'));
        return match ? match[2] : null;
    };

    const handleNoteClick = () => setIsTitleVisible(true);

    const handleClickOutside = useCallback(async (event: MouseEvent) => {
        if (noteRef.current && !noteRef.current.contains(event.target as Node)) {
            setIsTitleVisible(false);
            const latestTitle = title.trim();
            const latestTextValue = textValue.trim();

            if (latestTextValue && latestTitle) {
                const token = getAuthToken();
                if (!token) {
                    return;
                }
                const newNote = {
                    _id: "",
                    noteTitle: latestTitle,
                    noteData: latestTextValue,
                    pinned: false,
                    archive: false,
                    secureNote: false,
                    bin: false
                };
                addNotes(newNote);
                setTitle('');
                setTextValue('');
            }
        }
    }, [title, textValue]);

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [handleClickOutside]);


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
        <div ref={noteRef} className="absolute top-[20%] left-1/2 w-1/3 -translate-x-1/2 p-1 bg-[#202124] shadow-[0_6px_18px_4px_rgba(0,0,0,0.3)] rounded-md text-gray-300 border border-[#969696] flex flex-col">
            <div className="flex flex-col">
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
                    className="w-full p-1 font-bold bg-transparent border-none outline-none resize-none text-sm text-[#E8EAED] mb-2"
                    rows={1}
                ></textarea>
            </div>
        </div>
    );
};

export default Notes;
