'use client'

import { useState } from 'react'

type ChainRecord = {
  seq: number
  summary: string
  prevHash: string
  hash: string
}

const INITIAL_CHAIN: ChainRecord[] = [
  { seq: 1, summary: 'Lead scored',       prevHash: '0000000000000000', hash: 'a3f9c1d2e4b7f608' },
  { seq: 2, summary: 'Gate escalated',    prevHash: 'a3f9c1d2e4b7f608', hash: 'b1e2a9f3d5c8071a' },
  { seq: 3, summary: 'Human approved',    prevHash: 'b1e2a9f3d5c8071a', hash: 'c7d4b6e1f2a30958' },
  { seq: 4, summary: 'Message sent',      prevHash: 'c7d4b6e1f2a30958', hash: 'd2f8a3c1e9b47062' },
  { seq: 5, summary: 'Outcome recorded',  prevHash: 'd2f8a3c1e9b47062', hash: 'e5c9d7b2f3a14807' },
  { seq: 6, summary: 'Lift measured',     prevHash: 'e5c9d7b2f3a14807', hash: 'f1a6e4c8d2b90375' },
]

function tamperRecord3(chain: ChainRecord[]): ChainRecord[] {
  return chain.map((r) => {
    if (r.seq === 3) {
      const last = r.hash[r.hash.length - 1]
      const flipped = last === '8' ? '9' : '8'
      return { ...r, hash: r.hash.slice(0, -1) + flipped }
    }
    return r
  })
}

function verifyChain(chain: ChainRecord[]): { ok: boolean; brokenAt: number | null } {
  for (let i = 1; i < chain.length; i++) {
    if (chain[i].prevHash !== chain[i - 1].hash) {
      return { ok: false, brokenAt: chain[i].seq }
    }
  }
  return { ok: true, brokenAt: null }
}

export default function TamperDemo() {
  const [tampered, setTampered] = useState(false)

  const chain = tampered ? tamperRecord3(INITIAL_CHAIN) : INITIAL_CHAIN
  const { ok, brokenAt } = verifyChain(chain)

  return (
    <div className="card rounded-xl p-6 border border-[#27272a]">
      <p className="text-xs font-medium text-blue-400 mb-1">Live Demo</p>
      <h2 className="text-white text-xl font-bold mb-4 tracking-[-0.01em]">
        Try to edit history
      </h2>

      {/* Hash chain rows */}
      <div className="overflow-x-auto mb-4">
        <div className="min-w-[480px] space-y-1">
          {chain.map((r) => {
            const invalidated = !ok && brokenAt !== null && r.seq >= brokenAt
            const hashFlipped = tampered && r.seq === 3
            return (
              <div
                key={r.seq}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg border text-xs font-mono transition-colors ${
                  invalidated
                    ? 'border-red-500/40 bg-red-500/5'
                    : 'border-[#27272a] bg-[#18181b]'
                }`}
              >
                <span className="text-[#71717a] w-4 shrink-0">{r.seq}</span>
                <span
                  className={`w-32 shrink-0 ${invalidated ? 'text-red-400' : 'text-[#a1a1aa]'}`}
                >
                  {r.summary}
                </span>
                <span className="text-[#52525b] shrink-0">prev:</span>
                <span
                  className={
                    !ok && r.seq === brokenAt ? 'text-red-400' : 'text-[#71717a]'
                  }
                >
                  {r.prevHash.slice(0, 8)}&hellip;
                </span>
                <span className="text-[#52525b] shrink-0">hash:</span>
                <span className={hashFlipped ? 'text-red-400' : 'text-[#71717a]'}>
                  {r.hash.slice(0, 8)}&hellip;
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Verification banner */}
      <div
        className={`rounded-lg px-4 py-3 mb-4 border text-sm font-semibold transition-colors ${
          ok
            ? 'border-green-500/40 bg-green-500/10 text-green-400'
            : 'border-red-500/40 bg-red-500/10 text-red-400'
        }`}
      >
        {ok
          ? 'Chain verified: 6 records, unbroken'
          : `Chain broken at record ${brokenAt}: its prevHash no longer matches. Every record after the edit is invalidated.`}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 mb-4">
        {!tampered ? (
          <button
            onClick={() => setTampered(true)}
            className="px-4 py-2 rounded-lg text-sm font-medium border border-red-500/40 text-red-400 hover:bg-red-500/10 transition-colors"
          >
            Tamper with record 3
          </button>
        ) : (
          <button
            onClick={() => setTampered(false)}
            className="px-4 py-2 rounded-lg text-sm font-medium border border-[#3f3f46] text-[#a1a1aa] hover:border-[#52525b] transition-colors"
          >
            Reset
          </button>
        )}
      </div>

      <p className="text-[#71717a] text-xs leading-relaxed">
        One changed character invalidates all history after it. Nobody can quietly edit the past,
        including us. This is what an audit trail is supposed to mean.
      </p>
    </div>
  )
}
