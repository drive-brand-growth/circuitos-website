import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'CircuitOS - Autonomous Revenue Intelligence Platform'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#000000',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '80px',
          position: 'relative',
        }}
      >
        {/* Subtle grid background */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />

        {/* Blue glow */}
        <div
          style={{
            position: 'absolute',
            top: '20%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '600px',
            height: '400px',
            background:
              'radial-gradient(ellipse, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
          }}
        />

        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '32px',
          }}
        >
          <span
            style={{
              fontSize: '36px',
              fontWeight: 600,
              color: '#3b82f6',
              letterSpacing: '-0.02em',
            }}
          >
            //
          </span>
          <span
            style={{
              fontSize: '36px',
              fontWeight: 600,
              color: '#ffffff',
              letterSpacing: '-0.02em',
            }}
          >
            Circuit
          </span>
          <span
            style={{
              fontSize: '36px',
              fontWeight: 600,
              color: '#3b82f6',
              letterSpacing: '-0.02em',
            }}
          >
            OS
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontSize: '56px',
            fontWeight: 700,
            color: '#ffffff',
            textAlign: 'center',
            lineHeight: 1.2,
            margin: 0,
            letterSpacing: '-0.02em',
          }}
        >
          Revenue Intelligence
        </h1>
        <h1
          style={{
            fontSize: '56px',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
            backgroundClip: 'text',
            color: '#3b82f6',
            textAlign: 'center',
            lineHeight: 1.2,
            margin: '8px 0 0 0',
            letterSpacing: '-0.02em',
          }}
        >
          That Learns
        </h1>

        {/* Subhead */}
        <p
          style={{
            fontSize: '22px',
            color: '#a1a1aa',
            textAlign: 'center',
            marginTop: '24px',
            lineHeight: 1.4,
          }}
        >
          Score. Route. Engage. Learn. Repeat.
        </p>

        {/* Metrics bar */}
        <div
          style={{
            display: 'flex',
            gap: '48px',
            marginTop: '48px',
            padding: '24px 48px',
            borderTop: '1px solid #27272a',
          }}
        >
          {[
            { value: '72', label: 'Signals' },
            { value: '6', label: 'Verticals' },
            { value: '3', label: 'AI Models' },
            { value: '24/7', label: 'Autonomous' },
          ].map((m) => (
            <div
              key={m.label}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <span
                style={{ fontSize: '28px', fontWeight: 700, color: '#3b82f6' }}
              >
                {m.value}
              </span>
              <span style={{ fontSize: '14px', color: '#52525b' }}>
                {m.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  )
}
