import { NextResponse } from 'next/server';
import Notes from '@/models/Notes';
import { fetchUser } from '../fetchUser';
import dbConnect from '@/middleware/connect';

export async function GET(req: Request) {
    try {
        const user = await fetchUser(req);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 400 });
        }
        dbConnect()
        const notes = await Notes.find({ userId: user.id });
        return NextResponse.json(notes);
    } catch (error: any) {
        console.log(error.message);
        return NextResponse.json({ error: `Some error occurred: ${error.message}` }, { status: 400 });
    }
}
