'use client'
import React, { useState, useEffect, useRef } from 'react';
import '../globals.css'

const Notes: React.FC = () => {
    const [isTitleVisible, setIsTitleVisible] = useState(false);
    const [textValue, setTextValue] = useState('');
    const noteRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleNoteClick = () => {
        setIsTitleVisible(true);
    };

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTextValue(event.target.value);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (noteRef.current && !noteRef.current.contains(event.target as Node)) {
            setIsTitleVisible(false);
            setTextValue('');
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

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
                        placeholder="Title"
                        className="w-full p-1 bg-transparent border-none outline-none text-lg font-semibold text-[#E8EAED] mb-2"
                    />
                )}
                <textarea
                    ref={textareaRef}
                    placeholder="Take a note..."
                    value={textValue}
                    onChange={handleChange}
                    onClick={handleNoteClick}
                    className="w-full p-1 bg-transparent border-none outline-none resize-none text-sm text-[#E8EAED] mb-2"
                    rows={2}
                ></textarea>
            </form>
        </div>
    );
};

export default Notes;
