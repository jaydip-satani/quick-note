import { NextResponse } from 'next/server';
import Notes from '@/models/Notes';
import { fetchUser } from '../fetchUser';
import dbConnect from '@/middleware/connect';

export async function GET(req: Request) {
    try {
        const user = await fetchUser(req);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 400 });
        } if (user instanceof NextResponse) {
            return user;
        }
        dbConnect()
        const notes = await Notes.find({ userId: user.id });
        return NextResponse.json(notes);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: `Some error occurred: ${error}` }, { status: 400 });
    }
}
