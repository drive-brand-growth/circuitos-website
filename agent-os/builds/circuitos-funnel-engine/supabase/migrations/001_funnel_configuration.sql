-- CircuitOS Funnel Engine - Supabase Schema
-- Run this in Supabase SQL Editor or via CLI

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- FUNNELS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS funnels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('HIGH_TICKET', 'COURSE', 'ECOMMERCE', 'LEAD_GEN', 'WEBINAR')),
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'archived')),

    -- Offer details
    offer_name VARCHAR(255),
    offer_price DECIMAL(10,2),
    offer_description TEXT,
    target_audience TEXT,
    unique_mechanism TEXT,

    -- Awareness & scoring
    awareness_level VARCHAR(50) CHECK (awareness_level IN ('unaware', 'problem_aware', 'solution_aware', 'product_aware', 'most_aware')),

    -- Metrics
    expected_conversion_rate DECIMAL(5,4),
    ingredient_scores JSONB DEFAULT '{}',

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- FUNNEL PAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS funnel_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    funnel_id UUID REFERENCES funnels(id) ON DELETE CASCADE,

    page_number INTEGER NOT NULL,
    page_type VARCHAR(50) NOT NULL CHECK (page_type IN ('lead_magnet', 'sales', 'application', 'thank_you', 'vsl', 'order', 'upsell', 'downsell')),
    title VARCHAR(255),

    -- Sections stored as JSONB array
    sections JSONB DEFAULT '[]',

    -- Page-specific settings
    settings JSONB DEFAULT '{}',

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(funnel_id, page_number)
);

-- ============================================
-- FUNNEL BONUSES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS funnel_bonuses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    funnel_id UUID REFERENCES funnels(id) ON DELETE CASCADE,

    name VARCHAR(255) NOT NULL,
    description TEXT,
    value DECIMAL(10,2),
    type VARCHAR(50) CHECK (type IN ('ebook', 'template', 'training', 'community', 'software', 'coaching')),

    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- FUNNEL TESTIMONIALS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS funnel_testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    funnel_id UUID REFERENCES funnels(id) ON DELETE CASCADE,

    name VARCHAR(255) NOT NULL,
    role VARCHAR(255),
    quote TEXT NOT NULL,
    result VARCHAR(255),
    image_url VARCHAR(500),

    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- FUNNEL GUARANTEES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS funnel_guarantees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    funnel_id UUID REFERENCES funnels(id) ON DELETE CASCADE,

    type VARCHAR(50) CHECK (type IN ('money_back', 'satisfaction', 'results', 'territory_protection', 'custom')),
    duration_days INTEGER,
    description TEXT NOT NULL,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- LEAD SCORING RULES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS lead_scoring_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    funnel_id UUID REFERENCES funnels(id) ON DELETE CASCADE,

    rule_name VARCHAR(255) NOT NULL,
    field_name VARCHAR(100) NOT NULL,
    field_value VARCHAR(255) NOT NULL,

    score INTEGER NOT NULL,
    tier VARCHAR(20) CHECK (tier IN ('HOT', 'WARM', 'NURTURE', 'COLD')),
    action VARCHAR(255),

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TIER ROUTING TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS tier_routing (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    funnel_id UUID REFERENCES funnels(id) ON DELETE CASCADE,

    tier VARCHAR(20) NOT NULL CHECK (tier IN ('HOT', 'WARM', 'NURTURE', 'COLD')),
    route_type VARCHAR(50) NOT NULL CHECK (route_type IN ('calendar', 'vsl', 'thank_you', 'download', 'custom')),
    route_url VARCHAR(500),

    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(funnel_id, tier)
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_funnels_status ON funnels(status);
CREATE INDEX idx_funnels_type ON funnels(type);
CREATE INDEX idx_funnel_pages_funnel_id ON funnel_pages(funnel_id);
CREATE INDEX idx_funnel_bonuses_funnel_id ON funnel_bonuses(funnel_id);
CREATE INDEX idx_lead_scoring_rules_funnel_id ON lead_scoring_rules(funnel_id);

-- ============================================
-- ROW LEVEL SECURITY (Optional)
-- ============================================
ALTER TABLE funnels ENABLE ROW LEVEL SECURITY;
ALTER TABLE funnel_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE funnel_bonuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE funnel_testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE funnel_guarantees ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_scoring_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier_routing ENABLE ROW LEVEL SECURITY;

-- ============================================
-- SEED DATA: MetroFlex Gym Licensing Funnel
-- ============================================
INSERT INTO funnels (
    name, type, status, offer_name, offer_price, offer_description,
    target_audience, unique_mechanism, awareness_level, expected_conversion_rate
) VALUES (
    'MetroFlex Gym Licensing',
    'HIGH_TICKET',
    'active',
    'MetroFlex Gym License',
    60000.00,
    'Own a piece of bodybuilding history. MetroFlex Gym is where 8-time Mr. Olympia Ronnie Coleman trained.',
    'Fitness entrepreneurs, gym owners looking to rebrand, investors seeking fitness ventures',
    'The Brand Power Advantage - Instant credibility from Ronnie Coleman association plus proven operational systems',
    'problem_aware',
    0.025
) RETURNING id;

-- Note: Run the funnel ID from above to seed related data
