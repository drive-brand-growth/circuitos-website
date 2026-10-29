'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, RefreshCw, ShoppingBag, TrendingUp, AlertCircle, Lightbulb } from 'lucide-react';
import type { DigestBrief, DigestItem } from '@/lib/concierge/types';

interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  model_tier?: string;
  t0_blocked?: boolean;
}

const QUICK_ACTIONS = [
  'How many orders this week?',
  'What needs to ship today?',
  'How are we tracking to $20k?',
  'Draft an Instagram post',
  'What should I focus on today?',
];

function DigestCard({ digest, onAction }: { digest: DigestBrief; onAction: (q: string) => void }) {
  const pct = digest.pct_to_target;
  const barColor = pct >= 75 ? 'bg-green-500' : pct >= 40 ? 'bg-amber-500' : 'bg-red-500';

  const iconFor = (item: DigestItem) => {
    if (item.type === 'order') return <ShoppingBag className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />;
    if (item.type === 'alert') return <AlertCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />;
    if (item.type === 'kpi') return <TrendingUp className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />;
    return <Lightbulb className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-4 mb-3 rounded-xl border border-zinc-800 bg-zinc-900/80 overflow-hidden"
    >
      {/* KPI bar */}
      <div className="p-3 border-b border-zinc-800">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-zinc-400 font-medium">Monthly target</span>
          <span className="text-xs font-semibold text-white">{pct}%</span>
        </div>
        <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(pct, 100)}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={`h-full rounded-full ${barColor}`}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-zinc-600">
            ${digest.revenue_month.toLocaleString('en-US', { maximumFractionDigits: 0 })} earned
          </span>
          <span className="text-[10px] text-zinc-600">
            ${digest.target_month.toLocaleString('en-US', { maximumFractionDigits: 0 })} goal
          </span>
        </div>
      </div>

      {/* Digest items */}
      <div className="p-3 space-y-2">
        {digest.items.slice(0, 4).map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            {iconFor(item)}
            <p className="text-xs text-zinc-300 leading-snug flex-1">{item.message}</p>
            {item.action_label && (
              <button
                onClick={() => onAction(item.action_label!)}
                className="text-[10px] text-red-400 hover:text-red-300 whitespace-nowrap flex-shrink-0 mt-0.5 transition-colors"
              >
                {item.action_label} →
              </button>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function ChatBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? 'bg-red-600 text-white rounded-br-sm'
            : 'bg-zinc-800 text-zinc-100 rounded-bl-sm'
        }`}
      >
        <div className="whitespace-pre-wrap">{message.content}</div>
        {message.t0_blocked && (
          <div className="mt-1.5 text-[10px] opacity-60">Handled by the team</div>
        )}
      </div>
    </motion.div>
  );
}

export default function ConciergeWidget({ operatorId = 'renee_apparel' }: { operatorId?: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [digest, setDigest] = useState<DigestBrief | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [hasError, setHasError] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const fetchDigestAndGreeting = useCallback(async () => {
    setIsInitializing(true);
    setHasError(false);
    try {
      const res = await fetch('/api/hub/concierge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operator_id: operatorId, message: '', history: [], request_digest: true }),
      });
      if (!res.ok) throw new Error(`${res.status}`);
      const data = await res.json();
      if (data.digest) setDigest(data.digest);
      setMessages([{
        id: 'greeting',
        role: 'assistant',
        content: data.response,
        model_tier: data.model_tier,
      }]);
    } catch {
      setHasError(true);
      setMessages([{
        id: 'error-greeting',
        role: 'assistant',
        content: "I'm having a bit of trouble loading right now. Give me a moment and try refreshing — or ask me something and I'll do my best.",
      }]);
    } finally {
      setIsInitializing(false);
    }
  }, [operatorId]);

  useEffect(() => {
    fetchDigestAndGreeting();
  }, [fetchDigestAndGreeting]);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const history = messages
      .filter((m) => m.id !== 'greeting')
      .map((m) => ({ role: m.role, content: m.content }));

    try {
      const res = await fetch('/api/hub/concierge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operator_id: operatorId,
          message: trimmed,
          history,
          request_digest: false,
        }),
      });

      if (!res.ok) throw new Error(`${res.status}`);
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: data.response,
          model_tier: data.model_tier,
          t0_blocked: data.t0_blocked,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: "Something went sideways. Try again in a moment — or reach out to brian@metroflexgym.com if it keeps happening.",
        },
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isLoading, messages, operatorId]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-950 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-xs">MF</span>
          </div>
          <div>
            <div className="text-sm font-semibold text-white">Concierge</div>
            <div className="flex items-center gap-1.5">
              {isInitializing ? (
                <span className="text-xs text-zinc-500">Loading your brief...</span>
              ) : hasError ? (
                <span className="text-xs text-amber-500">Reconnecting</span>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs text-zinc-500">Ready</span>
                </>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={fetchDigestAndGreeting}
          disabled={isInitializing}
          title="Refresh brief"
          className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 disabled:opacity-40 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isInitializing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Messages + digest */}
      <div className="flex-1 overflow-y-auto py-4 space-y-3">
        {isInitializing ? (
          <div className="flex items-center justify-center h-32">
            <div className="flex items-center gap-2 text-zinc-500 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Pulling your brief...</span>
            </div>
          </div>
        ) : (
          <>
            {/* Digest card shown above the greeting */}
            {digest && (
              <DigestCard
                digest={digest}
                onAction={(label) => sendMessage(label)}
              />
            )}

            {/* Chat messages */}
            <div className="px-4 space-y-3">
              {messages.map((m) => (
                <ChatBubble key={m.id} message={m} />
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-zinc-800 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-red-500" />
                    <span className="text-xs text-zinc-400">Thinking...</span>
                  </div>
                </motion.div>
              )}
            </div>
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick actions */}
      <AnimatePresence>
        {!isInitializing && messages.length <= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="px-4 pb-2 flex flex-wrap gap-1.5 flex-shrink-0"
          >
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action}
                onClick={() => sendMessage(action)}
                disabled={isLoading}
                className="text-xs px-3 py-1.5 rounded-full border border-zinc-700 text-zinc-400 hover:border-red-600/50 hover:text-white disabled:opacity-40 transition-all"
              >
                {action}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input */}
      <div className="border-t border-zinc-800 px-4 py-3 bg-zinc-950 flex-shrink-0">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about orders, the store, or what to post..."
            rows={1}
            disabled={isInitializing || isLoading}
            className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-600/60 resize-none disabled:opacity-50 transition-colors leading-snug"
            style={{ maxHeight: '120px' }}
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = 'auto';
              el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
            }}
          />
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isLoading || isInitializing}
            className="p-2.5 bg-red-600 hover:bg-red-700 disabled:bg-zinc-800 disabled:text-zinc-600 rounded-xl text-white transition-colors flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </div>
        <p className="text-[10px] text-zinc-600 mt-1.5 text-center">
          MetroFlex Operator Concierge · EST. 1987
        </p>
      </div>
    </div>
  );
}
