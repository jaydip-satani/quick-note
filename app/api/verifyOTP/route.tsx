import { NextResponse } from 'next/server';
import User from '@/models/User';
import dbConnect from '@/middleware/connect';

export async function POST(request: Request) {
    try {
        const { decodedToken, otp } = await request.json();

        await dbConnect();

        const user = await User.findOne({ email: decodedToken });
        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }

        const checkedOtp = user.otp;
        if (otp == checkedOtp) {
            await User.updateOne(
                { email: decodedToken },
                {
                    $set: {
                        verified: true
                    }
                }
            );
            return NextResponse.json({ success: true }, { status: 200 });
        } else {
            return NextResponse.json({ success: false, message: 'Invalid OTP' }, { status: 400 });
        }
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ message: 'Invalid request', error: error.message }, { status: 400 });
    }
}
