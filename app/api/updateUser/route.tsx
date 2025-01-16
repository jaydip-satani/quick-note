import { NextResponse } from 'next/server';
import { fetchUser } from '../fetchUser';
import dbConnect from '@/middleware/connect';
import User from '@/models/User';

export async function POST(req: Request) {
    try {
        const user = await fetchUser(req);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 400 });
        } if (user instanceof NextResponse) {
            return user;
        }

        const { name, profilePhoto } = await req.json();

        if (!name && !profilePhoto) {
            return NextResponse.json({ error: 'No name or profile photo provided' }, { status: 400 });
        }

        await dbConnect();

        const userData = await User.findById(user.id);
        if (!userData) {
            return NextResponse.json({ error: 'User not found in the database' }, { status: 404 });
        }

        if (name) {
            userData.name = name;
        }
        if (profilePhoto) {
            userData.profilePhoto = profilePhoto;
        }
        await userData.save();

        return NextResponse.json({ name: userData.name, email: userData.email, profilePhoto: userData.profilePhoto });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: `Some error occurred: ${error}` }, { status: 400 });
    }
}
