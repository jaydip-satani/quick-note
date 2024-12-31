import { NextResponse } from 'next/server';
import dbConnect from '@/middleware/connect';
import Notes from '@/models/Notes';
import { fetchUser } from '../fetchUser';

export async function POST(request: Request) {
    try {
        const { noteTitle, noteData } = await request.json();

        const user = await fetchUser(request);
        if (!user) {
            return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
        }

        await dbConnect();

        const note = new Notes({
            userId: user.id,
            noteTitle,
            noteData
        });

        const savedNote = await note.save();
        return NextResponse.json(savedNote, { status: 200 });
    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ error: 'Some error occurred: ' + error.message }, { status: 400 });
    }
}
