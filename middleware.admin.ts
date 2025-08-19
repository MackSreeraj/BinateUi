import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

const adminPaths = ['/admin', '/admin/dashboard', '/admin/users'];
const publicPaths = ['/admin/login', '/api/admin/login'];

// Check if the path is an admin path
const isAdminPath = (path: string) => {
  return adminPaths.some(adminPath => 
    path === adminPath || path.startsWith(`${adminPath}/`)
  );
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for non-admin paths
  if (!isAdminPath(pathname) && !publicPaths.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }
  
  // Allow access to public paths
  if (publicPaths.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }
  
  // Check for auth token
  const token = request.cookies.get('auth-token')?.value;
  
  if (!token) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  try {
    // Verify the token and check if user is admin
    const session = await verifyToken(token);
    
    // Check if user is authenticated and has admin role
    if (!session || !session.user?.role || session.user.role !== 'admin') {
      console.log('Admin middleware - unauthorized access:', pathname);
      console.log('Session:', session ? JSON.stringify(session, null, 2) : 'No session');
      
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('error', 'unauthorized');
      return NextResponse.redirect(loginUrl);
    }
    
    console.log('Admin middleware - authorized admin access:', pathname);
    
    return NextResponse.next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('error', 'session_expired');
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
  ],
};
