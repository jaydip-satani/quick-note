import { NextResponse } from 'next/server';
import dbConnect from '@/middleware/connect';
import Notes, { INotes } from '@/models/Notes';
import mongoose from 'mongoose';
import { fetchUser } from '../../fetchUser';
interface CustomRouteContext {
    params: Promise<{ _id: string }>;
}

export async function PUT(
    request: Request,
    context: CustomRouteContext
) {
    const { _id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return NextResponse.json({ message: 'Invalid User ID' }, { status: 400 });
    }

    try {
        // Get the body of the PUT request
        const { noteTitle, noteData, pinned, archive, secureNote, bin } = await request.json();

        await dbConnect();

        // Check if note exists
        const existingNote = await Notes.findById(_id);
        if (!existingNote) {
            return NextResponse.json({ message: 'Note not found' }, { status: 404 });
        }

        // Fetch the user
        const user = await fetchUser(request);
        if (user instanceof NextResponse) {
            return user; // Forward error if user verification fails
        }

        // Ensure the user is the owner of the note
        if (existingNote.userId.toString() !== user.id) {
            return NextResponse.json({ error: 'Not Allowed' }, { status: 401 });
        }

        // Prepare the fields to be updated
        const updatedFields: Partial<INotes> = {};
        if (noteTitle) updatedFields.noteTitle = noteTitle;
        if (noteData) updatedFields.noteData = noteData;
        if (typeof pinned === 'boolean') updatedFields.pinned = pinned;
        if (typeof archive === 'boolean') updatedFields.archive = archive;
        if (typeof secureNote === 'boolean') updatedFields.secureNote = secureNote;
        if (typeof bin === 'boolean') updatedFields.bin = bin;

        // Update the note
        const updatedNote = await Notes.findByIdAndUpdate(_id, { $set: updatedFields }, { new: true });
        if (!updatedNote) {
            return NextResponse.json({ message: 'Note could not be updated' }, { status: 404 });
        }

        // Return the updated note
        return NextResponse.json({ updatedNote }, { status: 200 });
    } catch (error) {
        console.error('Error updating note:', error);
        return NextResponse.json({ message: 'Failed to update note', error }, { status: 500 });
    }
}
