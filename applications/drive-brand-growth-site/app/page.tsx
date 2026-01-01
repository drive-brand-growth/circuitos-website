"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  ArrowUpRight,
  ArrowRight,
  Lock,
  GraduationCap,
  Link as LinkIcon,
  Mail,
  Workflow,
  Search,
  Code,
  Rocket,
  Terminal
} from "lucide-react";

// Simple fade-in component using intersection observer + CSS
function FadeIn({
  children,
  className = "",
  delay = 0
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1, rootMargin: "-50px" }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [isMounted, isVisible]);

  // Always render with visible styles on server, animate on client
  const shouldAnimate = isMounted && isVisible;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: !isMounted ? 1 : (shouldAnimate ? 1 : 0),
        transform: !isMounted ? "translateY(0)" : (shouldAnimate ? "translateY(0)" : "translateY(30px)"),
        transition: isMounted ? `opacity 0.6s ease-out ${delay}s, transform 0.6s ease-out ${delay}s` : "none",
      }}
    >
      {children}
    </div>
  );
}

function TerminalWindow({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="relative group">
      {/* Circuit glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/20 via-blue-400/10 to-blue-600/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/10 via-transparent to-blue-600/10 rounded-xl animate-pulse" style={{ animationDuration: '3s' }} />

      {/* Terminal content */}
      <div className="relative rounded-xl border border-zinc-800 group-hover:border-blue-900/50 bg-zinc-900/90 overflow-hidden transition-colors duration-500">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800 group-hover:border-blue-900/30 bg-zinc-900/80 transition-colors duration-500">
          <div className="w-3 h-3 rounded-full bg-zinc-700 group-hover:bg-blue-900/60 transition-colors duration-500" />
          <div className="w-3 h-3 rounded-full bg-zinc-700 group-hover:bg-blue-800/50 transition-colors duration-500" style={{ transitionDelay: '100ms' }} />
          <div className="w-3 h-3 rounded-full bg-zinc-700 group-hover:bg-blue-700/40 transition-colors duration-500" style={{ transitionDelay: '200ms' }} />
          <span className="ml-3 text-[11px] text-zinc-500 group-hover:text-blue-400/70 font-mono tracking-wider transition-colors duration-500">{title}</span>
        </div>
        <div className="p-6 font-mono text-sm">{children}</div>
      </div>
    </div>
  );
}

function TypedCode({ code, delay = 0 }: { code: string; delay?: number }) {
  const [displayedCode, setDisplayedCode] = useState(code); // Start with full code for SSR
  const [isTyping, setIsTyping] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setIsMounted(true);
    setDisplayedCode(""); // Reset for client-side animation
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isTyping && displayedCode === "") {
            setIsTyping(true);
            let i = 0;
            setTimeout(() => {
              const interval = setInterval(() => {
                if (i < code.length) {
                  setDisplayedCode(code.slice(0, i + 1));
                  i++;
                } else {
                  clearInterval(interval);
                }
              }, 30);
            }, delay * 1000);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [code, delay, isTyping, displayedCode, isMounted]);

  return (
    <span ref={ref} className="text-zinc-300" suppressHydrationWarning>
      {displayedCode}
      {isMounted && isTyping && displayedCode.length < code.length && (
        <span className="inline-block w-2 h-4 bg-zinc-400 ml-0.5 animate-pulse" />
      )}
    </span>
  );
}

function RedactedBar({ width = "60%" }: { width?: string }) {
  return (
    <div className="flex items-center gap-2 my-1">
      <div className="h-3 bg-neutral-800 rounded" style={{ width }} />
      <span className="text-neutral-600 text-[10px] font-mono tracking-wider">[REDACTED]</span>
    </div>
  );
}

function StatCard({ number, label, index }: { number: string; label: string; index: string }) {
  return (
    <div className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-all duration-300 group">
      <div className="text-zinc-600 font-mono text-[10px] tracking-wider mb-2 group-hover:text-zinc-500 transition-colors">/{index}</div>
      <div className="text-4xl md:text-5xl font-semibold text-white mb-2 tracking-tight">{number}</div>
      <div className="text-zinc-500 text-sm">{label}</div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0b] text-neutral-300">
      {/* Clean dark background */}
      <div className="fixed inset-0 bg-black pointer-events-none" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-neutral-800 bg-black/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-white flex items-center justify-center">
              <Terminal className="w-4 h-4 text-black" />
            </div>
            <div className="font-medium text-white tracking-tight">
              Drive Brand Growth
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#systems" className="text-sm text-neutral-400 hover:text-white transition-colors">
              Systems
            </a>
            <a href="#approach" className="text-sm text-neutral-400 hover:text-white transition-colors">
              Approach
            </a>
            <a href="#contact" className="text-sm text-neutral-400 hover:text-white transition-colors">
              Contact
            </a>
          </div>

          <a
            href="mailto:noel@drivebrandgrowth.com"
            className="group flex items-center gap-2 px-4 py-2 bg-white hover:bg-neutral-200 rounded-md text-sm font-medium transition-all text-black"
          >
            <span>Book Walkthrough</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-36 pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/50 mb-8"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-zinc-500 font-mono tracking-wider">SYSTEMS OPERATIONAL</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-semibold mb-8 leading-[1.1] tracking-tight"
          >
            <span className="text-white">Revenue Prediction</span>{" "}
            <span className="text-blue-400">That Ships</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-neutral-500 max-w-2xl mb-14 leading-relaxed"
          >
            AI systems that tell you which deals close. Not which ones you hope will.
            Built by someone who closed the deals, not just analyzed them.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-start gap-4 mb-24"
          >
            <a
              href="mailto:noel@drivebrandgrowth.com?subject=Revenue%20Prediction%20Inquiry"
              className="group flex items-center gap-3 px-6 py-3 bg-white hover:bg-neutral-200 rounded-full font-medium transition-all text-black"
            >
              <Mail className="w-4 h-4" />
              <span>Start a Conversation</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
            <button
              onClick={() => document.getElementById("systems")?.scrollIntoView({ behavior: "smooth" })}
              className="group flex items-center gap-3 px-6 py-3 border border-neutral-800 hover:border-neutral-600 rounded-full font-medium transition-all text-neutral-400 hover:text-white"
            >
              <span>View Deployed Systems</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            <StatCard number="91%" label="Lead Qualification Accuracy" index="01" />
            <StatCard number="10M+" label="Decisions Automated Monthly" index="02" />
            <StatCard number="16" label="Active Production Systems" index="03" />
            <StatCard number="<200ms" label="Average Response Time" index="04" />
          </motion.div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-24 px-6 border-t border-neutral-800/40">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <div className="flex flex-col md:flex-row gap-12 items-start">
              {/* Photo */}
              <div className="flex-shrink-0">
                <div className="w-36 h-44 rounded-lg overflow-hidden border border-neutral-800/50 ring-1 ring-neutral-700/10">
                  <img
                    src="/headshot.jpg"
                    alt="Noel Pena"
                    className="w-full h-full object-cover object-top grayscale hover:grayscale-0 transition-all duration-500"
                  />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1">
                <span className="inline-block px-3 py-1 text-[10px] bg-neutral-900/50 border border-neutral-800/50 rounded-md text-neutral-500 font-mono tracking-wider mb-4">
                  FOUNDER & CHIEF AI ARCHITECT
                </span>

                <div className="flex items-center gap-3 mb-6">
                  <GraduationCap className="w-5 h-5 text-neutral-600" />
                  <div>
                    <div className="font-medium text-white">Chief Data and AI Officer Program</div>
                    <div className="text-sm text-neutral-500">University of Michigan</div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-[10px] text-neutral-600 font-mono tracking-wider mb-3">BACKGROUND</div>
                  <p className="text-sm text-neutral-400 mb-4">15 years enterprise B2B sales. Serial entrepreneur and advisor.</p>
                </div>

                <div className="mb-6">
                  <div className="text-[10px] text-neutral-600 font-mono tracking-wider mb-3">SPECIALIZATIONS</div>
                  <div className="flex flex-wrap gap-2">
                    {["Revenue Prediction", "ML Pipeline Scoring", "DMN Governance", "Sales Automation"].map((spec) => (
                      <span key={spec} className="px-3 py-1.5 text-sm rounded-md bg-neutral-900/50 border border-neutral-800/50 text-neutral-500">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm">
                  <a href="mailto:noel@drivebrandgrowth.com" className="flex items-center gap-2 text-neutral-500 hover:text-white transition-colors">
                    <Mail className="w-4 h-4" />
                    <span>noel@drivebrandgrowth.com</span>
                  </a>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Why AI Fails Section */}
      <section className="py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-semibold mb-6 text-white">
              Why Most "AI" <span className="text-red-500">Fails</span>
            </h2>
            <p className="text-lg text-neutral-500 max-w-2xl mx-auto leading-relaxed">
              Companies bolt GPT onto their CRM and call it "AI transformation."
              That's prompt engineering with extra steps. Not prediction.
            </p>
          </FadeIn>

          <FadeIn delay={0.15}>
            <TerminalWindow title="requirements.spec">
              <div className="space-y-5">
                <div>
                  <div className="flex items-start gap-3">
                    <span className="text-neutral-400/80">├─</span>
                    <div>
                      <span className="text-neutral-300">Leads qualified automatically, 24/7</span>
                      <div className="flex items-start gap-2 mt-1 ml-4">
                        <span className="text-neutral-700">└─</span>
                        <span className="text-neutral-600 line-through">Not manual review bottlenecks</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-start gap-3">
                    <span className="text-neutral-400/80">├─</span>
                    <div>
                      <span className="text-neutral-300">Decisions made in milliseconds</span>
                      <div className="flex items-start gap-2 mt-1 ml-4">
                        <span className="text-neutral-700">└─</span>
                        <span className="text-neutral-600 line-through">Not days of back and forth</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-start gap-3">
                    <span className="text-neutral-400/80">├─</span>
                    <div>
                      <span className="text-neutral-300">Systems that learn and improve</span>
                      <div className="flex items-start gap-2 mt-1 ml-4">
                        <span className="text-neutral-700">└─</span>
                        <span className="text-neutral-600 line-through">Not static rules that break</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-start gap-3">
                    <span className="text-neutral-400/80">└─</span>
                    <div>
                      <span className="text-neutral-300">Infrastructure you own</span>
                      <div className="flex items-start gap-2 mt-1 ml-4">
                        <span className="text-neutral-700">└─</span>
                        <span className="text-neutral-600 line-through">Not vendor lock in</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TerminalWindow>
          </FadeIn>
        </div>
      </section>

      {/* Deployed Systems Section */}
      <section id="systems" className="py-28 px-6 border-t border-neutral-800/40">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-semibold mb-6 text-white">
              Deployed <span className="text-blue-400">Systems</span>
            </h2>
            <p className="text-lg text-neutral-500">
              Production systems generating revenue. Technical details under NDA.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-6">
            {/* System 1 */}
            <FadeIn delay={0.05}>
              <div className="h-full p-6 rounded-lg border border-neutral-800/50 bg-neutral-900/80 hover:border-neutral-600 transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white">Franchise Lead Operations</h3>
                  <span className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-medium text-white/80 border border-neutral-700/20 rounded-md tracking-wider">
                    <Lock className="w-3 h-3" />
                    PROPRIETARY
                  </span>
                </div>

                <span className="inline-block px-3 py-1 text-xs bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-500 mb-4">
                  Fitness & Franchising
                </span>

                <ul className="space-y-2 mb-6 text-neutral-400 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-neutral-400/60 mt-0.5">•</span>
                    <span>Automated lead scoring and qualification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neutral-400/60 mt-0.5">•</span>
                    <span>Territory availability validation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neutral-400/60 mt-0.5">•</span>
                    <span>ROI projections for $40k to $60k deals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neutral-400/60 mt-0.5">•</span>
                    <span>Intelligent nurture sequencing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neutral-400/60 mt-0.5">•</span>
                    <span>Full pipeline automation</span>
                  </li>
                </ul>

                <div className="p-4 rounded-lg bg-neutral-900/50 border border-neutral-800 mb-4 font-mono text-sm">
                  <div className="text-neutral-500 mb-2">Implementation Details:</div>
                  <RedactedBar width="70%" />
                  <RedactedBar width="55%" />
                </div>

                <div className="p-4 rounded-lg bg-emerald-950/30 border border-emerald-900/40">
                  <div className="text-emerald-400/80 text-sm font-medium mb-1">Results</div>
                  <div className="text-white font-semibold">$120k to $600k projected Y1 revenue</div>
                </div>
              </div>
            </FadeIn>

            {/* System 2 */}
            <FadeIn delay={0.1}>
              <div className="h-full p-6 rounded-lg border border-neutral-800/50 bg-neutral-900/80 hover:border-neutral-600 transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white">Inbound Lead Automation</h3>
                  <span className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-medium text-white/80 border border-neutral-700/20 rounded-md tracking-wider">
                    <Lock className="w-3 h-3" />
                    PROPRIETARY
                  </span>
                </div>

                <span className="inline-block px-3 py-1 text-xs bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-500 mb-4">
                  B2B SaaS
                </span>

                <ul className="space-y-2 mb-6 text-neutral-400 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-neutral-400/60 mt-0.5">•</span>
                    <span>Instant scoring on form submission</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neutral-400/60 mt-0.5">•</span>
                    <span>Automated data enrichment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neutral-400/60 mt-0.5">•</span>
                    <span>Intent based prioritization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neutral-400/60 mt-0.5">•</span>
                    <span>Intelligent routing to sales or nurture</span>
                  </li>
                </ul>

                <div className="p-4 rounded-lg bg-neutral-900/50 border border-neutral-800 mb-4 font-mono text-sm">
                  <div className="text-neutral-500 mb-2">Implementation Details:</div>
                  <RedactedBar width="65%" />
                  <RedactedBar width="50%" />
                </div>

                <div className="p-4 rounded-lg bg-emerald-950/30 border border-emerald-900/40">
                  <div className="text-emerald-400/80 text-sm font-medium mb-1">Results</div>
                  <div className="text-white font-semibold">10x faster response, 40% conversion increase</div>
                </div>
              </div>
            </FadeIn>

            {/* System 3 */}
            <FadeIn delay={0.15}>
              <div className="h-full p-6 rounded-lg border border-neutral-800/50 bg-neutral-900/80 hover:border-neutral-600 transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white">Conversational AI Platform</h3>
                  <span className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-medium text-white/80 border border-neutral-700/20 rounded-md tracking-wider">
                    <Lock className="w-3 h-3" />
                    PROPRIETARY
                  </span>
                </div>

                <span className="inline-block px-3 py-1 text-xs bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-500 mb-4">
                  Multi Industry
                </span>

                <ul className="space-y-2 mb-6 text-neutral-400 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-neutral-400/60 mt-0.5">•</span>
                    <span>Context aware chat agents</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neutral-400/60 mt-0.5">•</span>
                    <span>Qualification during conversation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neutral-400/60 mt-0.5">•</span>
                    <span>Direct handoff to sales team</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neutral-400/60 mt-0.5">•</span>
                    <span>24/7 availability with human escalation</span>
                  </li>
                </ul>

                <div className="p-4 rounded-lg bg-neutral-900/50 border border-neutral-800 mb-4 font-mono text-sm">
                  <div className="text-neutral-500 mb-2">Implementation Details:</div>
                  <RedactedBar width="60%" />
                  <RedactedBar width="45%" />
                </div>

                <div className="p-4 rounded-lg bg-emerald-950/30 border border-emerald-900/40">
                  <div className="text-emerald-400/80 text-sm font-medium mb-1">Results</div>
                  <div className="text-white font-semibold">2.3x conversion rate vs generic chatbots</div>
                </div>
              </div>
            </FadeIn>

            {/* System 4 */}
            <FadeIn delay={0.2}>
              <div className="h-full p-6 rounded-lg border border-neutral-800/50 bg-neutral-900/80 hover:border-neutral-600 transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white">Speed to Lead Engine</h3>
                  <span className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-medium text-white/80 border border-neutral-700/20 rounded-md tracking-wider">
                    <Lock className="w-3 h-3" />
                    PROPRIETARY
                  </span>
                </div>

                <span className="inline-block px-3 py-1 text-xs bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-500 mb-4">
                  Home Services
                </span>

                <ul className="space-y-2 mb-6 text-neutral-400 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-neutral-400/60 mt-0.5">•</span>
                    <span>Sub 60 second response times</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neutral-400/60 mt-0.5">•</span>
                    <span>Multi channel outreach automation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neutral-400/60 mt-0.5">•</span>
                    <span>Intelligent follow up sequencing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neutral-400/60 mt-0.5">•</span>
                    <span>Calendar integration and booking</span>
                  </li>
                </ul>

                <div className="p-4 rounded-lg bg-neutral-900/50 border border-neutral-800 mb-4 font-mono text-sm">
                  <div className="text-neutral-500 mb-2">Implementation Details:</div>
                  <RedactedBar width="55%" />
                  <RedactedBar width="70%" />
                </div>

                <div className="p-4 rounded-lg bg-emerald-950/30 border border-emerald-900/40">
                  <div className="text-emerald-400/80 text-sm font-medium mb-1">Results</div>
                  <div className="text-white font-semibold">4.2x contact rate improvement</div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Approach Section */}
      <section id="approach" className="py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-semibold mb-6 text-white">
              The <span className="text-blue-400">Build</span>
            </h2>
            <p className="text-lg text-neutral-500">
              6 to 12 weeks from kickoff to production. No slides. Systems that ship.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Search, num: "01", title: "Discovery", desc: "Map your revenue process and data sources" },
              { icon: Code, num: "02", title: "Architecture", desc: "Design prediction engine for your patterns" },
              { icon: Workflow, num: "03", title: "Build", desc: "Deploy ML scoring and automation" },
              { icon: Rocket, num: "04", title: "Launch", desc: "Go live with monitoring and feedback loops" }
            ].map((phase, i) => (
              <FadeIn key={phase.title} delay={0.1 * i}>
                <div className="text-center p-6 group">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-lg bg-zinc-900/60 border border-zinc-800/50 flex items-center justify-center group-hover:border-blue-500/40 transition-all duration-300">
                    <phase.icon className="w-6 h-6 text-zinc-400 group-hover:text-blue-400 transition-colors" />
                  </div>
                  <div className="text-xs text-neutral-400/70 font-mono mb-2 tracking-wider">{phase.num}</div>
                  <h3 className="text-lg font-medium text-white mb-2">{phase.title}</h3>
                  <p className="text-sm text-neutral-500">{phase.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-28 px-6 border-t border-neutral-800/40">
        <div className="max-w-3xl mx-auto text-center">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-semibold mb-6 text-white">
              Replace Hope With <span className="text-blue-400">Prediction</span>
            </h2>
            <p className="text-lg text-neutral-500 mb-12 max-w-xl mx-auto leading-relaxed">
              45 minute technical walkthrough. No slides, no pitch.
              Architecture discussion about your revenue operations.
            </p>

            <a
              href="mailto:noel@drivebrandgrowth.com?subject=Revenue%20Prediction%20Inquiry"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-white hover:bg-neutral-200 rounded-full font-medium transition-all text-black"
            >
              <Mail className="w-5 h-5" />
              <span>Start a Conversation</span>
              <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            <p className="mt-8 text-neutral-500">
              or email directly:{" "}
              <a href="mailto:noel@drivebrandgrowth.com" className="text-white hover:text-neutral-300 underline transition-colors">
                noel@drivebrandgrowth.com
              </a>
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-neutral-800/40">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-neutral-900/60 border border-neutral-800/50 flex items-center justify-center">
              <Terminal className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm text-neutral-600" suppressHydrationWarning>
              © 2025 Drive Brand Growth
            </span>
          </div>
          <div className="flex items-center gap-8 text-sm text-neutral-600">
            <a href="#systems" className="hover:text-white transition-colors">Systems</a>
            <a href="#approach" className="hover:text-white transition-colors">Approach</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
