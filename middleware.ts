import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

// Define public paths that don't require authentication
const publicPaths = [
  '/auth/login', 
  '/auth/signup',
  '/admin/login', // Admin login page
  '/api/auth/login',
  '/api/auth/signup',
  '/api/admin/login', // Admin login API
  '/api/auth/me', // Auth status check
  '/api/cron/check-scheduled-content', // Cron job endpoint
  '/manifest.webmanifest', // Manifest file
  '/uploads/', // Public uploads directory
  '/api/uploads/' // API route for uploads
];

// Add CORS headers to responses
const addCorsHeaders = (response: NextResponse, request: NextRequest) => {
  const origin = request.headers.get('origin');
  const allowedOrigins = [
    'http://localhost:3000',
    'https://app.thebinate.com',
    'https://www.thebinate.com',
    'https://www.app.thebinate.com',
    'https://thebinate.com'
  ];

  // For development, allow all origins
  const isDevelopment = process.env.NODE_ENV === 'development';
  const requestOrigin = isDevelopment ? (origin || '*') : 
    (origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0]);
  
  const headers = new Headers(response.headers);
  headers.set('Access-Control-Allow-Origin', requestOrigin);
  headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  headers.set('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { 
      status: 204,
      headers: Object.fromEntries(headers.entries())
    });
  }
  
  return new NextResponse(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: headers
  });
};

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 204 });
    return addCorsHeaders(response, request);
  }
  
  // Allow access to public paths without authentication
  if (publicPaths.some(publicPath => path.startsWith(publicPath))) {
    const response = NextResponse.next();
    return addCorsHeaders(response, request);
  }
  
  // Check for auth token in cookies
  const token = request.cookies.get('auth-token')?.value;
  
  // If no token is found, handle based on route type
  if (!token) {
    // For API routes, return 401 JSON response
    if (path.startsWith('/api/')) {
      const response = new NextResponse(
        JSON.stringify({ error: 'Authentication required' }), 
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
      return addCorsHeaders(response, request);
    }
    
    // For non-API routes, redirect to login
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
    const response = NextResponse.next();
    return addCorsHeaders(response, request);
  } catch (error) {
    console.error('Authentication error:', error);
    
    // For API routes, return 401 instead of redirecting
    if (path.startsWith('/api/')) {
      const response = new NextResponse(
        JSON.stringify({ error: 'Authentication required' }), 
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
      return addCorsHeaders(response, request);
    }
    
    // For non-API routes, redirect to login
    const url = new URL('/auth/login', request.url);
    const response = NextResponse.redirect(url);
    return addCorsHeaders(response, request);
  }
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - /api/auth/me (public auth status check)
     * - /api/auth/login and /api/auth/signup (auth endpoints)
     * - /auth/login and /auth/signup (login and signup pages)
     * - /_next/static (static files)
     * - /_next/image (image optimization files)
     * - /favicon.ico (favicon file)
     * - /favicon/* (favicon files)
     * - /logo/* (logo files)
     * - /manifest.webmanifest (web app manifest)
     * - /uploads/* (uploads directory)
     * - /api/uploads/* (uploads API route)
     */
    '/((?!api/auth|auth/login|auth/signup|_next/static|_next/image|favicon.ico|favicon/|logo/|manifest.webmanifest|uploads/|api/uploads/).*)',
  ],
};
