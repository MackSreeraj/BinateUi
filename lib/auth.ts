import { NextRequest, NextResponse } from 'next/server';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { ObjectId } from 'mongodb';

// Secret key for JWT signing/verification
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// User interface
export interface User {
  _id?: string | ObjectId;
  name: string;
  email: string;
  password: string; // This should be hashed before storing
  role?: string; // 'admin', 'user', etc.
  createdAt?: Date;
  updatedAt?: Date;
}

// Session interface
export interface Session {
  user: {
    id: string;
    name: string;
    email: string;
    role?: string; // 'admin', 'user', etc.
  };
  exp: number;
}

// Create a JWT token for a user
export async function createToken(user: { _id: string | ObjectId; name: string; email: string; role?: string }): Promise<string> {
  const userId = user._id.toString();
  
  // console.log('Creating token for user:', { id: userId, name: user.name, email: user.email, role: user.role });
  
  // Create a JWT that expires in 7 days
  const token = await new SignJWT({ 
    user: {
      id: userId,
      name: user.name,
      email: user.email,
      role: user.role || 'user' // Default to 'user' if no role specified
    }
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(new TextEncoder().encode(JWT_SECRET));
  
  return token;
}

// Verify a JWT token and return the session
export async function verifyToken(token: string): Promise<Session | null> {
  try {
    // console.log('Verifying token...');
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    );
    
    // console.log('Token verified successfully');
    // console.log('Payload:', JSON.stringify(verified.payload, null, 2));
    
    // Check if payload has the expected structure
    const payload = verified.payload as any;
    
    // The user data is nested under the 'user' property in the token
    const userData = payload.user || {};
    
    if (!userData.id || !userData.email) {
      // console.error('Token payload missing required user fields:', payload);
      return null;
    }
    
    // Construct a proper session object
    const session: Session = {
      user: {
        id: userData.id,
        name: userData.name || '',
        email: userData.email,
        role: userData.role || 'user' // Default to 'user' if no role specified
      },
      exp: payload.exp || 0
    };
    
    return session;
  } catch (error) {
    // console.error('Token verification failed:', error);
    return null;
  }
}

// Get the current session from cookies
export async function getSession(): Promise<Session | null> {
  const cookieStore = cookies();
  const token = cookieStore.get('auth-token')?.value;
  
  if (!token) {
    return null;
  }
  
  return verifyToken(token);
}

// Hash a password using crypto
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Compare a password with a hash
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  const hashedPassword = await hashPassword(password);
  return hashedPassword === hash;
}
