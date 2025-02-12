import { NextResponse } from 'next/server';
import dbConnect from '@/middleware/connect';
import User from '@/models/User'
import arcjet, { validateEmail } from "@arcjet/next";
import bcrypt from "bcryptjs";
import validator from "validator";
const aj = arcjet({
    key: process.env.ARCJET_KEY!,
    rules: [
        validateEmail({
            mode: "LIVE",
            deny: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
        }),
    ],
});
export async function POST(request: Request) {
    try {
        const { name, email, password, confirmPassword } = await request.json();
        const validEmail = email.trim().toLowerCase();
        const decision = await aj.protect(request, {
            email: validEmail,
        });
        if (decision.isDenied()) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        if (password !== confirmPassword) {
            return NextResponse.json(
                { error: "Password Doesn't Match" },
                { status: 400 }
            );
        }
        if (!validator.isEmail(validEmail)) {
            return NextResponse.json(
                { error: "Invalid email format" },
                { status: 400 }
            );
        }
        if (!name || !validEmail || !password) {
            return NextResponse.json({
                error: "Please provide all details correctly"
            }, {
                status: 400
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt);

        await dbConnect();

        const newUser = new User({
            name,
            email: validEmail,
            password: hashedPassword,
            securePin: hashedPassword,
        });
        await newUser.save();
        return NextResponse.json({ message: 'User created Successfully' }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Failed to create user', error: error }, { status: 400 });
    }
}
