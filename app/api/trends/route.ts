import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    console.log('Connecting to MongoDB...');
    const client = await clientPromise;
    console.log('MongoDB connection established');
    
    const db = client.db("test");
    
    console.log('Fetching trends from trend_list table...');
    // Fetch trends from the trend_list table
    let trendsData = [];
    try {
      const rawTrends = await db.collection("trend_list").find({}).toArray();
      console.log('Raw trends fetched from trend_list:', rawTrends.length, 'records');
      
      // Normalize the data structure to ensure consistent field names
      trendsData = rawTrends.map(trend => {
        // Extract topics if available
        let topics: string[] = [];
        if (trend.topics && Array.isArray(trend.topics)) {
          topics = trend.topics;
        } else if (trend.topics && typeof trend.topics === 'string' && trend.topics.trim()) {
          topics = trend.topics.split(',').map(t => t.trim()).filter(Boolean);
        }
        
        return {
          _id: trend._id?.toString() || Math.random().toString(36).substring(2, 15),
          name: trend.Title || trend.title || 'Unnamed Trend',  // Try both Title and title fields
          date: trend['Published Date'] || trend.date || new Date().toISOString(), // Try both Published Date and date fields
          status: trend.Status || trend.status || 'New',  // Try both Status and status fields
          topics: topics,
          // Keep other fields for backward compatibility
          volume: 0,
          change: 0,
          relevanceScore: 0,
          workshopUrl: null,
          pushedTo: null,
          assignmentCompleted: false,
          discoveryDate: trend.date || new Date().toISOString(),
          source: null,
          likes: null,
          comments: null,
          shares: null,
          summary: null
        };
      });
      
      console.log('Normalized trends from trend_list:', trendsData.length, 'records');
    } catch (trendError) {
      console.error('Error fetching trends:', trendError);
      // If no trends, use mock data
      trendsData = [
        { 
          _id: '6881e25e1463a98149739a5e', 
          name: 'Tesla profits pulled down by falling EV sales and regulatory credits', 
          date: 'Wed, 23 Jul 2025 20:40:00 +0000',
          status: 'New',
          topics: ['Tesla', 'EV', 'Business']
        },
        { 
          _id: '6881e25e1463a98149739a5f', 
          name: 'AI Content Generation Strategies for 2025', 
          date: 'Tue, 22 Jul 2025 15:30:00 +0000',
          status: 'Active',
          topics: ['AI', 'Content', 'Marketing']
        },
        {
          _id: '6881e25e1463a98149739a60',
          name: 'Social Media Trends Reshaping Digital Marketing',
          date: 'Mon, 21 Jul 2025 09:45:00 +0000',
          status: 'Pending',
          topics: ['Social Media', 'Marketing', 'Digital']
        },
        {
          _id: '6881e25e1463a98149739a61',
          name: 'Sustainable Content Marketing Practices',
          date: 'Sun, 20 Jul 2025 12:20:00 +0000',
          status: 'Completed',
          topics: ['Sustainability', 'Content', 'Marketing']
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
          _id: '6881e25e1463a98149739a5e', 
          name: 'Tesla profits pulled down by falling EV sales and regulatory credits', 
          date: 'Wed, 23 Jul 2025 20:40:00 +0000',
          status: 'New',
          topics: ['Tesla', 'EV', 'Business']
        },
        { 
          _id: '6881e25e1463a98149739a5f', 
          name: 'AI Content Generation Strategies for 2025', 
          date: 'Tue, 22 Jul 2025 15:30:00 +0000',
          status: 'Active',
          topics: ['AI', 'Content', 'Marketing']
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
    const { trendId, userId, action = 'assign', status } = await request.json();
    
    console.log('POST request received to update trend:', { trendId, userId, action, status });
    
    if (!trendId) {
      console.error('Missing required field: trendId');
      return NextResponse.json({ error: 'Missing trendId' }, { status: 400 });
    }
    
    // Validate required fields based on action
    if (action === 'assign' && !userId && userId !== '') {
      console.error('Missing required field: userId for assign action');
      return NextResponse.json({ error: 'Missing userId for assign action' }, { status: 400 });
    }
    
    if (action === 'updateStatus' && !status) {
      console.error('Missing required field: status for updateStatus action');
      return NextResponse.json({ error: 'Missing status for updateStatus action' }, { status: 400 });
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
      
      let updateData = {};
      let actionMessage = '';
      
      // Handle different actions
      if (action === 'assign') {
        updateData = { pushedTo: userId, assignmentCompleted: false };
        actionMessage = userId ? 'Trend successfully assigned to user' : 'Trend successfully unassigned';
      } else if (action === 'complete') {
        updateData = { assignmentCompleted: true };
        actionMessage = 'Trend assignment successfully completed';
      } else if (action === 'updateStatus') {
        console.log('Updating status for trend:', trendId, 'to', status);
        
        // For mock data, just update the state on the client side
        if (trendId.length <= 2) { // Mock data has short IDs like '1', '2', etc.
          return NextResponse.json({ 
            success: true, 
            message: 'Mock trend status updated successfully',
            status: status
          });
        }
        
        // Try different ID formats for the query
        let updatedSuccessfully = false;
        let updateMessage = '';
        
        // Try to update in trend_list collection first (using both string ID and ObjectId)
        try {
          // Try with ObjectId if it's valid
          if (ObjectId.isValid(trendId)) {
            const objIdResult = await db.collection('trend_list').updateOne(
              { _id: new ObjectId(trendId) },
              { $set: { Status: status } }
            );
            
            console.log('trend_list update with ObjectId result:', objIdResult);
            
            if (objIdResult.matchedCount > 0) {
              updatedSuccessfully = true;
              updateMessage = 'Trend status updated successfully in trend_list';
            }
          }
          
          // If not updated yet, try with string ID
          if (!updatedSuccessfully) {
            const stringIdResult = await db.collection('trend_list').updateOne(
              { _id: trendId },
              { $set: { Status: status } }
            );
            
            console.log('trend_list update with string ID result:', stringIdResult);
            
            if (stringIdResult.matchedCount > 0) {
              updatedSuccessfully = true;
              updateMessage = 'Trend status updated successfully in trend_list';
            }
          }
        } catch (err) {
          console.error('Error updating trend_list:', err);
        }
        
        // If not updated yet, try the trends collection
        if (!updatedSuccessfully) {
          try {
            // Try with ObjectId if it's valid
            if (ObjectId.isValid(trendId)) {
              const objIdResult = await db.collection('trends').updateOne(
                { _id: new ObjectId(trendId) },
                { $set: { status: status } }
              );
              
              console.log('trends update with ObjectId result:', objIdResult);
              
              if (objIdResult.matchedCount > 0) {
                updatedSuccessfully = true;
                updateMessage = 'Trend status updated successfully in trends collection';
              }
            }
            
            // If not updated yet, try with string ID
            if (!updatedSuccessfully) {
              const stringIdResult = await db.collection('trends').updateOne(
                { _id: trendId },
                { $set: { status: status } }
              );
              
              console.log('trends update with string ID result:', stringIdResult);
              
              if (stringIdResult.matchedCount > 0) {
                updatedSuccessfully = true;
                updateMessage = 'Trend status updated successfully in trends collection';
              }
            }
          } catch (err) {
            console.error('Error updating trends collection:', err);
          }
        }
        
        if (updatedSuccessfully) {
          return NextResponse.json({ 
            success: true, 
            message: updateMessage,
            status: status
          });
        } else {
          // If we get here, we couldn't find the trend in either collection
          return NextResponse.json({ 
            error: 'Trend not found in database', 
            details: `Could not find trend with ID: ${trendId}` 
          }, { status: 404 });
        }
      } else if (action === 'updateStatusInMemory') {
        // This is a special action just for updating the mock data in memory
        // No database update needed, just return success
        return NextResponse.json({ 
          success: true, 
          message: 'Status updated in memory',
          status: status
        });
      } else {
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
      }
      
      const result = await db.collection("trends").updateOne(
        query,
        { $set: updateData }
      );
      
      console.log('Update result:', result);
      
      if (result.matchedCount === 0) {
        console.warn('No trend matched the ID:', trendId);
        return NextResponse.json({ error: 'Trend not found' }, { status: 404 });
      }
      
      return NextResponse.json({ 
        success: true, 
        message: actionMessage,
        trendId,
        userId,
        action
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
