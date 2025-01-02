import { NextResponse } from 'next/server';
import dbConnect from '@/middleware/connect';
import Notes from '@/models/Notes';
import mongoose from 'mongoose';
import { fetchUser } from '../../fetchUser';
export async function PUT(request: Request, { params }: { params: { _id: string } }) {
    const { _id } = await params;
    try {
        const { noteTitle, noteData, pinned, archive, secureNote, bin } = await request.json();

        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return NextResponse.json({ message: 'Invalid User ID' }, { status: 400 });
        }
        await dbConnect();
        const userExists = await Notes.findById(_id);
        if (!userExists) {
            return NextResponse.json(
                { message: 'User does not exist' },
                { status: 404 }
            );
        }
        const user = await fetchUser(request);
        if (userExists.userId != user.id) {
            return NextResponse.json({ error: 'Not Allowed' }, { status: 401 });
        }
        const newNote: { noteTitle?: string; noteData?: string; pinned?: boolean; archive?: boolean; secureNote?: boolean; bin?: boolean; } = {};
        if (noteTitle) newNote.noteTitle = noteTitle;
        if (noteData) newNote.noteData = noteData;
        if (typeof pinned === 'boolean') newNote.pinned = pinned;
        if (typeof pinned === 'boolean') newNote.archive = archive;
        if (typeof pinned === 'boolean') newNote.secureNote = secureNote;
        if (typeof pinned === 'boolean') newNote.bin = bin;
        const updatedNote = await Notes.findOneAndUpdate(
            { _id: _id },
            { $set: newNote },
            { new: true }
        );
        if (!updatedNote) {
            return NextResponse.json(
                { message: 'Note not found or could not be updated' },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { updatedNote },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error updating note:', error);
        return NextResponse.json(
            { message: 'Failed to update note', error: error },
            { status: 500 }
        );
    }
}
