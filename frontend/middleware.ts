import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const role = request.cookies.get('role')?.value;
    const path = request.nextUrl.pathname;

    // Allow login page without token
    if (path === '/login') {
        if (token) {
            if (role === 'ADMIN') return NextResponse.redirect(new URL('/admin', request.url));
            if (role === 'TEACHER') return NextResponse.redirect(new URL('/teacher', request.url));
            return NextResponse.redirect(new URL('/student', request.url));
        }
        return NextResponse.next();
    }

    // No token → redirect to login
    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Role based protection → redirect to own dashboard
    if (path.startsWith('/admin') && role !== 'ADMIN') {
        if (role === 'TEACHER') return NextResponse.redirect(new URL('/teacher', request.url));
        return NextResponse.redirect(new URL('/student', request.url));
    }

    if (path.startsWith('/teacher') && role !== 'TEACHER' && role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/student', request.url));
    }

    if (path.startsWith('/student') && role !== 'STUDENT') {
        if (role === 'TEACHER') return NextResponse.redirect(new URL('/teacher', request.url));
        return NextResponse.redirect(new URL('/admin', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/student/:path*', '/teacher/:path*', '/admin/:path*', '/login']
};