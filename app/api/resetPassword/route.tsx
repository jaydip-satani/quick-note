import { NextResponse } from 'next/server';
import dbConnect from '@/middleware/connect';
import jwt from 'jsonwebtoken';
import User from '@/models/User';
import bcrypt from "bcryptjs";

const jwtSignKey = process.env.NEXT_PUBLIC_JWT_EMAIL as string;

export async function POST(req: Request) {
    try {
        const { token, newPassword } = await req.json();
        if (!token && !newPassword) {
            return NextResponse.json({ error: 'No token or password provided' }, { status: 400 });
        }
        await dbConnect();
        try {
            const data: any = jwt.verify(token, jwtSignKey);
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            const updateData = await User.findOneAndUpdate(
                { email: data.email }, { $set: { password: hashedPassword } }, { new: true }
            )
            if (!updateData) {
                return NextResponse.json(
                    { error: 'User not found or password update failed' },
                    { status: 404 }
                );
            }
            return NextResponse.json(
                { message: 'Password updated successfully' },
                { status: 200 }
            );

        } catch (error) {
            return NextResponse.json(
                { error: "Please authenticate using a valid token" },
                { status: 401 }
            );
        }
    } catch (error: any) {
        console.log(error.message);
        return NextResponse.json({ error: `Some error occurred: ${error.message}` }, { status: 400 });
    }
}
