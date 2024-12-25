import { NextResponse } from 'next/server';
import dbConnect from '@/middleware/connect';
import Notes from '@/models/Notes';
import User from '@/models/User';
import mongoose from 'mongoose';
export async function POST(request: Request) {
    try {
        const { userId, noteTitle, noteData } = await request.json();
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return NextResponse.json({ message: 'Invalid User ID' }, { status: 401 });
        }
        dbConnect();
        const userExists = await User.findById(userId);
        if (!userExists) {
            return NextResponse.json(
                { message: 'User does not exist' },
                { status: 400 }
            );
        }

        const note = new Notes({
            userId,
            noteTitle,
            noteData
        });
        const savedNote = await note.save();
        return NextResponse.json({ message: 'Note add succesfully' }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Failed to create note', error: error }, { status: 400 });
    }
}
