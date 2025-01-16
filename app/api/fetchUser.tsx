import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const jwtSignKey = process.env.JWT_SIGN as string;

interface JwtPayload {
    user: {
        id: string;
    };
    iat: number;
}
export const fetchUser = async (req: Request) => {
    const token = req.headers.get('auth-token');

    if (!token) {
        return NextResponse.json(
            { error: "Please authenticate using a valid token" },
            { status: 401 }
        );
    }

    try {
        const data = jwt.verify(token, jwtSignKey) as JwtPayload;
        return data.user;
    } catch (error) {
        return NextResponse.json(
            { error: "Please authenticate using a valid token" + error },
            { status: 401 }
        );
    }
};
