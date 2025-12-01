import { NextRequest, NextResponse } from 'next/server';
import { evaluateDMN, DMNInput } from '@/lib/dmn-engine';

export async function POST(request: NextRequest) {
  try {
    const body: DMNInput = await request.json();

    if (!body.context) {
      return NextResponse.json(
        { error: 'Context is required for DMN evaluation' },
        { status: 400 }
      );
    }

    const result = evaluateDMN(body);

    return NextResponse.json({
      success: true,
      evaluation: result,
      input: body,
    });
  } catch (error) {
    console.error('DMN evaluation error:', error);
    return NextResponse.json(
      { error: 'Failed to evaluate DMN', details: String(error) },
      { status: 500 }
    );
  }
}

// Get DMN tables info
export async function GET() {
  return NextResponse.json({
    tables: [
      {
        id: 1,
        name: 'Task Classification',
        hitPolicy: 'Priority (P)',
        rules: 10,
        description: 'Classifies incoming tasks by type',
      },
      {
        id: 2,
        name: 'Security Level Assignment',
        hitPolicy: 'First (F)',
        rules: 8,
        description: 'Determines security requirements',
      },
      {
        id: 3,
        name: 'Repair Strategy Selection',
        hitPolicy: 'Priority (P)',
        rules: 11,
        description: 'Selects repair approach for errors',
      },
      {
        id: 4,
        name: 'Model Selection',
        hitPolicy: 'First (F)',
        rules: 10,
        description: 'Chooses appropriate AI model',
      },
      {
        id: 5,
        name: 'Awareness Operation Routing',
        hitPolicy: 'First (F)',
        rules: 12,
        description: 'Routes Schwartz awareness levels',
      },
      {
        id: 6,
        name: 'ML Operation Routing',
        hitPolicy: 'Priority (P)',
        rules: 16,
        description: 'Routes ML pipeline operations',
      },
      {
        id: 14,
        name: 'Virtual LPR Digital Routing',
        hitPolicy: 'Priority (P)',
        rules: 14,
        description: 'Routes digital traffic intelligence',
      },
    ],
    status: 'operational',
    version: '1.0.0',
  });
}
