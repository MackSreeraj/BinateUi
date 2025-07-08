import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { platformId } = await request.json();
    
    if (!platformId) {
      return NextResponse.json(
        { error: 'Platform ID is required' },
        { status: 400 }
      );
    }

    // First try the test endpoint
    const webhookUrl = new URL('https://n8n.srv775152.hstgr.cloud/webhook/7581af18-09d1-4b08-b7f5-bd70bf32d800');
    webhookUrl.searchParams.set('platformId', platformId);
    
    try {
      const response = await fetch(webhookUrl.toString(), {
        method: 'GET',
      });

      if (!response.ok) {
        const errorText = await response.text();
        const errorData = JSON.parse(errorText);
        
        if (errorData.code === 404 && errorData.message.includes('not registered')) {
          // If test endpoint fails, try the regular endpoint
          const regularWebhookUrl = new URL('https://n8n.srv775152.hstgr.cloud/webhook/7581af18-09d1-4b08-b7f5-bd70bf32d800');
          regularWebhookUrl.searchParams.set('companyId', companyId);
          
          const regularResponse = await fetch(regularWebhookUrl.toString(), {
            method: 'GET',
          });

          if (!regularResponse.ok) {
            const regularErrorText = await regularResponse.text();
            throw new Error(`Workflow failed with status ${regularResponse.status}: ${regularErrorText}`);
          }

          const regularResponseText = await regularResponse.text();
          console.log('Regular workflow response:', regularResponseText);

          return NextResponse.json({
            success: true,
            message: 'Workflow triggered successfully (using regular endpoint)',
            response: regularResponseText
          });
        } else {
          throw new Error(`Workflow failed with status ${response.status}: ${errorText}`);
        }
      }

      // If test endpoint succeeds
      const testResponseText = await response.text();
      console.log('Test workflow response:', testResponseText);

      return NextResponse.json({
        success: true,
        message: 'Workflow triggered successfully (using test endpoint)',
        response: testResponseText
      });
    } catch (error) {
      console.error('Workflow error:', error);
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: 'Workflow triggered successfully',
    });
  } catch (error) {
    console.error('Error triggering workflow:', error);
    return NextResponse.json(
      { error: 'Failed to trigger workflow' },
      { status: 500 }
    );
  }
}
