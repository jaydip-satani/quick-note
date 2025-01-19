import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const jwtSignKey = new TextEncoder().encode(process.env.JWT_SIGN);

const validateToken = async (token: string): Promise<boolean> => {
    try {
        const { payload } = await jwtVerify(token, jwtSignKey);
        return !!payload;
    } catch (error) {
        console.error("Token validation error:", error);
        return false;
    }
};

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('authToken')?.value;

    const staticAssetsRegex = /\/(_next\/|static\/|favicon\.ico|.*\.(css|js|png|jpg|jpeg|svg))/;
    const apiRoutesRegex = /^\/api\//;

    if (apiRoutesRegex.test(pathname)) {
        const response = NextResponse.next();

        response.headers.set('Access-Control-Allow-Origin', '*');
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        if (request.method === 'OPTIONS') {
            return new NextResponse(null, { status: 204 });
        }

        return response;
    }

    if (staticAssetsRegex.test(pathname)) {
        return NextResponse.next();
    }

    const publicPaths = [
        '/auth/login',
        '/auth/signup',
        '/auth/forgot-password',
        '/auth/verification',
        '/resetPassword',
        '/'
    ];

    if (publicPaths.includes(pathname)) {
        return NextResponse.next();
    }

    if (!token) {
        console.log("No token found. Redirecting to login.");
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    const isValid = await validateToken(token);
    if (!isValid) {
        console.log("Invalid token. Redirecting to login.");
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/:path*'],
};
