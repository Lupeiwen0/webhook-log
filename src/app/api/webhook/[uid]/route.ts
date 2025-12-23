import { NextRequest, NextResponse } from 'next/server';
import { insertWebhook, deleteOldWebhooks } from '@/lib/db';

// Validate UID: 8-14 characters, alphanumeric only
function isValidUid(uid: string): boolean {
  return /^[a-zA-Z0-9]{8,14}$/.test(uid);
}

async function handleWebhook(request: NextRequest, context: { params: Promise<{ uid: string }> }) {
  try {
    const params = await context.params;
    const uid = params.uid;

    // Validate UID
    if (!isValidUid(uid)) {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid UID. UID must be 8-14 alphanumeric characters.' 
      }, { status: 400 });
    }

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
      uid,
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
      id,
      uid
    }, { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to process webhook' 
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest, context: { params: Promise<{ uid: string }> }) {
  return handleWebhook(request, context);
}

export async function POST(request: NextRequest, context: { params: Promise<{ uid: string }> }) {
  return handleWebhook(request, context);
}

export async function PUT(request: NextRequest, context: { params: Promise<{ uid: string }> }) {
  return handleWebhook(request, context);
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ uid: string }> }) {
  return handleWebhook(request, context);
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ uid: string }> }) {
  return handleWebhook(request, context);
}
