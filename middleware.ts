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

    if (staticAssetsRegex.test(pathname) || apiRoutesRegex.test(pathname)) {
        return NextResponse.next();
    }

    const publicPaths = ['/auth/login', '/auth/signup', '/auth/forgot-password', '/auth/verification'];

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
