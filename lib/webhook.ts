/**
 * Utility function to trigger a webhook after user creation
 * @param recordId The MongoDB record ID of the created user
 */
export async function triggerUserCreatedWebhook(recordId: string): Promise<void> {
  const webhookBaseUrl = 'https://n8n.srv775152.hstgr.cloud/webhook/99624a92-f6d0-49a7-9bf2-a0b3294a11eb';
  const webhookUrl = new URL(webhookBaseUrl);
  webhookUrl.searchParams.append('recordId', recordId);
  
  try {
    const response = await fetch(webhookUrl.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Webhook request failed:', await response.text());
    } else {
      console.log('Webhook triggered successfully for record:', recordId);
    }
  } catch (error) {
    console.error('Error triggering webhook:', error);
  }
}
