import { NextResponse } from 'next/server';
import bcrypt from "bcryptjs";
import validator from "validator";
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import dbConnect from '@/middleware/connect';
export async function POST(request: Request) {
    const JWT_TOKEN = process.env.JWT_SIGN;
    if (!JWT_TOKEN) {
        return NextResponse.json({ message: 'JWT_SIGN environment variable is not defined' }, { status: 500 });
    }
    try {
        const { email, password } = await request.json();
        const validEmail = email.trim().toLowerCase();
        if (!validator.isEmail(validEmail)) {
            return NextResponse.json(
                { error: "Invalid email format" },
                { status: 400 }
            );
        }
        dbConnect();
        let user = await User.findOne({ email: validEmail })
        if (!user) {
            return NextResponse.json({ message: 'Incorrect credential' }, { status: 400 });
        }
        const comparePassword = await bcrypt.compare(password, user.password)
        if (!comparePassword) {
            return NextResponse.json({ message: 'Incorrect credential' }, { status: 400 });
        }
        if (!user.verified) {
            return NextResponse.json({ message: 'Account not verified' }, { status: 307 });
        }
        const data = {
            user: {
                id: user._id
            }
        }
        const authtoken = jwt.sign(data, JWT_TOKEN);
        return NextResponse.json({ authtoken }, { status: 200 });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: 'Invalid request', error: error }, { status: 400 });
    }
}