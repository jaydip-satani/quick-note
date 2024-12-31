'use client';
import { useContext, useState } from "react";
import { NoteContext } from "../context/notes/noteState";
import Image from "next/image";
import pin from '@/assets/pin.svg';
import pinned from '@/assets/pinned.svg';
export interface Note {
    _id: string;
    noteTitle: string;
    noteData: string;
    pinned: boolean;
}

interface NotesItemProps {
    note: Note;
}

const NotesItem: React.FC<NotesItemProps> = ({ note }) => {
    const context = useContext(NoteContext);
    if (!context) {
        throw new Error('NoteContext is not provided. Ensure Notes is wrapped in NoteProvider.');
    }

    const { updateNotes } = context;
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);

    const openNote = (note: Note) => setSelectedNote(note);

    const closeNote = async () => {
        if (selectedNote) {
            await updateNotes(selectedNote);
        }
        setSelectedNote(null);
    };

    const handleChange = (key: 'noteTitle' | 'noteData', value: string) => {
        if (selectedNote) {
            setSelectedNote({ ...selectedNote, [key]: value });
        }
    };

    const togglePin = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const updatedNote = { ...note, pinned: note.pinned ? false : true };
        try {
            await updateNotes(updatedNote);
        } catch (error) {
            console.error("Error updating pinned status:", error);
        }
    };

    return (
        <>
            <div
                onClick={() => openNote(note)}
                className={`p-4 h-40 shadow-[0_6px_18px_4px_rgba(0,0,0,0.3)] rounded-xl overflow-auto border text-[#E8EAED] cursor-pointer ${note.pinned ? '' : 'bg-[#202124] border-[#696969]'
                    }`}
            >
                <div className="flex justify-between items-center cursor-text">
                    <h3 className="text-lg font-semibold mb-2 ">{note.noteTitle}</h3>
                    <div
                        onClick={togglePin}
                        className="text-sm rounded text-[#E8EAED] inline-block cursor-pointer"
                    >
                        {note.pinned ? <Image src={pinned} alt="" /> : <Image src={pin} alt="" />}
                    </div>
                </div>
                <textarea
                    readOnly
                    value={note.noteData.length > 70 ? `${note.noteData.slice(0, 70)}...` : note.noteData}
                    className="w-full overflow-hidden text-ellipsis resize-none bg-transparent border-none text-inherit focus:outline-none"
                />
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
                            value={selectedNote.noteTitle}
                            onChange={(e) => handleChange('noteTitle', e.target.value)}
                            className="w-full bg-transparent text-lg font-semibold mb-4 outline-none border-none text-[#E8EAED]"
                            placeholder="Title"
                        />
                        <textarea
                            value={selectedNote.noteData}
                            onChange={(e) => handleChange('noteData', e.target.value)}
                            rows={10}
                            className="w-full bg-transparent resize-none outline-none border-none text-[#E8EAED]"
                            placeholder="Take a note..."
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default NotesItem;
