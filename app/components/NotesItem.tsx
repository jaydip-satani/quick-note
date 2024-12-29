'use client'
import { useContext, useState } from "react";
import { NoteContext } from "../context/notes/noteState";

export interface Note {
    _id: string;
    noteTitle: string;
    noteData: string;
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

    // Open the note editor
    const openNote = (note: Note) => setSelectedNote(note);

    // Close the note editor, update the note and send it to the API
    const closeNote = async () => {
        if (selectedNote) {
            // Call the API to update the note when it's closed
            await updateNotes(selectedNote);
        }
        setSelectedNote(null);  // Close the note editor
    };

    // Handle changes in the note (Title or Data)
    const handleChange = (key: 'noteTitle' | 'noteData', value: string) => {
        if (selectedNote) {
            setSelectedNote({ ...selectedNote, [key]: value });
        }
    };

    return (
        <>
            <div
                onClick={() => openNote(note)}
                className="p-4 bg-[#202124] h-40 shadow-[0_6px_18px_4px_rgba(0,0,0,0.3)] rounded-xl overflow-auto border border-[#696969] text-[#E8EAED] cursor-pointer"
            >
                <h3 className="w-full text-lg font-semibold mb-2">{note.noteTitle}</h3>
                <p className="w-full overflow-hidden whitespace-nowrap text-ellipsis">
                    {note.noteData.length > 70 ? `${note.noteData.slice(0, 70)}...` : note.noteData}
                </p>
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
