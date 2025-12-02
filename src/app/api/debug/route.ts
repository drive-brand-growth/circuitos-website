import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.ANTHROPIC_API_KEY || '';

  return NextResponse.json({
    hasApiKey: apiKey.length > 0,
    keyLength: apiKey.length,
    keyPrefix: apiKey.substring(0, 10) + '...',
    nodeEnv: process.env.NODE_ENV,
  });
}
