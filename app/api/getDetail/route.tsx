import { NextResponse } from 'next/server';
import Notes from '@/models/Notes';
import { fetchUser } from '../fetchUser';
import dbConnect from '@/middleware/connect';
import User from '@/models/User';

export async function POST(req: Request) {
    try {
        const user = await fetchUser(req);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 400 });
        }
        dbConnect()
        const userData = await User.findById({ _id: user.id });
        return NextResponse.json({ name: userData.name, email: userData.email, profilePhoto: userData.profilePhoto });
    } catch (error: any) {
        console.log(error.message);
        return NextResponse.json({ error: `Some error occurred: ${error.message}` }, { status: 400 });
    }
}
