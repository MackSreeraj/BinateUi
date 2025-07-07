import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const writerId = params.id;
    console.log('Searching for platform profile with writerId:', writerId);

    // List all collections for debugging
    const collections = await db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));

    // Find the platform profile where obj_id matches the writer's ID
    const platformProfile = await db.collection('platform_profiles').findOne({
      obj_id: writerId
    });

    console.log('Query result:', platformProfile);

    if (!platformProfile) {
      // Try to find any document in the collection for debugging
      const anyDoc = await db.collection('platform_profiles').findOne({});
      console.log('Sample document from collection:', anyDoc);
      
      return new NextResponse(
        JSON.stringify({ 
          error: 'Platform profile not found',
          searchedWith: { obj_id: writerId },
          availableCollections: collections.map(c => c.name)
        }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Transform the data to match our frontend interface
    const transformedData = {
      _id: platformProfile._id?.toString(),
      platformSummary: platformProfile['Platform Summary'] || '',
      contentStructureGuide: platformProfile['Content Structure Guide'] || '',
      engagementTechniques: platformProfile['Engagement Techniques'] || '',
      visualElements: platformProfile['Visual Elements'] || '',
      algoConsiderations: platformProfile['Algo Considerations'] || '',
      platformCulture: platformProfile['Platform Culture'] || '',
      technicalGuidelines: platformProfile['Technical Guidelines'] || '',
      doAndDontList: platformProfile['Do & Dont List']?.split('\n').filter(Boolean) || [],
      exampleTransformations: platformProfile['Example Transformations']?.split('\n').filter(Boolean) || [],
      apiReadyInstructions: platformProfile['API Ready Instructions'] || '',
      train: platformProfile['Train'] || false
    };

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Error fetching platform profile:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch platform profile' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
