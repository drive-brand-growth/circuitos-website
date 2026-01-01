# CircuitOS Funnel Engine - Supabase Setup

## Quick Setup

### 1. Create Supabase Project
If you don't have one already, create a project at [supabase.com](https://supabase.com)

### 2. Run the Migration

**Option A: Via SQL Editor (Easiest)**
1. Go to your Supabase Dashboard
2. Click "SQL Editor" in the sidebar
3. Click "New Query"
4. Copy/paste contents of `supabase/migrations/001_funnel_configuration.sql`
5. Click "Run"

**Option B: Via Supabase CLI**
```bash
# Login to Supabase
supabase login

# Link to your project (get project ID from dashboard)
supabase link --project-ref YOUR_PROJECT_ID

# Push the migration
supabase db push
```

### 3. Get Your Credentials

From Supabase Dashboard → Settings → API:
- **Project URL**: `https://xxxxx.supabase.co`
- **Anon Key**: `eyJhbGciOi...`
- **Service Role Key**: `eyJhbGciOi...` (for server-side)

### 4. Create .env File

```bash
cp .env.example .env
```

Then fill in:
```env
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
```

## Schema Overview

| Table | Purpose |
|-------|---------|
| `funnels` | Main funnel configuration (name, type, offer, pricing) |
| `funnel_pages` | Individual pages with sections as JSONB |
| `funnel_bonuses` | Value stack items |
| `funnel_testimonials` | Social proof elements |
| `funnel_guarantees` | Risk reversal elements |
| `lead_scoring_rules` | DMN-style scoring rules by field/value |
| `tier_routing` | Where each tier (HOT/WARM/COLD) gets routed |

## Example Queries

### Get Funnel with All Related Data
```sql
SELECT
    f.*,
    json_agg(DISTINCT fp.*) as pages,
    json_agg(DISTINCT fb.*) as bonuses,
    json_agg(DISTINCT ft.*) as testimonials
FROM funnels f
LEFT JOIN funnel_pages fp ON f.id = fp.funnel_id
LEFT JOIN funnel_bonuses fb ON f.id = fb.funnel_id
LEFT JOIN funnel_testimonials ft ON f.id = ft.funnel_id
WHERE f.name = 'MetroFlex Gym Licensing'
GROUP BY f.id;
```

### Get Tier Routing Rules
```sql
SELECT tier, route_type, route_url
FROM tier_routing
WHERE funnel_id = 'YOUR_FUNNEL_ID'
ORDER BY
    CASE tier
        WHEN 'HOT' THEN 1
        WHEN 'WARM' THEN 2
        WHEN 'NURTURE' THEN 3
        WHEN 'COLD' THEN 4
    END;
```

### Insert Lead Scoring Rules for Timeline
```sql
INSERT INTO lead_scoring_rules (funnel_id, rule_name, field_name, field_value, score, tier, action)
VALUES
    ('YOUR_FUNNEL_ID', 'Ready Now', 'timeline', 'immediate', 95, 'HOT', 'Call within 1 hour'),
    ('YOUR_FUNNEL_ID', 'Within 30 Days', 'timeline', '30days', 75, 'WARM', 'Call within 24 hours'),
    ('YOUR_FUNNEL_ID', 'Within 90 Days', 'timeline', '90days', 50, 'NURTURE', 'Add to email sequence'),
    ('YOUR_FUNNEL_ID', 'Just Exploring', 'timeline', 'exploring', 25, 'COLD', 'Add to long-term nurture');
```

## Python Integration

```python
from supabase import create_client
import os

supabase = create_client(
    os.environ["SUPABASE_URL"],
    os.environ["SUPABASE_SERVICE_KEY"]
)

# Get funnel configuration
funnel = supabase.table("funnels").select("*").eq("name", "MetroFlex Gym Licensing").single().execute()

# Get scoring rules
rules = supabase.table("lead_scoring_rules").select("*").eq("funnel_id", funnel.data["id"]).execute()

# Score a lead
def score_lead(timeline: str, funnel_id: str) -> dict:
    rule = supabase.table("lead_scoring_rules") \
        .select("*") \
        .eq("funnel_id", funnel_id) \
        .eq("field_name", "timeline") \
        .eq("field_value", timeline) \
        .single() \
        .execute()
    return rule.data
```

## Next Steps

1. Run the migration
2. Add your Supabase credentials to `.env`
3. Update `preview_server.py` to use Supabase for lead storage
4. Deploy funnel configuration via Supabase dashboard
