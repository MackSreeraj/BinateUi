import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    console.log('Connecting to MongoDB...');
    const client = await clientPromise;
    console.log('MongoDB connection established');
    
    const db = client.db("test");
    
    console.log('Fetching trends from database...');
    // Fetch trends from the database
    let trendsData = [];
    try {
      const rawTrends = await db.collection("trends").find({}).toArray();
      console.log('Raw trends fetched:', rawTrends.length, 'records');
      
      // Normalize the data structure to ensure consistent field names
      trendsData = rawTrends.map(trend => {
        // Extract topics from the Topics field or create from KeyThemes if available
        let topics: string[] = [];
        if (trend.Topics && typeof trend.Topics === 'string' && trend.Topics.trim()) {
          topics = trend.Topics.split(',').map(t => t.trim()).filter(Boolean);
        } else if (trend.KeyThemes && typeof trend.KeyThemes === 'string') {
          // Extract bullet points from KeyThemes
          topics = trend.KeyThemes.split('•')
            .map(t => t.trim().replace(/^\s*•\s*/, ''))
            .filter(Boolean);
        }
        
        return {
          _id: trend._id?.toString() || Math.random().toString(36).substring(2, 15),
          name: trend.Title || trend.name || 'Unnamed Trend',
          volume: trend.Views ? parseInt(trend.Views) : 0,
          change: 0, // Default change value
          relevanceScore: trend.RelevanceScore || 0,
          workshopUrl: trend.URL || trend.Source || null,
          pushedTo: trend.PushedTo || null,
          topics: topics
        };
      });
      
      console.log('Normalized trends:', trendsData.length, 'records');
    } catch (trendError) {
      console.error('Error fetching trends:', trendError);
      // If no trends, use mock data
      trendsData = [
        { 
          _id: '1', 
          name: 'AI Advancements', 
          volume: 24500, 
          change: 12,
          relevanceScore: 9.8,
          workshopUrl: 'https://example.com/workshop/ai-healthcare',
          topics: ['AI', 'Technology', 'Machine Learning']
        },
        { 
          _id: '2', 
          name: 'Web3 Updates', 
          volume: 18900, 
          change: 8,
          relevanceScore: 8.7,
          workshopUrl: 'https://example.com/workshop/web3',
          topics: ['Web3', 'Blockchain', 'Cryptocurrency']
        },
        {
          _id: '3',
          name: 'Sustainable Energy Solutions',
          volume: 32000,
          change: -5,
          relevanceScore: 9.2,
          topics: ['Energy', 'Sustainability', 'Climate']
        },
        {
          _id: '4',
          name: 'Remote Work Technologies',
          volume: 15000,
          change: 22,
          relevanceScore: 7.9,
          workshopUrl: 'https://example.com/workshop/remote-work',
          topics: ['Remote Work', 'Productivity', 'Technology']
        }
      ];
      console.log('Using mock trend data');
    }
    
    console.log('Fetching users from database...');
    // Fetch users for the dropdown
    let usersData = [];
    try {
      // Try to fetch from the users collection with a more flexible approach
      // Don't limit fields too much in case the schema varies
      const rawUsers = await db.collection("users").find({}).toArray();
      console.log('Raw users fetched:', rawUsers.length, 'records');
      
      if (rawUsers.length === 0) {
        // If users collection is empty, try alternate collections that might contain user data
        console.log('Users collection empty, checking team_members collection...');
        const teamMembers = await db.collection("team_members").find({}).toArray();
        
        if (teamMembers.length > 0) {
          console.log('Found team_members:', teamMembers.length);
          rawUsers.push(...teamMembers);
        }
      }
      
      // Normalize user data with flexible field mapping
      usersData = rawUsers.map(user => {
        // Try to extract the ID in various formats
        const userId = user._id?.toString() || 
                      (typeof user._id === 'object' && user._id !== null && '$oid' in user._id ? user._id.$oid : null) || 
                      user.id || 
                      Math.random().toString(36).substring(2, 15);
        
        // Try to extract name from various possible fields
        const userName = user.name || 
                       user.fullName || 
                       user.username || 
                       user.displayName || 
                       (user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : null) || 
                       'Unknown User';
        
        // Try to extract email from various possible fields
        const userEmail = user.email || 
                        user.emailAddress || 
                        user.mail || 
                        `user-${userId}@example.com`;
        
        return {
          _id: userId,
          name: userName,
          email: userEmail,
          role: user.role || user.jobTitle || 'Team Member'
        };
      });
      
      console.log('Normalized users:', usersData.length, 'records');
    } catch (userError) {
      console.error('Error fetching users:', userError);
      // If no users, use mock data with more variety
      usersData = [
        { _id: '1', name: 'John Doe', email: 'john@example.com', role: 'Content Manager' },
        { _id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Marketing Lead' },
        { _id: '3', name: 'Alex Johnson', email: 'alex@example.com', role: 'SEO Specialist' },
        { _id: '4', name: 'Sarah Williams', email: 'sarah@example.com', role: 'Content Writer' },
        { _id: '5', name: 'Michael Brown', email: 'michael@example.com', role: 'Social Media Manager' },
        { _id: '6', name: 'Emily Davis', email: 'emily@example.com', role: 'Brand Strategist' }
      ];
      console.log('Using mock user data');
    }
    
    const response = { trends: trendsData, users: usersData };
    console.log('API response prepared with', trendsData.length, 'trends and', usersData.length, 'users');
    
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Database error:', error);
    // Return mock data on error
    const mockData = {
      trends: [
        { 
          _id: '1', 
          name: 'AI Advancements', 
          volume: 24500, 
          change: 12,
          relevanceScore: 9.8,
          workshopUrl: 'https://example.com/workshop/ai-healthcare',
          topics: ['AI', 'Technology', 'Machine Learning']
        },
        { 
          _id: '2', 
          name: 'Web3 Updates', 
          volume: 18900, 
          change: 8,
          relevanceScore: 8.7,
          workshopUrl: 'https://example.com/workshop/web3',
          topics: ['Web3', 'Blockchain', 'Cryptocurrency']
        }
      ],
      users: [
        { _id: '1', name: 'John Doe', email: 'john@example.com' },
        { _id: '2', name: 'Jane Smith', email: 'jane@example.com' }
      ]
    };
    console.log('Returning mock data due to error');
    return NextResponse.json(mockData, { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const { trendId, userId } = await request.json();
    
    console.log('POST request received to update trend:', { trendId, userId });
    
    if (!trendId || !userId) {
      console.error('Missing required fields:', { trendId, userId });
      return NextResponse.json({ error: 'Missing trendId or userId' }, { status: 400 });
    }
    
    console.log('Connecting to MongoDB...');
    const client = await clientPromise;
    console.log('MongoDB connection established');
    
    const db = client.db("test");
    
    console.log('Updating trend in database...');
    try {
      // Handle string or ObjectId format for _id
      let query;
      try {
        const { ObjectId } = require('mongodb');
        // Try to convert to ObjectId if it's a valid format
        if (ObjectId.isValid(trendId)) {
          query = { _id: new ObjectId(trendId) };
        } else {
          query = { _id: trendId };
        }
      } catch (err) {
        // If mongodb module is not available or other error
        query = { _id: trendId };
      }
      
      const result = await db.collection("trends").updateOne(
        query,
        { $set: { pushedTo: userId } }
      );
      
      console.log('Update result:', result);
      
      if (result.matchedCount === 0) {
        console.warn('No trend matched the ID:', trendId);
        return NextResponse.json({ error: 'Trend not found' }, { status: 404 });
      }
      
      return NextResponse.json({ 
        success: true, 
        message: 'Trend successfully updated',
        trendId,
        userId
      }, { status: 200 });
    } catch (dbError) {
      console.error('Database error during update:', dbError);
      return NextResponse.json({ error: 'Database error during update' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error processing POST request:', error);
    return NextResponse.json({ error: 'Failed to update trend' }, { status: 500 });
  }
}
