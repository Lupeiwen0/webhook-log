import { NextRequest, NextResponse } from 'next/server';
import { insertWebhook, deleteOldWebhooks } from '@/lib/db';

async function handleWebhook(request: NextRequest) {
  try {
    // Clean up old webhooks (older than 24 hours)
    deleteOldWebhooks();

    const url = request.url;
    const method = request.method;
    const headers = JSON.stringify(Object.fromEntries(request.headers));
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const query = searchParams.toString();

    // Try to get body for methods that support it
    let body: string | undefined;
    if (method !== 'GET') {
      try {
        const contentType = request.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const jsonBody = await request.json();
          body = JSON.stringify(jsonBody);
        } else {
          const textBody = await request.text();
          body = textBody;
        }
      } catch {
        body = '';
      }
    }

    const id = insertWebhook({
      method,
      url,
      headers,
      body,
      query,
      ip
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Webhook received',
      id 
    }, { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to process webhook' 
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return handleWebhook(request);
}

export async function POST(request: NextRequest) {
  return handleWebhook(request);
}

export async function PUT(request: NextRequest) {
  return handleWebhook(request);
}

export async function DELETE(request: NextRequest) {
  return handleWebhook(request);
}

export async function PATCH(request: NextRequest) {
  return handleWebhook(request);
}
