import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('authToken');

    const staticAssetsRegex = /\/(_next\/|static\/|favicon\.ico|.*\.(css|js|png|jpg|jpeg|svg))/;
    const apiRoutesRegex = /^\/api\//;

    if (staticAssetsRegex.test(pathname) || apiRoutesRegex.test(pathname)) {
        return NextResponse.next();
    }
    const publicPaths = ['/auth/login', '/auth/signup', '/auth/forgot-password', '/auth/verification'];

    if (publicPaths.includes(pathname) || token) {
        return NextResponse.next();
    }

    return NextResponse.redirect(new URL('/auth/login', request.url));
}

export const config = {
    matcher: ['/:path*'],
};
