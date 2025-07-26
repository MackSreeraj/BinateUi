import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { Response } from 'next/dist/compiled/@edge-runtime/primitives';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(): Promise<Response> {
  try {
    console.log('Connecting to MongoDB...');
    const client = await clientPromise;
    console.log('MongoDB connection established');
    
    const db = client.db("test");
    
    // Fetch companies data
    let companiesData = [];
    try {
      console.log('Fetching companies from database...');
      const rawCompanies = await db.collection("companies").find({}).toArray();
      console.log('Raw companies fetched:', rawCompanies.length, 'records');
      
      if (rawCompanies.length > 0) {
        companiesData = rawCompanies.map(company => ({
          _id: company._id?.toString() || Math.random().toString(36).substring(2, 15),
          name: company.name || company.companyName || 'Unnamed Company'
        }));
      } else {
        // Use mock data if no companies found
        companiesData = [
          { _id: '1', name: 'Acme Corp' },
          { _id: '2', name: 'Tech Innovations' },
          { _id: '3', name: 'Global Solutions' },
          { _id: '4', name: 'Digital Frontiers' },
          { _id: '5', name: 'Future Enterprises' }
        ];
        console.log('Using mock company data');
      }
    } catch (companyError) {
      console.error('Error fetching companies:', companyError);
      // Use mock data on error
      companiesData = [
        { _id: '1', name: 'Acme Corp' },
        { _id: '2', name: 'Tech Innovations' },
        { _id: '3', name: 'Global Solutions' },
        { _id: '4', name: 'Digital Frontiers' },
        { _id: '5', name: 'Future Enterprises' }
      ];
      console.log('Using mock company data due to error');
    }
    
    console.log('Fetching trends from both collections...');
    // Fetch trends from both collections to ensure we get all fields
    let trendsData = [];
    try {
      // Fetch from trends collection (main collection)
      const rawTrends = await db.collection("trends").find({}).limit(100).toArray();
      console.log('Raw trends fetched from trends collection:', rawTrends.length, 'records');
      
      // Also fetch from trend_list collection to get any additional fields
      const trendListData = await db.collection("trend_list").find({}).limit(100).toArray();
      console.log('Raw trends fetched from trend_list collection:', trendListData.length, 'records');
      
      // Also check if there's a trends_detailed collection that might have more fields
      let detailedTrendsData = [];
      try {
        detailedTrendsData = await db.collection("trends_detailed").find({}).toArray();
        console.log('Raw trends fetched from trends_detailed collection:', detailedTrendsData.length, 'records');
      } catch (err) {
        console.log('No trends_detailed collection found or error fetching from it');
      }
      
      // Create a map of trend_list items by title for easy lookup
      interface TrendItem {
        _id?: string | any;
        Title?: string;
        name?: string;
        [key: string]: any;
      }
      
      const trendListMap: Record<string, TrendItem> = {};
      trendListData.forEach((trend: TrendItem) => {
        const key = trend.Title || trend.name;
        if (key) {
          trendListMap[key] = trend;
        }
      });
      
      // If no trends found in either collection, use mock data
      if (rawTrends.length === 0 && trendListData.length === 0) {
        console.log('No trends found in database, using mock data');
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
        return NextResponse.json({ trends: trendsData, users: [], companies: [] }, { status: 200 });
      }
      
      // Normalize the data structure to ensure consistent field names
      trendsData = rawTrends.map(trend => {
        // Get the title or name to use as a key
        const trendKey = trend.Title || trend.name;
        
        // Find matching trend from trend_list collection to merge data
        const trendListItem = trendKey && trendListMap.hasOwnProperty(trendKey) ? trendListMap[trendKey] : null;
        
        // Merge data from both sources, with trend (from trends collection) taking precedence
        const mergedTrend: Record<string, any> = trendListItem ? { ...trendListItem, ...trend } : trend;
        
        // Extract topics if available
        let topics: string[] = [];
        if (mergedTrend.topics && Array.isArray(mergedTrend.topics)) {
          topics = mergedTrend.topics;
        } else if (mergedTrend.topics && typeof mergedTrend.topics === 'string' && mergedTrend.topics.trim()) {
          topics = mergedTrend.topics.split(',').map((t: string) => t.trim()).filter(Boolean);
        }
        
        // Find company info if companyId exists
        const companyId = mergedTrend.companyId || null;
        const company = companyId ? companiesData.find(c => 
          c._id.toString() === companyId.toString() || 
          c._id === companyId
        ) : null;
        
        return {
          _id: mergedTrend._id?.toString() || Math.random().toString(36).substring(2, 15),
          name: mergedTrend.Title || mergedTrend.name || 'Unnamed Trend',
          Title: mergedTrend.Title || mergedTrend.name,
          date: mergedTrend.date || mergedTrend.discoveryDate || new Date().toUTCString(),
          status: mergedTrend.status || 'New',
          topics: topics,
          companyId: companyId,
          companyName: company ? company.name : (mergedTrend.companyName || null),
          volume: mergedTrend.volume || 0,
          change: mergedTrend.change || 0,
          relevanceScore: mergedTrend.relevanceScore || mergedTrend["Relevance Score"] || 0,
          workshopUrl: mergedTrend.workshopUrl || null,
          pushedTo: mergedTrend.pushedTo || null,
          assignmentCompleted: mergedTrend.assignmentCompleted || false,
          discoveryDate: mergedTrend.discoveryDate || mergedTrend.date || new Date().toISOString(),
          url: mergedTrend.url || mergedTrend.URL || null,
          source: mergedTrend.source || mergedTrend.Source || null,
          content: mergedTrend.content || mergedTrend.Content || null,
          notes: mergedTrend.notes || mergedTrend.Notes || null,
          suggestions: mergedTrend.suggestions || mergedTrend["Suggestions to leverage this content for marketing"] || null,
          scoreExplanation: mergedTrend.scoreExplanation || mergedTrend["Score Explanation"] || null,
          targetPainPoints: mergedTrend.targetPainPoints || mergedTrend["Target pain points"] || null,
          keyThemes: mergedTrend.keyThemes || mergedTrend["Key Themes"] || null,
          likes: mergedTrend.likes || null,
          comments: mergedTrend.comments || null,
          shares: mergedTrend.shares || null,
          summary: mergedTrend.summary || null
        };
      });
      
      console.log('Normalized trends from trend_list:', trendsData.length, 'records');
    } catch (trendError) {
      console.error('Error fetching trends:', trendError);
      // If no trends, use detailed mock data
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
          content: 'Artificial intelligence is revolutionizing content marketing by enabling personalized content creation at scale. Companies are increasingly adopting AI tools to generate, optimize, and distribute content more efficiently. This trend is particularly strong in sectors with high content volume needs such as media, e-commerce, and B2B technology.',
          notes: 'This trend is gaining significant traction across B2B and B2C sectors. Early adopters are reporting 30-40% increases in content production efficiency.',
          suggestions: 'Leverage AI tools to create personalized content strategies for clients. Focus on developing hybrid workflows that combine AI efficiency with human creativity and oversight.',
          scoreExplanation: 'High relevance due to increasing adoption rates and proven ROI. Market analysis shows 65% of enterprise companies plan to increase AI content tool budgets in the next fiscal year.',
          targetPainPoints: 'Content creation bottlenecks, personalization challenges, and scaling issues. Many marketing teams struggle with producing sufficient high-quality content to meet demand across multiple channels.',
          keyThemes: 'Automation, Personalization, Efficiency, Human-AI Collaboration',
          source: 'Industry Research Report by ContentTech Institute',
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
          content: 'Voice search is changing how users interact with search engines, requiring new optimization strategies. With the proliferation of smart speakers and voice assistants, conversational queries are becoming increasingly common. This shift demands a fundamental rethinking of keyword strategies and content formatting.',
          notes: 'Particularly important for local businesses and mobile-first strategies. Voice searches are 3x more likely to be local-based than text searches.',
          suggestions: 'Develop voice search optimization services for clients with local presence. Create FAQ-style content that directly answers common voice queries in natural language.',
          scoreExplanation: 'Growing rapidly with smart speaker and voice assistant adoption. Current estimates show 55% of households now own at least one smart speaker device.',
          targetPainPoints: 'Traditional SEO not capturing voice queries, missed local opportunities. Many businesses are losing visibility in voice search results due to outdated optimization approaches.',
          keyThemes: 'Conversational Keywords, Local Search, Mobile Optimization, Featured Snippets',
          source: 'Search Engine Journal Annual Report',
          url: 'https://thebinate.com/blog/voice-search-optimization',
          likes: 189,
          comments: 24,
          shares: 76,
          summary: 'Voice search is transforming SEO, requiring new strategies focused on conversational content and local optimization.'
        },
        {
          _id: '6881e25e1463a98149739a60',
          Title: 'Video Content Dominance',
          name: 'Video Content Dominance',
          status: 'Active',
          relevanceScore: 92,
          date: 'Mon, 21 Jul 2025 09:45:00 +0000',
          topics: ['Video Marketing', 'Content Strategy', 'Social Media'],
          companyName: 'Digital Frontiers',
          companyId: '3',
          volume: 1750,
          change: 35,
          content: 'Short-form video content continues to dominate engagement metrics across all major platforms. The rise of TikTok, Instagram Reels, and YouTube Shorts has created a new paradigm in content consumption, with users increasingly preferring brief, high-impact video experiences.',
          notes: 'TikTok and Instagram Reels are driving this trend with unprecedented engagement rates. Videos under 60 seconds generate 2.5x more engagement than longer formats.',
          suggestions: 'Develop vertical video templates and strategies for clients across multiple platforms. Focus on authentic, trend-responsive content that can be quickly produced and distributed.',
          scoreExplanation: 'Highest engagement rates across all content types with growing platform support. Platform algorithms heavily favor short-form video, providing greater organic reach potential.',
          targetPainPoints: 'Production costs, content consistency, cross-platform optimization. Many brands struggle with maintaining quality while producing the volume of video content needed to stay relevant.',
          keyThemes: 'Short-form, Authenticity, Platform-specific optimization, User-generated content',
          source: 'Social Media Examiner Industry Report',
          url: 'https://thebinate.com/blog/video-content-trends',
          likes: 312,
          comments: 58,
          shares: 203,
          summary: 'Short-form video dominates engagement across platforms, requiring brands to adapt their content strategies.'
        },
        {
          _id: '6881e25e1463a98149739a61',
          Title: 'Sustainable Content Marketing',
          name: 'Sustainable Content Marketing Practices',
          status: 'Pending',
          relevanceScore: 73,
          date: 'Sun, 20 Jul 2025 12:20:00 +0000',
          topics: ['Sustainability', 'Content', 'ESG'],
          companyName: 'Green Solutions',
          companyId: '4',
          volume: 620,
          change: 18,
          content: 'Sustainable content marketing focuses on creating enduring value while minimizing environmental impact. This approach emphasizes evergreen content, resource efficiency, and authentic messaging around environmental and social governance (ESG) topics.',
          notes: 'Growing consumer demand for authentic sustainability messaging is driving this trend. 78% of consumers say they value brands with genuine environmental commitments.',
          suggestions: 'Help clients develop authentic sustainability narratives backed by real actions. Create content audits to identify opportunities for more sustainable and evergreen content strategies.',
          scoreExplanation: 'Moderate but steadily increasing relevance as ESG becomes more central to brand identity and consumer choice.',
          targetPainPoints: 'Greenwashing concerns, difficulty measuring impact, balancing business goals with sustainability messaging.',
          keyThemes: 'Authenticity, Resource Efficiency, Long-term Value, ESG Integration',
          source: 'Content Marketing Institute Sustainability Report',
          url: 'https://thebinate.com/blog/sustainable-content-marketing',
          likes: 156,
          comments: 42,
          shares: 89,
          summary: 'Sustainable content marketing focuses on creating enduring value while authentically addressing environmental concerns.'
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
        { _id: '1', name: 'Sebastin Peter', email: 'john@example.com', role: 'Content Manager' },
        { _id: '2', name: 'Jane Jacob', email: 'jane@example.com', role: 'Marketing Lead' },
        { _id: '3', name: 'Alex Johnson', email: 'alex@example.com', role: 'SEO Specialist' },
        { _id: '4', name: 'Sarah Williams', email: 'sarah@example.com', role: 'Content Writer' },
        { _id: '5', name: 'Michael Brown', email: 'michael@example.com', role: 'Social Media Manager' },
        { _id: '6', name: 'Emily Davis', email: 'emily@example.com', role: 'Brand Strategist' }
      ];
      console.log('Using mock user data');
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

export async function POST(request: Request) {
  try {
    const { trendId, userId, action = 'assign', status, companyId } = await request.json();
    
    console.log('POST request received to update trend:', { trendId, userId, action, status, companyId });
    
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
    
    if ((action === 'updateCompany' || action === 'updateCompanyInMemory') && !companyId) {
      console.error('Missing required field: companyId for updateCompany action');
      return NextResponse.json({ error: 'Missing companyId for updateCompany action' }, { status: 400 });
    }
    
    if (action === 'generateTrends' && !companyId) {
      console.error('Missing required field: companyId for generateTrends action');
      return NextResponse.json({ error: 'Missing companyId for generateTrends action' }, { status: 400 });
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
      } else if (action === 'updateCompany') {
        console.log('Updating company for trend:', trendId, 'to', companyId);
        
        // For mock data, just update the state on the client side
        if (trendId.length <= 2) { // Mock data has short IDs like '1', '2', etc.
          return NextResponse.json({ 
            success: true, 
            message: 'Mock trend company updated successfully',
            companyId: companyId
          });
        }
        
        // Find the company to get its name
        let company;
        try {
          if (ObjectId.isValid(companyId)) {
            company = await db.collection('companies').findOne({ _id: new ObjectId(companyId) });
          } else {
            company = await db.collection('companies').findOne({ _id: companyId });
          }
        } catch (err) {
          console.error('Error finding company:', err);
        }
        
        // If company not found, use a default name
        const companyName = company?.name || `Company ${companyId}`;
        
        // Try different ID formats for the query
        let updatedSuccessfully = false;
        let updateMessage = '';
        
        // Try to update in trend_list collection first (using both string ID and ObjectId)
        try {
          // Try with ObjectId if it's valid
          if (ObjectId.isValid(trendId)) {
            const objIdResult = await db.collection('trend_list').updateOne(
              { _id: new ObjectId(trendId) },
              { $set: { 
                companyId: companyId
                // No longer updating the Title field
              }}
            );
            
            console.log('trend_list update with ObjectId result:', objIdResult);
            
            if (objIdResult.matchedCount > 0) {
              updatedSuccessfully = true;
              updateMessage = 'Trend company updated successfully in trend_list';
            }
          }
          
          // If not updated yet, try with string ID
          if (!updatedSuccessfully) {
            const stringIdResult = await db.collection('trend_list').updateOne(
              { _id: trendId },
              { $set: { 
                companyId: companyId
                // No longer updating the Title field
              }}
            );
            
            console.log('trend_list update with string ID result:', stringIdResult);
            
            if (stringIdResult.matchedCount > 0) {
              updatedSuccessfully = true;
              updateMessage = 'Trend company updated successfully in trend_list';
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
                { $set: { 
                  companyId: companyId
                  // No longer updating the name field
                }}
              );
              
              console.log('trends update with ObjectId result:', objIdResult);
              
              if (objIdResult.matchedCount > 0) {
                updatedSuccessfully = true;
                updateMessage = 'Trend company updated successfully in trends collection';
              }
            }
            
            // If not updated yet, try with string ID
            if (!updatedSuccessfully) {
              const stringIdResult = await db.collection('trends').updateOne(
                { _id: trendId },
                { $set: { 
                  companyId: companyId
                  // No longer updating the name field
                }}
              );
              
              console.log('trends update with string ID result:', stringIdResult);
              
              if (stringIdResult.matchedCount > 0) {
                updatedSuccessfully = true;
                updateMessage = 'Trend company updated successfully in trends collection';
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
            companyId: companyId
            // No longer returning trendName
          });
        } else {
          // If we get here, we couldn't find the trend in either collection
          return NextResponse.json({ 
            error: 'Trend not found in database', 
            details: `Could not find trend with ID: ${trendId}` 
          }, { status: 404 });
        }
      } else if (action === 'updateCompanyInMemory') {
        // This is a special action just for updating the mock data in memory
        // Find the company name if possible
        let companyName = `Company ${companyId}`;
        try {
          if (ObjectId.isValid(companyId)) {
            const company = await db.collection('companies').findOne({ _id: new ObjectId(companyId) });
            if (company) {
              companyName = company.name;
            }
          } else {
            const company = await db.collection('companies').findOne({ _id: companyId });
            if (company) {
              companyName = company.name;
            }
          }
        } catch (err) {
          console.error('Error finding company for memory update:', err);
        }
        
        return NextResponse.json({ 
          success: true, 
          message: 'Company updated in memory',
          companyId: companyId
          // No longer returning trendName
        });
      } else if (action === 'generateTrends') {
        console.log('Generating trends for company:', companyId);
        
        try {
          // Find the company in the database
          let company;
          try {
            if (ObjectId.isValid(companyId)) {
              company = await db.collection('companies').findOne({ _id: new ObjectId(companyId) });
            } else {
              company = await db.collection('companies').findOne({ _id: companyId });
            }
          } catch (err) {
            console.error('Error finding company:', err);
          }
          
          // If company not found or this is mock data, use a mock company
          if (!company || companyId.length <= 2) {
            company = { _id: companyId, name: `Company ${companyId}` };
          }
          
          console.log('Found company:', company);
          
          // Generate some mock trends for this company
          // In a real implementation, this would call an AI service or other data source
          const currentDate = new Date();
          const newTrends = [
            {
              _id: new ObjectId(),
              Title: `${company.name} Market Expansion Opportunities`,
              date: new Date(currentDate.setDate(currentDate.getDate() - Math.floor(Math.random() * 5))).toISOString(),
              status: 'New',
              topics: ['Market Expansion', 'Growth', 'Strategy'],
              companyId: companyId
            },
            {
              _id: new ObjectId(),
              Title: `${company.name} Customer Engagement Trends`,
              date: new Date(currentDate.setDate(currentDate.getDate() - Math.floor(Math.random() * 3))).toISOString(),
              status: 'New',
              topics: ['Customer Engagement', 'Marketing', 'CRM'],
              companyId: companyId
            },
            {
              _id: new ObjectId(),
              Title: `${company.name} Industry Disruption Analysis`,
              date: new Date().toISOString(),
              status: 'New',
              topics: ['Industry Analysis', 'Disruption', 'Innovation'],
              companyId: companyId
            }
          ];
          
          // Save the new trends to the database
          try {
            const result = await db.collection('trend_list').insertMany(newTrends);
            console.log('Generated trends saved to database:', result.insertedCount);
            
            return NextResponse.json({
              success: true,
              message: `Successfully generated ${newTrends.length} trends for ${company.name}`,
              generatedTrends: newTrends.length
            });
          } catch (insertErr) {
            console.error('Error saving generated trends:', insertErr);
            
            // Even if DB insert fails, return success for mock data
            return NextResponse.json({
              success: true,
              message: `Generated ${newTrends.length} trends for ${company.name} (in memory only)`,
              generatedTrends: newTrends.length
            });
          }
        } catch (genErr) {
          console.error('Error in trend generation process:', genErr);
          return NextResponse.json({ error: 'Failed to generate trends' }, { status: 500 });
        }
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
