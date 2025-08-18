import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// This is a protected API route that only admins can access
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated and is an admin
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // In a real app, you would fetch users from your database
    // This is mock data
    const users = [
      {
        id: '1',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin',
        status: 'active',
        lastLogin: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user',
        status: 'active',
        lastLogin: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      },
      {
        id: '3',
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'editor',
        status: 'active',
        lastLogin: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
      },
    ];

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
