import { NextResponse } from 'next/server';
import { compare } from 'bcryptjs';
import { createToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    // In a real app, you would validate the credentials against your database
    // This is a simplified example
    if (email === 'admin@example.com' && password === 'admin123') {
      // Create admin user object
      const adminUser = {
        _id: '1',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin'
      };
      
      // Create JWT token with admin role
      const token = await createToken(adminUser);
      
      // Set the token in cookies
      cookies().set({
        name: 'auth-token',
        value: token,
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
      
      return NextResponse.json({ 
        success: true,
        user: {
          id: '1',
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin'
        }
      });
    }
    
    return NextResponse.json(
      { success: false, message: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
