import { NextRequest, NextResponse } from 'next/server';
import { getWebhooks, deleteOldWebhooks } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Clean up old webhooks (older than 24 hours)
    deleteOldWebhooks();

    const { searchParams } = new URL(request.url);
    const minutes = parseInt(searchParams.get('minutes') || '30', 10);
    const uid = searchParams.get('uid') || undefined;

    const webhooks = getWebhooks(minutes, uid);

    return NextResponse.json({ 
      success: true,
      data: webhooks,
      count: webhooks.length
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching webhooks:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to fetch webhooks' 
    }, { status: 500 });
  }
}
