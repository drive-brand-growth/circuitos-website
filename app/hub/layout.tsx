'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const PASSPHRASE_KEY = 'mfx_hub_auth';
const PASSPHRASE = process.env.NEXT_PUBLIC_HUB_PASSPHRASE ?? 'metroflex1987';

const HUB_TABS = [
  { label: 'Dashboard', href: '/hub' },
  { label: 'Checklist', href: '/hub/checklist' },
  { label: 'Marketing', href: '/hub/marketing' },
  { label: 'Assistant', href: '/hub/assistant' },
];

function PassphraseGate({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);

  const attempt = () => {
    if (value.trim().toLowerCase() === PASSPHRASE.toLowerCase()) {
      sessionStorage.setItem(PASSPHRASE_KEY, '1');
      onUnlock();
    } else {
      setError(true);
      setValue('');
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center mb-6">
          <span className="text-white font-bold text-sm">MF</span>
        </div>
        <h1 className="text-white text-xl font-semibold mb-1">MetroFlex Operator Hub</h1>
        <p className="text-zinc-500 text-sm mb-6">Enter the passphrase to continue.</p>
        <input
          type="password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && attempt()}
          placeholder="Passphrase"
          autoFocus
          className={`w-full bg-zinc-900 border rounded-xl px-4 py-3 text-white text-sm focus:outline-none transition-colors mb-3 ${
            error ? 'border-red-500 placeholder-red-400' : 'border-zinc-700 focus:border-red-600 placeholder-zinc-600'
          }`}
        />
        {error && <p className="text-red-400 text-xs mb-3">That's not right — try again.</p>}
        <button
          onClick={attempt}
          className="w-full bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-xl py-3 transition-colors"
        >
          Enter Hub
        </button>
        <p className="text-zinc-700 text-xs text-center mt-4">
          MetroFlex Operator Hub · EST. 1987 · casual gate only — don't paste truly sensitive credentials here
        </p>
      </div>
    </div>
  );
}

export default function HubLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [unlocked, setUnlocked] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem(PASSPHRASE_KEY);
    if (stored === '1') setUnlocked(true);
    setChecking(false);
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <span className="text-zinc-600 text-sm">Loading...</span>
      </div>
    );
  }

  if (!unlocked) {
    return <PassphraseGate onUnlock={() => setUnlocked(true)} />;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top nav */}
      <nav className="border-b border-zinc-800 bg-zinc-950 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-red-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-[10px]">MF</span>
            </div>
            <span className="text-sm font-semibold text-white">Operator Hub</span>
            <span className="text-zinc-700 text-xs hidden sm:inline">· MetroFlex Apparel</span>
          </div>
          <div className="flex items-center gap-1">
            {HUB_TABS.map((tab) => {
              const active = pathname === tab.href || (tab.href !== '/hub' && pathname.startsWith(tab.href));
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    active
                      ? 'bg-zinc-800 text-white'
                      : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Page content */}
      <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-4 mt-8">
        <p className="text-center text-zinc-700 text-xs">
          MetroFlex Operator Hub · EST. 1987 · Runs on CircuitOS Pro
        </p>
      </footer>
    </div>
  );
}
