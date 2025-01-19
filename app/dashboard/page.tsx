'use client';
import React, { useContext, useEffect } from 'react';
import NotesItem from '../components/NotesItem';
import { NoteContext } from '../context/notes/noteState';
import NoteState from '../context/notes/noteState';
import Notes from '../components/Notes';

const Page: React.FC = () => {
  return (
    <NoteState>
      <NotesList />
      <Notes />
    </NoteState>
  );
};

const NotesList: React.FC = () => {
  const context = useContext(NoteContext);
  if (!context) {
    throw new Error('NoteContext is not provided. Ensure Notes is wrapped in NoteState.');
  }
  const { notes, getAllNotes } = context;

  useEffect(() => {
    getAllNotes();
  }, [getAllNotes]);

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {notes.length === 0}{
        <div className='m-auto font-bold'>No notes to display. Try adding some notes....</div>
      }
      <div className="absolute w-[90%] max-w-[1000px] top-[40%] bg-[#202124] text-[#E8EAED] p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">

          {['pinned', 'unpinned'].map((status) => {
            const isPinned = status === 'pinned';
            return notes
              .filter(
                (note) =>
                  !note.secureNote &&
                  !note.bin &&
                  !note.archive &&
                  (isPinned ? note.pinned : !note.pinned)
              )
              .map((note) => <NotesItem key={note._id} note={note} />);
          })}
        </div>
      </div>
    </div>
  );
};

export default Page;
