import { ImageResponse } from 'next/og'

export const alt = 'The Circuit Method. The agent drafts. The rules decide.'
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
        <div style={{ display: 'flex', fontSize: 28, color: '#3b82f6', fontWeight: 600 }}>// Circuit Method</div>
        <div style={{ display: 'flex', marginTop: 36, fontSize: 64, fontWeight: 700, color: '#ffffff', lineHeight: 1.15 }}>
          The agent drafts. The rules decide.
        </div>
        <div style={{ display: 'flex', marginTop: 24, fontSize: 28, color: '#a1a1aa' }}>
          Written decisions. Honest odds. Proof of cause.
        </div>
        <div style={{ display: 'flex', gap: 28, marginTop: 56 }}>
          {stages.map((stage) => (
            <div key={stage} style={{ display: 'flex', fontSize: 22, color: '#60a5fa' }}>
              {stage}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  )
}
