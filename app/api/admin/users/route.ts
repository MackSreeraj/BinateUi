import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getSession } from '@/lib/auth';
import { ObjectId } from 'mongodb';

// This is a protected API route that only admins can access
export async function GET() {
  try {
    // Check if user is authenticated and is an admin
    const session = await getSession();
    console.log('Session in admin/users API:', JSON.stringify(session, null, 2));
    
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized - Not logged in' },
        { status: 401 }
      );
    }
    
    // Enforce admin-only access
    if (!session.user?.role || session.user.role !== 'admin') {
      console.log('Non-admin user attempted to access admin API:', session.user);
      return NextResponse.json(
        { message: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }
    
    // Connect to MongoDB and fetch users
    console.log('Connecting to MongoDB...');
    const client = await clientPromise;
    console.log('MongoDB client connected successfully');
    
    // Get database information
    const db = client.db();
    console.log('Database name:', db.databaseName);
    
    // List all collections in the database
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    console.log('Available collections:', collectionNames);
    
    // Initialize variables
    let usersData: any[] = [];
    let collectionUsed = '';
    let collectionsToTry = ['auth_users', 'users', 'user', 'accounts'];
    
    // Add any other collections we find that might contain users
    collectionNames.forEach(name => {
      if (name.toLowerCase().includes('user') && !collectionsToTry.includes(name)) {
        collectionsToTry.push(name);
      }
    });
    
    console.log('Will try these collections:', collectionsToTry);
    
    // Try each collection until we find users
    for (const collName of collectionsToTry) {
      if (!collectionNames.includes(collName)) {
        console.log(`Collection ${collName} does not exist, skipping`);
        continue;
      }
      
      console.log(`Trying to fetch users from ${collName} collection...`);
      try {
        const collection = db.collection(collName);
        const data = await collection.find({}).limit(10).toArray();
        
        console.log(`Found ${data.length} documents in ${collName} collection`);
        
        if (data && data.length > 0) {
          // Check if these look like user documents
          const hasUserFields = data.some(doc => 
            doc.email || doc.name || doc.username || doc.password
          );
          
          if (hasUserFields) {
            console.log(`Documents in ${collName} appear to be users`);
            console.log('Sample document:', JSON.stringify(data[0], null, 2));
            usersData = data;
            collectionUsed = collName;
            break;
          } else {
            console.log(`Documents in ${collName} don't appear to be users`);
          }
        }
      } catch (err) {
        console.error(`Error fetching from ${collName}:`, err);
      }
    }
    
    // If we still have no users, try a direct query with the sample data structure
    if (usersData.length === 0 && collectionNames.includes('auth_users')) {
      console.log('Trying direct query on auth_users with sample structure...');
      try {
        const collection = db.collection('auth_users');
        const sampleData = await collection.findOne({ email: { $exists: true } });
        
        if (sampleData) {
          console.log('Found a user with direct query:', JSON.stringify(sampleData, null, 2));
          usersData = [sampleData];
          collectionUsed = 'auth_users (direct query)';
        }
      } catch (err) {
        console.error('Error with direct query:', err);
      }
    }
    
    // If still no users found, add sample data
    if (usersData.length === 0) {
      console.log('No users found in any collection, adding sample data');
      usersData = [
        {
          _id: new ObjectId(),
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin',
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          _id: new ObjectId(),
          name: 'Sreeraj Mack',
          email: 'sreerajmack7@gmail.com',
          role: 'admin',
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      collectionUsed = 'sample data';
    }
    
    // Transform the data to match our expected format
    const users = usersData.map(user => ({
      id: user._id.toString(),
      name: user.name || 'Unknown',
      email: user.email || 'No Email',
      role: user.role || 'user',
      status: user.status || 'active',
      lastLogin: user.updatedAt || user.createdAt || new Date().toISOString(),
    }));
    
    console.log(`Returning ${users.length} users from ${collectionUsed}`);
    
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error in admin/users API:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
