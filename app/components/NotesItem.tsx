'use client';
import { useContext, useState } from "react";
import { NoteContext } from "../context/notes/noteState";
import Image from "next/image";
import pin from '@/assets/pin.svg';
import pinned from '@/assets/pinned.svg';
import archive from '@/assets/archive.svg';
export interface Note {
    _id: string;
    noteTitle: string;
    noteData: string;
    pinned: boolean;
    archive: boolean;
    secureNote: boolean;
    bin: boolean;
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
    const toggleArchive = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const updatedNote = { ...note, archive: note.archive ? false : true };
        try {
            await updateNotes(updatedNote);
        } catch (error) {
            console.error("Error updating archive status:", error);
        }
    };
    const toggleBin = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const updatedNote = { ...note, bin: note.bin ? false : true };
        try {
            await updateNotes(updatedNote);
        } catch (error) {
            console.error("Error updating bin status:", error);
        }
    };

    const addSecure = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const updatedNote = { ...note, secureNote: true };
        try {
            await updateNotes(updatedNote);
        } catch (error) {
            console.error("Error updating secure status:", error);
        }
    };


    return (
        <>
            <div
                onClick={() => openNote(note)}
                className={`relative p-4 h-40 shadow-[0_6px_18px_4px_rgba(0,0,0,0.3)] rounded-xl overflow-auto border text-[#E8EAED] cursor-pointer ${note.pinned ? '' : 'bg-[#202124] border-[#696969]'
                    } group`}
            >
                <div className="flex justify-between items-center cursor-text">
                    <h3 className="text-lg font-semibold mb-2">{note.noteTitle}</h3>
                    <div

                        className={`text-sm rounded text-[#E8EAED] inline-block cursor-pointer transition-opacity duration-300 ease-in-out ${note.pinned ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto'
                            }`}
                    >
                        <Image onClick={togglePin}
                            src={note.pinned ? pinned : pin}
                            className="transition-opacity duration-300 ease-in-out"
                            alt={note.pinned ? "pinned" : "pin"}
                        />
                    </div>


                </div>
                <textarea
                    readOnly
                    value={note.noteData.length > 70 ? `${note.noteData.slice(0, 70)}...` : note.noteData}
                    className="w-full overflow-hidden text-ellipsis resize-none bg-transparent border-none text-inherit focus:outline-none"
                />
                <div className="flex space-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                    <Image src={archive} onClick={toggleArchive} alt="archive" />
                    {!note.bin && <svg
                        onClick={toggleBin}
                        className="w-6 h-6 cursor-pointer"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                    >
                        <path fill="currentColor" d="M15 4V3H9v1H4v2h1v13c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V6h1V4h-5zm2 15H7V6h10v13z" />
                        <path fill="currentColor" d="M9 8h2v9H9zm4 0h2v9h-2z" />
                    </svg>}
                    <svg
                        onClick={addSecure}
                        xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" className="w-6 h-6 cursor-pointer" viewBox="0 0 48 48">
                        <path fill="currentColor" d="M 24.048828 2 A 1.50015 1.50015 0 0 0 22.998047 2.3847656 C 22.998047 2.3847656 15.490168 9 6.5 9 A 1.50015 1.50015 0 0 0 5 10.5 L 5 22.759766 C 5 29.437814 8.0894135 40.426402 23.417969 46.882812 A 1.50015 1.50015 0 0 0 24.582031 46.882812 C 39.910586 40.426403 43 29.437814 43 22.759766 L 43 10.5 A 1.50015 1.50015 0 0 0 41.5 9 C 32.509832 9 25.001953 2.3847656 25.001953 2.3847656 A 1.50015 1.50015 0 0 0 24.048828 2 z M 24 5.4277344 C 26.062966 7.0863651 32.111257 11.337189 40 11.875 L 40 22.759766 C 40 28.502023 37.793444 37.765684 24 43.826172 C 10.206556 37.765684 8 28.502023 8 22.759766 L 8 11.875 C 15.888743 11.337189 21.937034 7.0863651 24 5.4277344 z M 31.470703 17.986328 A 1.50015 1.50015 0 0 0 30.439453 18.439453 L 21.5 27.378906 L 17.560547 23.439453 A 1.50015 1.50015 0 1 0 15.439453 25.560547 L 20.439453 30.560547 A 1.50015 1.50015 0 0 0 22.560547 30.560547 L 32.560547 20.560547 A 1.50015 1.50015 0 0 0 31.470703 17.986328 z">
                        </path>
                    </svg>
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
