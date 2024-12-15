'use client';
import React, { useState } from 'react';

interface NoteData {
    id: number;
    title: string;
    content: string;
}

const Note: React.FC = () => {
    const [selectedNote, setSelectedNote] = useState<NoteData | null>(null);
    const [notes, setNotes] = useState<NoteData[]>(
        [...Array(50)].map((_, index) => ({
            id: index + 1,
            title: `Note Title ${index + 1}`,
            content: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quidem voluptatem consequatur sed laborum vitae porro expedita molestiae, reiciendis, ratione totam saepe necessitatibus aspernatur voluptatibus. Non, aspernatur delectus sint aliquam iure eos illo commodi, impedit nam obcaecati quasi assumenda ab quibusdam, voluptatibus voluptatum! Corrupti, pariatur! Deserunt sequi voluptas iure? Obcaecati voluptatum nam molestiae non est. Veniam ullam, eos, quis cum rem quidem neque molestias eligendi magnam repudiandae nostrum! Quasi, recusandae vero! Eaque libero, sint optio quos corrupti incidunt blanditiis. Laudantium blanditiis odio accusantium iste deleniti id aliquid dignissimos quisquam, non dolor? Ad quo ut error voluptates laudantium at officiis fuga deserunt.",
        }))
    );

    const openNote = (note: NoteData) => setSelectedNote(note);

    const closeNote = () => setSelectedNote(null);

    const handleChange = (key: 'title' | 'content', value: string) => {
        if (selectedNote) {
            setSelectedNote({ ...selectedNote, [key]: value });
        }
    };

    return (
        <div className="relative bg-[#202124] min-h-screen text-[#E8EAED] p-4">
            <div
                className="absolute top-[40%] left-[50%] transform -translate-x-[50%] 
                w-[90%] max-w-[1000px] bg-[#202124] shadow-md rounded-xl border border-[#969696] p-4 overflow-y-auto"
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                    {notes.map((note) => (
                        <div
                            key={note.id}
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
                    className="fixed inset-0 flex items-center backdrop-blur-sm justify-center bg-black bg-opacity-70 z-50"
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
            )
            }
        </div >
    );
};

export default Note;
