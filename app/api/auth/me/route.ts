import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import clientPromise from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';

// Debug function to safely log objects
function safeLog(label: string, obj: any) {
  // Commented out to reduce console noise
  // try {
  //   console.log(label, JSON.stringify(obj, null, 2));
  // } catch (error) {
  //   console.log(`${label} (non-serializable):`, obj);
  // }
}

export async function GET(request: NextRequest) {
  try {
    // Get token from cookies
    const token = cookies().get('auth-token')?.value;
    // safeLog('Token from cookies:', token ? 'Token exists' : 'No token');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Verify token
    try {
      const session = await verifyToken(token);
      // safeLog('Session after verification:', session);
      
      if (!session || !session.user || !session.user.email) {
        // console.error('Invalid session structure:', session);
        return NextResponse.json(
          { error: 'Invalid or expired token' },
          { status: 401 }
        );
      }
      
      // Connect to MongoDB
      const client = await clientPromise;
      const db = client.db();
      const usersCollection = db.collection('auth_users');
      
      // Log the email we're searching for
      // console.log('Searching for user with email:', session.user.email);
      
      // Find user by email instead of ID to avoid ObjectId issues
      const user = await usersCollection.findOne({ email: session.user.email });
      // safeLog('User lookup result:', user ? 'User found' : 'User not found');
      
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
      
      // Return user info (without password)
      const userWithoutPassword = {
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };
      
      // safeLog('Returning user data:', userWithoutPassword);
      return NextResponse.json({
        user: userWithoutPassword
      });
      
    } catch (verifyError) {
      // console.error('Token verification error:', verifyError);
      return NextResponse.json(
        { error: 'Invalid token format' },
        { status: 401 }
      );
    }
  } catch (error) {
    // console.error('Error in /api/auth/me:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}
