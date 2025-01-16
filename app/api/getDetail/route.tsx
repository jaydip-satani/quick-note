import { NextResponse } from 'next/server';
import { fetchUser } from '../fetchUser';
import dbConnect from '@/middleware/connect';
import User from '@/models/User';

export async function POST(req: Request) {
    try {
        const user = await fetchUser(req);
        if (user instanceof NextResponse) {
            return user;
        }
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 400 });
        }
        dbConnect()
        const userData = await User.findById({ _id: user.id });
        return NextResponse.json({ name: userData.name, email: userData.email, profilePhoto: userData.profilePhoto });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: `Some error occurred: ${error}` }, { status: 400 });
    }
}
