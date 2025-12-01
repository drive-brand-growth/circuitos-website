import { NextRequest, NextResponse } from 'next/server';
import {
  evaluateGymDMN,
  calculateLicenseeScore,
  ALL_GYM_DMN_TABLES,
  LicenseeFeatures,
  DMNContext
} from '@/lib/dmn/gym-fitness-dmn';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, context, features, tables } = body;

    switch (action) {
      case 'evaluate': {
        // Evaluate DMN decision tables
        if (!context) {
          return NextResponse.json(
            { error: 'Context is required for DMN evaluation' },
            { status: 400 }
          );
        }
        const results = evaluateGymDMN(context as DMNContext, tables);
        return NextResponse.json({
          success: true,
          action: 'evaluate',
          results,
          timestamp: new Date().toISOString()
        });
      }

      case 'score-licensee': {
        // Calculate licensee qualification score
        if (!features) {
          return NextResponse.json(
            { error: 'Features are required for licensee scoring' },
            { status: 400 }
          );
        }
        const score = calculateLicenseeScore(features as LicenseeFeatures);
        return NextResponse.json({
          success: true,
          action: 'score-licensee',
          score,
          timestamp: new Date().toISOString()
        });
      }

      case 'route-lead': {
        // Route a lead based on engagement and context
        if (!context) {
          return NextResponse.json(
            { error: 'Context is required for lead routing' },
            { status: 400 }
          );
        }
        const routing = evaluateGymDMN(context as DMNContext, ['lead']);
        return NextResponse.json({
          success: true,
          action: 'route-lead',
          routing: routing.leadRouting,
          timestamp: new Date().toISOString()
        });
      }

      case 'assign-membership': {
        // Assign membership tier
        if (!context) {
          return NextResponse.json(
            { error: 'Context is required for membership assignment' },
            { status: 400 }
          );
        }
        const membership = evaluateGymDMN(context as DMNContext, ['membership']);
        return NextResponse.json({
          success: true,
          action: 'assign-membership',
          membership: membership.membershipTier,
          timestamp: new Date().toISOString()
        });
      }

      case 'match-trainer': {
        // Match member with trainer
        if (!context) {
          return NextResponse.json(
            { error: 'Context is required for trainer matching' },
            { status: 400 }
          );
        }
        const trainer = evaluateGymDMN(context as DMNContext, ['trainer']);
        return NextResponse.json({
          success: true,
          action: 'match-trainer',
          trainer: trainer.trainerAllocation,
          timestamp: new Date().toISOString()
        });
      }

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}. Valid actions: evaluate, score-licensee, route-lead, assign-membership, match-trainer` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Gym DMN API error:', error);
    return NextResponse.json(
      { error: 'Failed to process DMN request', details: String(error) },
      { status: 500 }
    );
  }
}

// GET endpoint returns available tables and their configuration
export async function GET() {
  return NextResponse.json({
    version: '1.0.0',
    business_type: 'Gym/Fitness',
    tables: Object.entries(ALL_GYM_DMN_TABLES).map(([key, table]) => ({
      id: table.id,
      name: table.name,
      description: table.description,
      hitPolicy: table.hitPolicy,
      inputs: table.inputs,
      outputs: table.outputs,
      ruleCount: table.rules.length
    })),
    actions: [
      { action: 'evaluate', description: 'Evaluate all or specific DMN tables' },
      { action: 'score-licensee', description: 'Calculate licensee qualification score (50-feature system)' },
      { action: 'route-lead', description: 'Route and prioritize incoming leads' },
      { action: 'assign-membership', description: 'Assign membership tier based on goals' },
      { action: 'match-trainer', description: 'Match member with appropriate trainer' }
    ],
    example_requests: {
      'score-licensee': {
        action: 'score-licensee',
        features: {
          net_worth: 750000,
          liquid_capital: 200000,
          credit_score: 760,
          years_training: 8,
          business_experience: 4,
          brand_alignment: 85,
          grit_score: 7,
          financial_literacy: 75,
          management_experience: 3,
          market_population: 150000,
          hardcore_gym_gap: true,
          competitor_density: 5
        }
      },
      'route-lead': {
        action: 'route-lead',
        context: {
          lead_source: 'website',
          budget_indicated: 89,
          timeline: 'this_month',
          engagement_score: 72,
          referral_source: null
        }
      },
      'assign-membership': {
        action: 'assign-membership',
        context: {
          training_goal: 'bodybuilding',
          experience_level: 4,
          budget: 100,
          commitment_hours: 12,
          competition_interest: false
        }
      }
    }
  });
}
