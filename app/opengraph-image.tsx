import { ImageResponse } from 'next/og'

export const alt = 'The Circuit Method. Predictable revenue, engineered.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  const stages = ['Signal', 'Switch', 'Current', 'Breaker', 'Ground']
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
          padding: '72px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: 999,
              border: '10px solid #ffffff',
              borderRightColor: 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            <div
              style={{
                width: 16,
                height: 42,
                background: '#ff2d2d',
                borderRadius: 8,
                marginRight: -8,
              }}
            />
          </div>
          <div style={{ display: 'flex', fontSize: 36, color: '#ffffff', fontWeight: 600 }}>
            The Circuit Method™
          </div>
        </div>
          <div style={{ display: 'flex', marginTop: 48, fontSize: 64, fontWeight: 600, color: '#ffffff', lineHeight: 1.1 }}>
          Predictable revenue, engineered.
        </div>
        <div style={{ display: 'flex', marginTop: 20, fontSize: 28, color: '#c4c4c8' }}>
          Written decisions. Honest odds. Proof of cause.
        </div>
        <div style={{ display: 'flex', gap: 28, marginTop: 56 }}>
          {stages.map((stage) => (
            <div key={stage} style={{ display: 'flex', fontSize: 22, color: stage === 'Switch' ? '#ff2d2d' : '#ffffff' }}>
              {stage}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  )
}
