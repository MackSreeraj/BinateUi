import { NextResponse } from 'next/server';
import { MongoClient, ObjectId, WithId, Document } from 'mongodb';

// Interface for the raw database document
interface PlatformProfileDocument extends WithId<Document> {
  _id: ObjectId;
  obj_id: string;
  'Style Profile Summary'?: string;
  'Full Style Guide'?: string;
  'Do & Dont List'?: string | string[];
  'Example Tranformations'?: string | string[];
  'API Ready Instructions'?: string;
  [key: string]: unknown;
}

// Interface for the transformed response
interface TransformedProfile {
  _id: string;
  styleProfileSummary: string;
  fullStyleGuide: string;
  doAndDontList: string[];
  exampleTransformations: string[];
  apiReadyInstructions: string;
}

const clientPromise = new MongoClient(process.env.MONGODB_URI || '').connect();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const client = await clientPromise;
    const db = client.db();
    const writerId = params.id;
    
    // 1. Try to find the profile in writer_profiles collection using obj_id
    const profile = await db.collection<PlatformProfileDocument>('writer_profiles')
      .findOne({ obj_id: writerId });
    
    if (!profile) {
      const errorResponse = { 
        error: 'Writer profile not found',
        searchedWith: { obj_id: writerId },
        collection: 'writer_profiles'
      };
      
      return new NextResponse(
        JSON.stringify(errorResponse),
        { 
          status: 404, 
          headers: { 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }
    
    // 2. Process the data
    const processProfile = (data: PlatformProfileDocument): TransformedProfile => {
      // Process Do & Don't List
      let doAndDontList: string[] = [];
      const doAndDontContent = data['Do & Dont List'];
      
      if (doAndDontContent) {
        if (Array.isArray(doAndDontContent)) {
          doAndDontList = doAndDontContent;
        } else if (typeof doAndDontContent === 'string') {
          // Extract content after the first line (which is the header)
          const lines = doAndDontContent.split('\n').slice(1);
          doAndDontList = lines
            .map(line => line.trim())
            .filter(line => line.startsWith('- '))
            .map(line => line.substring(2));
        }
      }
      
      // Process example transformations
      let exampleTransformations: string[] = [];
      const examplesContent = data['Example Tranformations'];
      if (examplesContent) {
        exampleTransformations = Array.isArray(examplesContent) 
          ? examplesContent 
          : examplesContent.split('\n').filter(Boolean);
      }
      
      // Process other fields with their exact database field names
      return {
        _id: data._id.toString(),
        styleProfileSummary: data['Style Profile Summary'] || '',
        fullStyleGuide: data['Full Style Guide'] || '',
        doAndDontList,
        exampleTransformations,
        apiReadyInstructions: data['API Ready Instructions'] || ''
      };
    };
    
    const transformedData = processProfile(profile);
    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Error in platform profile API:', error);
    return new NextResponse(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
}
