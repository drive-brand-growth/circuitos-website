import { NextRequest, NextResponse } from 'next/server';
import { processWithAgent } from '@/lib/claude-agent';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { message, leadData, mode = 'chat', context } = body;

    if (!message && !leadData) {
      return NextResponse.json(
        { error: 'Message or lead data required' },
        { status: 400 }
      );
    }

    const result = await processWithAgent({
      message: message || 'Analyze this lead',
      leadData,
      mode,
      context,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Agent error:', error);
    return NextResponse.json(
      { error: 'Failed to process request', details: String(error) },
      { status: 500 }
    );
  }
}
