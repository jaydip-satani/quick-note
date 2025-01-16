'use client';

import React, { useContext, useEffect } from 'react';
import NotesItem from '../components/NotesItem';
import { NoteContext } from '../context/notes/noteState';


const NotesPage: React.FC = () => {
    const context = useContext(NoteContext);
    if (!context) {
        throw new Error('NoteContext is not provided. Ensure Notes is wrapped in NoteState.');
    }
    const { notes, getAllNotes } = context;
    useEffect(() => {
        getAllNotes()
    }, [getAllNotes])
    return (
        <>

            {notes
                .filter((note) => note.archive)
                .sort((a, b) => Number(b.pinned) - Number(a.pinned))
                .map((note) => (
                    <NotesItem key={note._id} note={note} />
                ))}

        </>
    );
};

export default NotesPage;
