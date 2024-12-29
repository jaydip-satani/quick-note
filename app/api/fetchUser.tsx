import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const jwtSignKey = process.env.JWT_SIGN as string;

export const fetchUser = async (req: Request) => {
    const token = req.headers.get('auth-token');

    if (!token) {
        return NextResponse.json(
            { error: "Please authenticate using a valid token" },
            { status: 401 }
        );
    }

    try {
        const data: any = jwt.verify(token, jwtSignKey);
        return data.user;
    } catch (error) {
        return NextResponse.json(
            { error: "Please authenticate using a valid token" },
            { status: 401 }
        );
    }
};
