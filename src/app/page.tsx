'use client'

import { useState } from 'react'
import {
  Shield,
  Cpu,
  Zap,
  Lock,
  ChevronRight,
  ArrowRight,
  Brain,
  Network,
  BarChart3,
  Bot,
  Workflow,
  Database
} from 'lucide-react'

// Dark Knight Batman styled component
const BatSignal = () => (
  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none opacity-10">
    <div className="w-full h-full bg-gradient-radial from-batman-gold/20 via-transparent to-transparent" />
  </div>
)

// Black-boxed proprietary feature card
const ProprietaryFeature = ({
  title,
  description,
  icon: Icon
}: {
  title: string
  description: string
  icon: React.ElementType
}) => (
  <div className="black-box rounded-xl p-6 transition-all duration-300 hover:border-batman-gold/40 group">
    <div className="flex items-start gap-4">
      <div className="p-3 bg-batman-steel/50 rounded-lg border border-batman-gold/20 group-hover:border-batman-gold/40 transition-colors">
        <Icon className="w-6 h-6 text-batman-gold" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <span className="proprietary-badge">
            <Lock className="w-3 h-3 inline mr-1" />
            Proprietary
          </span>
        </div>
        <p className="text-batman-silver text-sm">{description}</p>
        <div className="mt-4 flex items-center text-batman-gold text-sm font-medium group-hover:gap-2 transition-all">
          <span>Enterprise Access</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  </div>
)

// Public feature card
const PublicFeature = ({
  title,
  description,
  icon: Icon
}: {
  title: string
  description: string
  icon: React.ElementType
}) => (
  <div className="bg-batman-charcoal/50 border border-batman-gray/30 rounded-xl p-6 transition-all duration-300 hover:border-batman-gold/30 hover:shadow-batman group">
    <div className="p-3 bg-batman-steel/30 rounded-lg w-fit mb-4 border border-batman-gold/10">
      <Icon className="w-6 h-6 text-batman-gold-light" />
    </div>
    <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
    <p className="text-batman-silver text-sm">{description}</p>
  </div>
)

export default function Home() {
  const [email, setEmail] = useState('')

  return (
    <main className="min-h-screen bg-batman-black">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-batman-black/90 backdrop-blur-md border-b border-batman-steel/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-batman-gold to-batman-gold-dark rounded-lg flex items-center justify-center">
              <Cpu className="w-6 h-6 text-batman-black" />
            </div>
            <span className="text-2xl font-bold text-white">Circuit<span className="text-batman-gold">OS</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-batman-silver hover:text-white transition-colors">Features</a>
            <a href="#platform" className="text-batman-silver hover:text-white transition-colors">Platform</a>
            <a href="#enterprise" className="text-batman-silver hover:text-white transition-colors">Enterprise</a>
          </div>
          <button className="bg-batman-gold hover:bg-batman-gold-light text-batman-black font-semibold px-5 py-2.5 rounded-lg transition-all hover:shadow-batman">
            Request Access
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <BatSignal />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-batman-charcoal/50 border border-batman-gold/20 rounded-full px-4 py-2 mb-8">
              <Shield className="w-4 h-4 text-batman-gold" />
              <span className="text-sm text-batman-silver">Enterprise-Grade AI Orchestration</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="text-white">Intelligent </span>
              <span className="text-gradient-gold">Automation</span>
              <br />
              <span className="text-white">for Enterprise</span>
            </h1>

            <p className="text-xl text-batman-silver mb-10 max-w-2xl mx-auto">
              CircuitOS is an AI-powered orchestration platform that transforms how enterprises
              operate. Black-box technology. Proprietary intelligence. Unmatched results.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="w-full sm:w-auto bg-batman-gold hover:bg-batman-gold-light text-batman-black font-semibold px-8 py-4 rounded-lg transition-all hover:shadow-batman-lg flex items-center justify-center gap-2">
                Schedule Demo
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="w-full sm:w-auto border border-batman-gold/50 hover:border-batman-gold text-batman-gold hover:text-batman-gold-light px-8 py-4 rounded-lg transition-all">
                View Documentation
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-4xl mx-auto">
            {[
              { value: '10x', label: 'Faster Decisions' },
              { value: '99.9%', label: 'Uptime SLA' },
              { value: '50+', label: 'Integrations' },
              { value: 'SOC 2', label: 'Compliant' },
            ].map((stat, i) => (
              <div key={i} className="text-center p-4 bg-batman-charcoal/30 rounded-xl border border-batman-steel/30">
                <div className="text-3xl font-bold text-batman-gold mb-1">{stat.value}</div>
                <div className="text-sm text-batman-silver">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Black-Boxed Proprietary Features */}
      <section id="platform" className="py-20 bg-batman-dark/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-batman-charcoal border border-batman-gold/30 rounded-full px-4 py-2 mb-4">
              <Lock className="w-4 h-4 text-batman-gold" />
              <span className="text-sm text-batman-gold">Protected Technology</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Proprietary <span className="text-batman-gold">Intelligence</span>
            </h2>
            <p className="text-batman-silver max-w-2xl mx-auto">
              Our black-box technology delivers results without exposing the underlying systems.
              Enterprise clients receive full access after verification.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <ProprietaryFeature
              icon={Brain}
              title="Decision Model Notation Engine"
              description="Advanced DMN-based routing and decision automation. 12+ proprietary decision tables powering intelligent task classification and execution."
            />
            <ProprietaryFeature
              icon={Network}
              title="Agent OS Integration Layer"
              description="Multi-agent orchestration system with self-healing capabilities. Coordinates 16+ specialized agents for autonomous operations."
            />
            <ProprietaryFeature
              icon={BarChart3}
              title="ML Pipeline Orchestration"
              description="Predictive modeling with automated drift detection and quality gates. Zero-touch deployment with A/B testing frameworks."
            />
            <ProprietaryFeature
              icon={Workflow}
              title="Virtual LPR Intelligence"
              description="Digital traffic intelligence system for prospect identification. Integrated with enterprise CRM and outreach automation."
            />
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-4 p-6 bg-batman-charcoal border border-batman-gold/20 rounded-xl">
              <Shield className="w-8 h-8 text-batman-gold" />
              <div className="text-left">
                <div className="text-white font-semibold">Enterprise Verification Required</div>
                <div className="text-batman-silver text-sm">Full platform access available for verified enterprise clients</div>
              </div>
              <button className="bg-batman-gold/20 hover:bg-batman-gold/30 text-batman-gold px-4 py-2 rounded-lg transition-colors">
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Public Features */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Platform <span className="text-batman-gold">Capabilities</span>
            </h2>
            <p className="text-batman-silver max-w-2xl mx-auto">
              Built on enterprise-grade infrastructure with security and compliance at its core.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <PublicFeature
              icon={Bot}
              title="AI Agent Orchestration"
              description="Coordinate multiple AI agents to handle complex business workflows autonomously."
            />
            <PublicFeature
              icon={Database}
              title="Enterprise Data Layer"
              description="Secure data management with real-time sync across your entire tech stack."
            />
            <PublicFeature
              icon={Shield}
              title="Security & Compliance"
              description="SOC 2 compliant with enterprise-grade encryption and access controls."
            />
            <PublicFeature
              icon={Zap}
              title="Real-time Processing"
              description="Sub-second response times for critical business decisions and automations."
            />
            <PublicFeature
              icon={Network}
              title="API Integrations"
              description="Connect with 50+ enterprise tools including CRM, marketing, and analytics platforms."
            />
            <PublicFeature
              icon={BarChart3}
              title="Analytics Dashboard"
              description="Comprehensive visibility into automation performance and business metrics."
            />
          </div>
        </div>
      </section>

      {/* Enterprise CTA */}
      <section id="enterprise" className="py-20 bg-batman-dark/50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-gradient-to-br from-batman-charcoal to-batman-dark border border-batman-gold/30 rounded-2xl p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-radial from-batman-gold/5 via-transparent to-transparent" />
            <div className="relative z-10">
              <div className="w-16 h-16 bg-batman-gold/10 border border-batman-gold/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-batman-gold" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready for Enterprise Access?
              </h2>
              <p className="text-batman-silver mb-8 max-w-xl mx-auto">
                Join industry leaders using CircuitOS to transform their operations.
                Get verified for full platform access including proprietary systems.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Work email address"
                  className="w-full px-4 py-3 bg-batman-steel/50 border border-batman-gray/50 rounded-lg text-white placeholder-batman-silver focus:border-batman-gold focus:outline-none"
                />
                <button className="w-full sm:w-auto whitespace-nowrap bg-batman-gold hover:bg-batman-gold-light text-batman-black font-semibold px-6 py-3 rounded-lg transition-all">
                  Get Access
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-batman-steel/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-batman-gold to-batman-gold-dark rounded-lg flex items-center justify-center">
                <Cpu className="w-4 h-4 text-batman-black" />
              </div>
              <span className="text-lg font-bold text-white">Circuit<span className="text-batman-gold">OS</span></span>
            </div>
            <div className="flex items-center gap-6 text-sm text-batman-silver">
              <a href="#" className="hover:text-batman-gold transition-colors">Privacy</a>
              <a href="#" className="hover:text-batman-gold transition-colors">Terms</a>
              <a href="#" className="hover:text-batman-gold transition-colors">Security</a>
              <a href="#" className="hover:text-batman-gold transition-colors">Contact</a>
            </div>
            <div className="text-sm text-batman-silver">
              © 2024 CircuitOS. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
