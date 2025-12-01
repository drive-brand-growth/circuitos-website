import { NextRequest, NextResponse } from 'next/server';
import { scoreLeadDMN, LeadScoringInput, LeadScore } from '@/lib/dmn-engine';
import { batchProcessLeads } from '@/lib/claude-agent';

// In-memory storage for demo (would use Supabase in production)
const leadsStore: Array<{
  id: string;
  data: LeadScoringInput;
  score: LeadScore;
  createdAt: string;
  status: 'new' | 'qualified' | 'contacted' | 'converted';
}> = [];

export async function GET() {
  return NextResponse.json({
    leads: leadsStore,
    summary: {
      total: leadsStore.length,
      byTier: {
        A: leadsStore.filter(l => l.score.tier === 'A').length,
        B: leadsStore.filter(l => l.score.tier === 'B').length,
        C: leadsStore.filter(l => l.score.tier === 'C').length,
        D: leadsStore.filter(l => l.score.tier === 'D').length,
        F: leadsStore.filter(l => l.score.tier === 'F').length,
      },
      averageScore: leadsStore.length > 0
        ? Math.round(leadsStore.reduce((sum, l) => sum + l.score.totalScore, 0) / leadsStore.length)
        : 0,
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Handle batch upload
    if (Array.isArray(body.leads)) {
      const results = await batchProcessLeads(body.leads);

      const newLeads = results.map(({ lead, score }) => ({
        id: crypto.randomUUID(),
        data: lead,
        score,
        createdAt: new Date().toISOString(),
        status: 'new' as const,
      }));

      leadsStore.push(...newLeads);

      return NextResponse.json({
        success: true,
        processed: newLeads.length,
        leads: newLeads,
        summary: {
          tierBreakdown: {
            A: newLeads.filter(l => l.score.tier === 'A').length,
            B: newLeads.filter(l => l.score.tier === 'B').length,
            C: newLeads.filter(l => l.score.tier === 'C').length,
            D: newLeads.filter(l => l.score.tier === 'D').length,
            F: newLeads.filter(l => l.score.tier === 'F').length,
          },
        },
      });
    }

    // Handle single lead
    const leadData: LeadScoringInput = body;
    const score = scoreLeadDMN(leadData);

    const newLead = {
      id: crypto.randomUUID(),
      data: leadData,
      score,
      createdAt: new Date().toISOString(),
      status: 'new' as const,
    };

    leadsStore.push(newLead);

    return NextResponse.json({
      success: true,
      lead: newLead,
    });
  } catch (error) {
    console.error('Lead processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process lead', details: String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  leadsStore.length = 0;
  return NextResponse.json({ success: true, message: 'All leads cleared' });
}
