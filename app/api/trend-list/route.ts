import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

/**
 * GET handler for fetching data specifically from the trend_list table
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const companiesOnly = searchParams.get('companiesOnly') === 'true';
    
    console.log('Connecting to MongoDB for trend_list data...');
    const client = await clientPromise;
    console.log('MongoDB connection established');
    
    const db = client.db("test");
    
    // Helper function to fetch companies
    const fetchCompanies = async () => {
      try {
        console.log('Fetching companies from database...');
        const rawCompanies = await db.collection("companies").find({}).toArray();
        console.log('Raw companies fetched:', rawCompanies.length, 'records');
        
        if (rawCompanies.length > 0) {
          return rawCompanies.map(company => ({
            _id: company._id?.toString() || Math.random().toString(36).substring(2, 15),
            name: company.name || company.companyName || 'Unnamed Company'
          }));
        } else {
          // Use mock data if no companies found
          return [
            { _id: '1', name: 'Acme Corp' },
            { _id: '2', name: 'Tech Innovations' },
            { _id: '3', name: 'Global Solutions' },
            { _id: '4', name: 'Digital Frontiers' },
            { _id: '5', name: 'Future Enterprises' }
          ];
        }
      } catch (error) {
        console.error('Error fetching companies:', error);
        // Return mock data on error
        return [
          { _id: '1', name: 'Acme Corp' },
          { _id: '2', name: 'Tech Innovations' },
          { _id: '3', name: 'Global Solutions' },
          { _id: '4', name: 'Digital Frontiers' },
          { _id: '5', name: 'Future Enterprises' }
        ];
      }
    };
    
    // If only companies are requested, return early
    if (companiesOnly) {
      const companiesData = await fetchCompanies();
      return new NextResponse(JSON.stringify({ companies: companiesData }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'CDN-Cache-Control': 'no-store'
        }
      });
    }
    
    // Fetch companies data for reference
    const companiesData = await fetchCompanies();
    
    // Fetch users for the dropdown
    let usersData = [];
    try {
      console.log('Fetching users from database...');
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
        { _id: '1', name: 'Sebastin Peter', email: 'john@example.com', role: 'Content Manager' },
        { _id: '2', name: 'Jane Jacob', email: 'jane@example.com', role: 'Marketing Lead' },
        { _id: '3', name: 'Alex Johnson', email: 'alex@example.com', role: 'SEO Specialist' },
        { _id: '4', name: 'Sarah Williams', email: 'sarah@example.com', role: 'Content Writer' },
        { _id: '5', name: 'Michael Brown', email: 'michael@example.com', role: 'Social Media Manager' },
        { _id: '6', name: 'Emily Davis', email: 'emily@example.com', role: 'Brand Strategist' }
      ];
      console.log('Using mock user data');
    }
    
    console.log('Fetching trends specifically from trend_list collection...');
    // Fetch trends exclusively from the trend_list collection
    let trendsData = [];
    try {
      // Fetch from trend_list collection
      const trendListData = await db.collection("trend_list").find({}).limit(100).toArray();
      console.log('Raw trends fetched from trend_list collection:', trendListData.length, 'records');
      
      // If no trends found in the collection, use mock data
      if (trendListData.length === 0) {
        console.log('No trends found in trend_list database, using mock data');
        trendsData = [
          {
            _id: '1',
            Title: 'AI in Content Marketing',
            name: 'AI in Content Marketing',
            status: 'Active',
            relevanceScore: 85,
            date: new Date().toISOString(),
            topics: ['AI', 'Content Marketing', 'Digital Strategy'],
            companyName: 'Binate AI',
            content: 'Artificial intelligence is revolutionizing content marketing by enabling personalized content creation at scale.',
            notes: 'This trend is gaining significant traction across B2B and B2C sectors.',
            suggestions: 'Leverage AI tools to create personalized content strategies for clients.',
            scoreExplanation: 'High relevance due to increasing adoption rates and proven ROI.',
            targetPainPoints: 'Content creation bottlenecks, personalization challenges, and scaling issues.',
            keyThemes: 'Automation, Personalization, Efficiency',
            source: 'Industry Research',
            url: 'https://thebinate.com/blog'
          },
          {
            _id: '2',
            Title: 'Voice Search Optimization',
            name: 'Voice Search Optimization',
            status: 'New',
            relevanceScore: 78,
            date: new Date().toISOString(),
            topics: ['SEO', 'Voice Technology', 'Search'],
            companyName: 'Tech Innovations',
            content: 'Voice search is changing how users interact with search engines, requiring new optimization strategies.',
            notes: 'Particularly important for local businesses and mobile-first strategies.',
            suggestions: 'Develop voice search optimization services for clients with local presence.',
            scoreExplanation: 'Growing rapidly with smart speaker and voice assistant adoption.',
            targetPainPoints: 'Traditional SEO not capturing voice queries, missed local opportunities.',
            keyThemes: 'Conversational Keywords, Local Search, Mobile Optimization',
            source: 'Search Engine Journal',
            url: 'https://thebinate.com/blog/voice-search'
          }
        ];
      } else {
        // Process the trend_list data
        trendsData = trendListData.map(trend => {
          // Find company info if companyId exists
          const companyId = trend.companyId || null;
          const company = companyId ? companiesData.find(c => 
            c._id.toString() === companyId.toString() || 
            c._id === companyId
          ) : null;
          
          // Extract topics if available
          let topics: string[] = [];
          if (trend.topics && Array.isArray(trend.topics)) {
            topics = trend.topics;
          } else if (trend.topics && typeof trend.topics === 'string' && trend.topics.trim()) {
            topics = trend.topics.split(',').map((t: string) => t.trim()).filter(Boolean);
          }
          
          return {
            _id: trend._id?.toString() || Math.random().toString(36).substring(2, 15),
            name: trend.Title || trend.name || 'Unnamed Trend',
            Title: trend.Title || trend.name,
            date: trend.date || trend.discoveryDate || new Date().toUTCString(),
            status: trend.status || trend.Status || 'New',
            topics: topics,
            companyId: companyId,
            companyName: company ? company.name : (trend.companyName || null),
            volume: trend.volume || 0,
            change: trend.change || 0,
            relevanceScore: trend.relevanceScore || trend["Relevance Score"] || 0,
            workshopUrl: trend.workshopUrl || null,
            pushedTo: trend.pushedTo || null,
            assignmentCompleted: trend.assignmentCompleted || false,
            discoveryDate: trend.discoveryDate || trend.date || new Date().toISOString(),
            url: trend.url || trend.URL || null,
            source: trend.source || trend.Source || null,
            content: trend.content || trend.Content || null,
            notes: trend.notes || trend.Notes || null,
            suggestions: trend.suggestions || trend["Suggestions to leverage this content for marketing"] || null,
            scoreExplanation: trend.scoreExplanation || trend["Score Explanation"] || null,
            targetPainPoints: trend.targetPainPoints || trend["Target pain points"] || null,
            keyThemes: trend.keyThemes || trend["Key Themes"] || null,
            likes: trend.likes || null,
            comments: trend.comments || null,
            shares: trend.shares || null,
            summary: trend.summary || null
          };
        });
      }
      
      console.log('Normalized trends from trend_list:', trendsData.length, 'records');
    } catch (trendError) {
      console.error('Error fetching trends from trend_list:', trendError);
      // If error, use detailed mock data
      trendsData = [
        {
          _id: '6881e25e1463a98149739a5e',
          Title: 'AI in Content Marketing',
          name: 'AI in Content Marketing',
          status: 'Active',
          relevanceScore: 85,
          date: 'Wed, 23 Jul 2025 20:40:00 +0000',
          topics: ['AI', 'Content Marketing', 'Digital Strategy'],
          companyName: 'Binate AI',
          companyId: '1',
          volume: 1250,
          change: 15,
          content: 'Artificial intelligence is revolutionizing content marketing by enabling personalized content creation at scale.',
          notes: 'This trend is gaining significant traction across B2B and B2C sectors.',
          suggestions: 'Leverage AI tools to create personalized content strategies for clients.',
          scoreExplanation: 'High relevance due to increasing adoption rates and proven ROI.',
          targetPainPoints: 'Content creation bottlenecks, personalization challenges, and scaling issues.',
          keyThemes: 'Automation, Personalization, Efficiency',
          source: 'Industry Research',
          url: 'https://thebinate.com/blog/ai-content-marketing',
          likes: 245,
          comments: 37,
          shares: 128,
          summary: 'AI tools are transforming content marketing workflows, enabling greater personalization and efficiency.'
        },
        {
          _id: '6881e25e1463a98149739a5f',
          Title: 'Voice Search Optimization',
          name: 'Voice Search Optimization',
          status: 'New',
          relevanceScore: 78,
          date: 'Tue, 22 Jul 2025 15:30:00 +0000',
          topics: ['SEO', 'Voice Technology', 'Search'],
          companyName: 'Tech Innovations',
          companyId: '2',
          volume: 850,
          change: 22,
          content: 'Voice search is changing how users interact with search engines, requiring new optimization strategies.',
          notes: 'Particularly important for local businesses and mobile-first strategies.',
          suggestions: 'Develop voice search optimization services for clients with local presence.',
          scoreExplanation: 'Growing rapidly with smart speaker and voice assistant adoption.',
          targetPainPoints: 'Traditional SEO not capturing voice queries, missed local opportunities.',
          keyThemes: 'Conversational Keywords, Local Search, Mobile Optimization',
          source: 'Search Engine Journal',
          url: 'https://thebinate.com/blog/voice-search-optimization',
          likes: 189,
          comments: 24,
          shares: 76,
          summary: 'Voice search is transforming SEO, requiring new strategies focused on conversational content and local optimization.'
        }
      ];
      console.log('Using mock trend data due to error');
    }
    
    const response = { trends: trendsData, users: usersData, companies: companiesData };
    console.log('API response prepared with', trendsData.length, 'trends,', usersData.length, 'users, and', companiesData.length, 'companies');
    
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Database error:', error);
    // Return mock data on error
    const mockData = {
      trends: [
        { 
          _id: '6881e25e1463a98149739a5e', 
          name: 'AI Content Generation Strategies for 2025', 
          date: 'Wed, 23 Jul 2025 20:40:00 +0000',
          status: 'Active',
          topics: ['AI', 'Content', 'Marketing']
        },
        { 
          _id: '6881e25e1463a98149739a5f', 
          name: 'Voice Search Optimization Techniques', 
          date: 'Tue, 22 Jul 2025 15:30:00 +0000',
          status: 'New',
          topics: ['SEO', 'Voice', 'Search']
        }
      ],
      users: [
        { _id: '1', name: 'Sebastin Peter', email: 'john@example.com' },
        { _id: '2', name: 'Jane Smith', email: 'jane@example.com' }
      ],
      companies: [
        { _id: '1', name: 'Acme Corp' },
        { _id: '2', name: 'Tech Innovations' },
        { _id: '3', name: 'Global Solutions' },
        { _id: '4', name: 'Digital Frontiers' },
        { _id: '5', name: 'Future Enterprises' }
      ]
    };
    console.log('Returning mock data due to error');
    return NextResponse.json(mockData, { status: 200 });
  }
}
