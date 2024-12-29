// import { NextResponse } from 'next/server';
// import dbConnect from '@/middleware/connect';
// import Notes from '@/models/Notes';
// import User from '@/models/User';
// import mongoose from 'mongoose';
// export async function POST(request: Request) {
//     try {
//         const { userId, noteTitle, noteData } = await request.json();
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

//         const note = new Notes({
//             userId,
//             noteTitle,
//             noteData
//         });
//         const savedNote = await note.save();
//         return NextResponse.json({ message: 'Note add succesfully', note: savedNote }, { status: 200 });
//     } catch (error) {
//         console.log(error);
//         return NextResponse.json({ message: 'Failed to create note', error: error }, { status: 400 });
//     }
// }
import { NextResponse } from 'next/server';
import dbConnect from '@/middleware/connect';  // Adjust the import to match your project structure
import Notes from '@/models/Notes';  // Adjust your Notes model import
import { fetchUser } from '../fetchUser';  // Adjust to the correct middleware import

export async function POST(request: Request) {
    try {
        const { noteTitle, noteData } = await request.json();

        if (!noteTitle || noteTitle.length < 3) {
            return NextResponse.json({ error: 'Enter a valid title (at least 3 characters)' }, { status: 400 });
        }

        if (!noteData || noteData.length < 2) {
            return NextResponse.json({ error: 'Enter a valid description (at least 2 characters)' }, { status: 400 });
        }

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
