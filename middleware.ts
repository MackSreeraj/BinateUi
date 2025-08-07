import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

// Define public paths that don't require authentication
const publicPaths = ['/auth/login', '/auth/signup'];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Allow access to public paths without authentication
  if (publicPaths.includes(path)) {
    return NextResponse.next();
  }
  
  // Check for auth token in cookies
  const token = request.cookies.get('auth-token')?.value;
  
  // If no token is found, redirect to login
  if (!token) {
    const url = new URL('/auth/login', request.url);
    return NextResponse.redirect(url);
  }
  
  try {
    // Verify the token
    const session = await verifyToken(token);
    
    // If token is invalid or expired, redirect to login
    if (!session) {
      const url = new URL('/auth/login', request.url);
      return NextResponse.redirect(url);
    }
    
    // Token is valid, allow access
    return NextResponse.next();
  } catch (error) {
    console.error('Authentication error:', error);
    
    // On error, redirect to login
    const url = new URL('/auth/login', request.url);
    return NextResponse.redirect(url);
  }
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - /api/auth/* (authentication API routes)
     * - /auth/login and /auth/signup (login and signup pages)
     * - /_next/static (static files)
     * - /_next/image (image optimization files)
     * - /favicon.ico (favicon file)
     * - /logo/* (logo files)
     */
    '/((?!api/auth|auth/login|auth/signup|_next/static|_next/image|favicon.ico|logo).*)',
  ],
};
