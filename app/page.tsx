'use client'
import NotesItem from "./components/NotesItem";
import { useContext, useEffect } from "react";
import { NoteContext } from "./context/notes/noteState";
import NoteState from "./context/notes/noteState";
import Notes from "./components/Notes";

export default function Home() {
  return (
    <NoteState>
      <NotesList />
      <Notes />
    </NoteState >
  );
}


const NotesList = () => {
  const context = useContext(NoteContext);
  if (!context) {
    throw new Error('NoteContext is not provided. Ensure Notes is wrapped in NoteState.');
  }
  const { notes, getAllNotes } = context;
  useEffect(() => {
    getAllNotes()
  }, [])
  return (
    <>
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="absolute w-[90%] max-w-[1000px] top-[40%] bg-[#202124] text-[#E8EAED] p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {['pinned', 'unpinned'].map((status) => {
              const isPinned = status === 'pinned';
              return notes
                .filter((note) =>
                  !note.secureNote &&
                  !note.bin &&
                  !note.archive &&
                  (isPinned ? note.pinned : !note.pinned)
                )
                .map((note) => (
                  <NotesItem key={note._id} note={note} />
                ));
            })}

          </div>
        </div>
      </div>
    </>
  );


};
