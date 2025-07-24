import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    console.log('[N8N-PROXY] Processing webhook proxy request');
    const body = await request.json();
    console.log('[N8N-PROXY] Received payload:', body);
    
    // Extract parameters from the request body
    const {
      trendId,
      trendName,
      companyId,
      writerId,
      platformId,
      userId,
      status,
      specificitiesDraft,
      specificitiesForImages
    } = body;
    
    // Validate required parameters
    if (!trendId || !companyId || !writerId || !platformId) {
      console.error('[N8N-PROXY] Missing required parameters');
      return NextResponse.json({ 
        error: 'Missing required parameters',
        requiredParams: ['trendId', 'companyId', 'writerId', 'platformId']
      }, { status: 400 });
    }
    
    // Prepare the webhook payload as query parameters
    const webhookParams = new URLSearchParams();
    webhookParams.append('trendId', trendId);
    webhookParams.append('trendName', trendName || '');
    webhookParams.append('companyId', companyId);
    webhookParams.append('writerId', writerId);
    webhookParams.append('platformId', platformId);
    webhookParams.append('userId', userId || '');
    webhookParams.append('status', status || '');
    webhookParams.append('specificitiesDraft', specificitiesDraft || '');
    webhookParams.append('specificitiesForImages', specificitiesForImages || '');
    webhookParams.append('timestamp', new Date().toISOString());
    
    // External n8n webhook URL with query parameters
    const webhookUrl = `https://n8n.srv775152.hstgr.cloud/webhook/555252a2-14d0-4fd8-b570-c70034b3c800?${webhookParams.toString()}`;
    
    console.log('[N8N-PROXY] Forwarding request to:', webhookUrl);
    
    // Call the external webhook with GET method from the server side
    const response = await fetch(webhookUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[N8N-PROXY] External webhook returned error:', response.status, errorText);
      return NextResponse.json({ 
        error: 'External webhook returned an error',
        status: response.status,
        details: errorText
      }, { status: 502 });
    }
    
    // Parse the response from the external webhook
    const result = await response.json().catch(error => {
      console.error('[N8N-PROXY] Error parsing webhook response:', error);
      return { error: 'Failed to parse webhook response' };
    });
    
    console.log('[N8N-PROXY] External webhook response:', result);
    
    // Return the response from the external webhook
    return NextResponse.json({ 
      success: true, 
      message: 'Webhook request forwarded successfully',
      result
    }, { status: 200 });
    
  } catch (error) {
    console.error('[N8N-PROXY] Error processing webhook proxy request:', error);
    return NextResponse.json({ 
      error: 'Failed to process webhook proxy request',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
