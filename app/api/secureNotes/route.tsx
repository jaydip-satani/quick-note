import { NextResponse } from 'next/server';
import bcrypt from "bcryptjs";
import User from '@/models/User';
import dbConnect from '@/middleware/connect';
import { fetchUser } from '../fetchUser';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
export async function POST(req: Request) {
    const JWT_TOKEN = process.env.JWT_SIGN;
    if (!JWT_TOKEN) {
        return NextResponse.json({ message: 'JWT_SIGN environment variable is not defined' }, { status: 500 });
    }
    await dbConnect();
    const userId = await fetchUser(req)
    try {
        const { passcode } = await req.json();
        let user = await User.findOne({ _id: userId.id })
        if (!user) {
            return NextResponse.json({ message: 'Incorrect credential' }, { status: 400 });
        }
        const comparePassword = await bcrypt.compare(passcode, user.securePin)
        if (!comparePassword) {
            return NextResponse.json({ message: 'Incorrect credential' }, { status: 400 });
        }
        if (!user.verified) {
            return NextResponse.json({ message: 'Account not verified' }, { status: 400 });
        }
        const secureToken = crypto.randomBytes(32).toString('hex');
        const code = {
            user: {
                id: user._id
            }
        };
        const sToken = jwt.sign(code, JWT_TOKEN);
        return NextResponse.json({ secureToken, sToken }, { status: 200 });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: 'Invalid request', error: error }, { status: 400 });
    }
}