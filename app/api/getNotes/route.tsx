// import { NextResponse } from 'next/server';
// import dbConnect from '@/middleware/connect';
// import Notes from '@/models/Notes';
// import User from '@/models/User';
// import mongoose from 'mongoose';
// export async function POST(request: Request) {
//     try {
//         const { userId } = await request.json();
//         if (!mongoose.Types.ObjectId.isValid(userId)) {
//             return NextResponse.json({ message: 'Invalid User ID' }, { status: 401 });
//         }
//         dbConnect();
//         const userExists = await User.findById(userId);
//         if (!userExists) {
//             return NextResponse.json(
//                 { message: 'User does not exist' },
//                 { status: 400 }
//             );
//         }
//         const notes = await Notes.find({ userId });
//         return NextResponse.json({ notes }, { status: 200 });
//     } catch (error) {
//         console.log(error);
//         return NextResponse.json({ message: 'Failed to create note', error: error }, { status: 400 });
//     }
// }
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
