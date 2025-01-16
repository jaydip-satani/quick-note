import { NextResponse } from 'next/server';
import dbConnect from '@/middleware/connect';
import User from '@/models/User'
import bcrypt from "bcryptjs";
import { fetchUser } from '../fetchUser';
export async function POST(request: Request) {
    try {

        const { securePin, newSecurePin, confirmNewSecurePin } = await request.json();
        if (newSecurePin !== confirmNewSecurePin) {
            return NextResponse.json(
                { error: "Pin Doesn't Match" },
                { status: 400 }
            );
        }
        if (!securePin || !newSecurePin || !confirmNewSecurePin) {
            return NextResponse.json({
                error: "Please provide all details correctly"
            }, {
                status: 400
            })
        }
        const user = await fetchUser(request);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 400 });
        }
        if (user instanceof NextResponse) {
            return user;
        }
        await dbConnect()
        const sPin = await User.findById(user.id)
        const comparePassword = await bcrypt.compare(securePin, sPin.securePin)
        if (!comparePassword) {
            return NextResponse.json({ message: 'Incorrect credential' }, { status: 400 });
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newSecurePin, salt);


        const newPin = await User.findOneAndUpdate(
            { _id: user.id },
            { $set: { securePin: hashedPassword } },
            { new: true }
        ); if (!newPin) {
            return NextResponse.json(
                { message: 'Pin not updated try again later..' },
                { status: 404 }
            );
        }
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Failed to change pin', error: error }, { status: 400 });
    }
}
