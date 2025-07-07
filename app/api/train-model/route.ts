import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { companyId } = await request.json();
    
    // This will trigger the n8n workflow
    const response = await fetch(`https://n8n.srv775152.hstgr.cloud/webhook/7581af18-09d1-4b08-b7f5-bd70bf32d800?companyId=${companyId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to start training workflow');
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in training model proxy:', error);
    return NextResponse.json(
      { error: 'Failed to start training' },
      { status: 500 }
    );
  }
}
