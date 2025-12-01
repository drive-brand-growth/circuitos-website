'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Cpu,
  Upload,
  MessageSquare,
  BarChart3,
  Brain,
  Zap,
  RefreshCw,
  Send,
  Trash2,
  ChevronRight,
  Activity,
  Database,
  Network,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Users,
} from 'lucide-react'

interface Lead {
  id: string;
  data: {
    company?: string;
    title?: string;
    email?: string;
    industry?: string;
    companySize?: string;
    budget?: string;
    timeline?: string;
    source?: string;
  };
  score: {
    totalScore: number;
    tier: 'A' | 'B' | 'C' | 'D' | 'F';
    breakdown: {
      fitScore: number;
      intentScore: number;
      timingScore: number;
    };
    recommendation: string;
  };
  createdAt: string;
  status: string;
}

interface AgentResponse {
  response: string;
  dmn: {
    classification: string;
    securityLevel: string;
    recommendedModel: string;
    routingPath: string[];
    confidence: number;
    reasoning: string;
  };
  leadScore?: {
    totalScore: number;
    tier: string;
    breakdown: {
      fitScore: number;
      intentScore: number;
      timingScore: number;
    };
    recommendation: string;
  };
  processingTime: number;
  model: string;
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'leads' | 'agent' | 'dmn'>('leads')
  const [leads, setLeads] = useState<Lead[]>([])
  const [summary, setSummary] = useState({ total: 0, byTier: { A: 0, B: 0, C: 0, D: 0, F: 0 }, averageScore: 0 })
  const [loading, setLoading] = useState(false)
  const [agentMessage, setAgentMessage] = useState('')
  const [agentResponse, setAgentResponse] = useState<AgentResponse | null>(null)
  const [agentLoading, setAgentLoading] = useState(false)

  // Lead form state
  const [leadForm, setLeadForm] = useState({
    company: '',
    title: '',
    email: '',
    industry: '',
    companySize: '',
    budget: '',
    timeline: '',
    source: '',
  })

  // Fetch leads on mount
  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/leads')
      const data = await res.json()
      setLeads(data.leads || [])
      setSummary(data.summary || { total: 0, byTier: { A: 0, B: 0, C: 0, D: 0, F: 0 }, averageScore: 0 })
    } catch (error) {
      console.error('Failed to fetch leads:', error)
    }
    setLoading(false)
  }

  const submitLead = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadForm),
      })
      const data = await res.json()
      if (data.success) {
        setLeadForm({ company: '', title: '', email: '', industry: '', companySize: '', budget: '', timeline: '', source: '' })
        fetchLeads()
      }
    } catch (error) {
      console.error('Failed to submit lead:', error)
    }
    setLoading(false)
  }

  const clearLeads = async () => {
    if (!confirm('Clear all leads?')) return
    await fetch('/api/leads', { method: 'DELETE' })
    fetchLeads()
  }

  const sendAgentMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agentMessage.trim()) return
    setAgentLoading(true)
    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: agentMessage, mode: 'chat' }),
      })
      const data = await res.json()
      setAgentResponse(data)
    } catch (error) {
      console.error('Agent error:', error)
    }
    setAgentLoading(false)
  }

  const qualifyLeadWithAgent = async (lead: Lead) => {
    setActiveTab('agent')
    setAgentLoading(true)
    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Analyze this lead', leadData: lead.data, mode: 'qualify' }),
      })
      const data = await res.json()
      setAgentResponse(data)
    } catch (error) {
      console.error('Agent error:', error)
    }
    setAgentLoading(false)
  }

  const getTierBadge = (tier: string) => {
    const classes: Record<string, string> = {
      A: 'tier-a',
      B: 'tier-b',
      C: 'tier-c',
      D: 'tier-d',
      F: 'tier-f',
    }
    return `px-2 py-1 rounded text-xs font-bold ${classes[tier] || 'tier-f'}`
  }

  return (
    <div className="min-h-screen bg-gotham-black">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gotham-void/95 backdrop-blur-md border-b border-gotham-steel">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-gotham-blue-night to-gotham-blue-steel rounded-lg flex items-center justify-center glow-blue">
              <Cpu className="w-5 h-5 text-gotham-blue-glow" />
            </div>
            <span className="text-xl font-bold text-white">Circuit<span className="text-gotham-blue-light">OS</span></span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-3 py-1 bg-gotham-charcoal rounded-full border border-gotham-steel">
              <Activity className="w-3 h-3 text-green-500" />
              <span className="text-xs text-gotham-ash">System Active</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-16 flex">
        {/* Sidebar */}
        <aside className="fixed left-0 top-16 bottom-0 w-64 bg-gotham-dark border-r border-gotham-steel p-4">
          <div className="space-y-2">
            <button
              onClick={() => setActiveTab('leads')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === 'leads'
                  ? 'bg-gotham-blue-deep border border-gotham-blue-steel text-gotham-blue-light'
                  : 'text-gotham-ash hover:bg-gotham-charcoal hover:text-white'
              }`}
            >
              <Users className="w-5 h-5" />
              <span>Lead Scoring</span>
            </button>
            <button
              onClick={() => setActiveTab('agent')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === 'agent'
                  ? 'bg-gotham-blue-deep border border-gotham-blue-steel text-gotham-blue-light'
                  : 'text-gotham-ash hover:bg-gotham-charcoal hover:text-white'
              }`}
            >
              <Brain className="w-5 h-5" />
              <span>AI Agent</span>
            </button>
            <button
              onClick={() => setActiveTab('dmn')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === 'dmn'
                  ? 'bg-gotham-blue-deep border border-gotham-blue-steel text-gotham-blue-light'
                  : 'text-gotham-ash hover:bg-gotham-charcoal hover:text-white'
              }`}
            >
              <Network className="w-5 h-5" />
              <span>DMN Engine</span>
            </button>
          </div>

          {/* Stats */}
          <div className="mt-8 p-4 bg-gotham-charcoal rounded-lg border border-gotham-steel">
            <h3 className="text-xs text-gotham-silver uppercase tracking-wider mb-3">Pipeline Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gotham-ash text-sm">Total Leads</span>
                <span className="text-white font-semibold">{summary.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gotham-ash text-sm">Avg Score</span>
                <span className="text-gotham-blue-light font-semibold">{summary.averageScore}</span>
              </div>
              <div className="grid grid-cols-5 gap-1 mt-2">
                {(['A', 'B', 'C', 'D', 'F'] as const).map(tier => (
                  <div key={tier} className="text-center">
                    <div className={`text-xs font-bold ${getTierBadge(tier)} rounded px-1`}>{tier}</div>
                    <div className="text-xs text-gotham-ash mt-1">{summary.byTier[tier]}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="ml-64 flex-1 p-6">
          {/* Lead Scoring Tab */}
          {activeTab === 'leads' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">Lead Scoring Pipeline</h1>
                <div className="flex gap-2">
                  <button onClick={fetchLeads} className="btn-secondary flex items-center gap-2">
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                  <button onClick={clearLeads} className="btn-secondary flex items-center gap-2 text-gotham-alert border-gotham-alert/30 hover:border-gotham-alert">
                    <Trash2 className="w-4 h-4" />
                    Clear
                  </button>
                </div>
              </div>

              {/* Add Lead Form */}
              <div className="bg-gotham-dark border border-gotham-steel rounded-lg p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Upload className="w-5 h-5 text-gotham-blue-light" />
                  Add New Lead
                </h2>
                <form onSubmit={submitLead} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <input
                    type="text"
                    placeholder="Company Name"
                    value={leadForm.company}
                    onChange={e => setLeadForm({ ...leadForm, company: e.target.value })}
                    className="w-full"
                  />
                  <input
                    type="text"
                    placeholder="Job Title"
                    value={leadForm.title}
                    onChange={e => setLeadForm({ ...leadForm, title: e.target.value })}
                    className="w-full"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={leadForm.email}
                    onChange={e => setLeadForm({ ...leadForm, email: e.target.value })}
                    className="w-full"
                  />
                  <input
                    type="text"
                    placeholder="Industry"
                    value={leadForm.industry}
                    onChange={e => setLeadForm({ ...leadForm, industry: e.target.value })}
                    className="w-full"
                  />
                  <select
                    value={leadForm.companySize}
                    onChange={e => setLeadForm({ ...leadForm, companySize: e.target.value })}
                    className="w-full"
                  >
                    <option value="">Company Size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="500+">500+ employees</option>
                    <option value="Enterprise 1000+">Enterprise 1000+</option>
                  </select>
                  <select
                    value={leadForm.budget}
                    onChange={e => setLeadForm({ ...leadForm, budget: e.target.value })}
                    className="w-full"
                  >
                    <option value="">Budget Range</option>
                    <option value="Under 10k">Under $10k</option>
                    <option value="10k-50k">$10k - $50k</option>
                    <option value="50k-100k">$50k - $100k</option>
                    <option value="100k+">$100k+</option>
                    <option value="Enterprise unlimited">Enterprise (unlimited)</option>
                  </select>
                  <select
                    value={leadForm.timeline}
                    onChange={e => setLeadForm({ ...leadForm, timeline: e.target.value })}
                    className="w-full"
                  >
                    <option value="">Timeline</option>
                    <option value="Immediate ASAP">Immediate / ASAP</option>
                    <option value="This month">This month</option>
                    <option value="This quarter">This quarter</option>
                    <option value="Evaluating options">Evaluating options</option>
                    <option value="Next year">Next year</option>
                  </select>
                  <select
                    value={leadForm.source}
                    onChange={e => setLeadForm({ ...leadForm, source: e.target.value })}
                    className="w-full"
                  >
                    <option value="">Lead Source</option>
                    <option value="Demo request">Demo Request</option>
                    <option value="Pricing page">Pricing Page</option>
                    <option value="Trial signup">Trial Signup</option>
                    <option value="Referral">Referral</option>
                    <option value="Content download">Content Download</option>
                    <option value="Webinar">Webinar</option>
                    <option value="Cold outreach">Cold Outreach</option>
                  </select>
                  <button type="submit" className="btn-primary col-span-2 md:col-span-4 flex items-center justify-center gap-2" disabled={loading}>
                    {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                    Score Lead with ML
                  </button>
                </form>
              </div>

              {/* Leads Table */}
              <div className="bg-gotham-dark border border-gotham-steel rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Company</th>
                        <th>Title</th>
                        <th>Score</th>
                        <th>Tier</th>
                        <th>Fit</th>
                        <th>Intent</th>
                        <th>Timing</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leads.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="text-center py-8 text-gotham-silver">
                            No leads yet. Add a lead above to get started.
                          </td>
                        </tr>
                      ) : (
                        leads.map(lead => (
                          <tr key={lead.id}>
                            <td className="font-medium text-white">{lead.data.company || '-'}</td>
                            <td>{lead.data.title || '-'}</td>
                            <td>
                              <span className="text-gotham-blue-light font-bold">{lead.score.totalScore}</span>
                              <span className="text-gotham-silver">/100</span>
                            </td>
                            <td>
                              <span className={getTierBadge(lead.score.tier)}>{lead.score.tier}</span>
                            </td>
                            <td>{lead.score.breakdown.fitScore}/40</td>
                            <td>{lead.score.breakdown.intentScore}/35</td>
                            <td>{lead.score.breakdown.timingScore}/25</td>
                            <td>
                              <button
                                onClick={() => qualifyLeadWithAgent(lead)}
                                className="text-gotham-blue-light hover:text-gotham-blue-glow flex items-center gap-1 text-sm"
                              >
                                <Brain className="w-4 h-4" />
                                Analyze
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Agent Tab */}
          {activeTab === 'agent' && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <Brain className="w-6 h-6 text-gotham-blue-light" />
                CircuitOS AI Agent
              </h1>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Chat Input */}
                <div className="bg-gotham-dark border border-gotham-steel rounded-lg p-6">
                  <h2 className="text-lg font-semibold text-white mb-4">Agent Console</h2>
                  <form onSubmit={sendAgentMessage} className="space-y-4">
                    <textarea
                      value={agentMessage}
                      onChange={e => setAgentMessage(e.target.value)}
                      placeholder="Ask the agent to analyze leads, provide recommendations, or answer questions..."
                      className="w-full h-32 resize-none"
                    />
                    <button type="submit" className="btn-primary flex items-center gap-2" disabled={agentLoading}>
                      {agentLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      Send to Agent
                    </button>
                  </form>

                  {/* Quick Actions */}
                  <div className="mt-6 pt-6 border-t border-gotham-steel">
                    <h3 className="text-sm text-gotham-silver mb-3">Quick Actions</h3>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'Analyze top leads',
                        'Suggest outreach strategy',
                        'Identify high-intent prospects',
                        'Generate email copy',
                      ].map(action => (
                        <button
                          key={action}
                          onClick={() => setAgentMessage(action)}
                          className="px-3 py-1.5 bg-gotham-charcoal border border-gotham-steel rounded text-sm text-gotham-ash hover:text-white hover:border-gotham-blue-steel transition-all"
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Agent Response */}
                <div className="bg-gotham-dark border border-gotham-steel rounded-lg overflow-hidden">
                  <div className="terminal-header">
                    <div className="terminal-dot red"></div>
                    <div className="terminal-dot yellow"></div>
                    <div className="terminal-dot green"></div>
                    <span className="text-gotham-silver text-sm ml-2">Agent Response</span>
                  </div>
                  <div className="p-6 min-h-[300px]">
                    {agentLoading ? (
                      <div className="flex items-center gap-3 text-gotham-blue-light">
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span className="loading-pulse">Processing with {agentResponse?.dmn?.recommendedModel || 'Claude'}...</span>
                      </div>
                    ) : agentResponse ? (
                      <div className="space-y-4">
                        {/* DMN Info */}
                        <div className="flex flex-wrap gap-2 text-xs">
                          <span className="px-2 py-1 bg-gotham-charcoal rounded text-gotham-silver">
                            Classification: <span className="text-gotham-blue-light">{agentResponse.dmn.classification}</span>
                          </span>
                          <span className="px-2 py-1 bg-gotham-charcoal rounded text-gotham-silver">
                            Model: <span className="text-gotham-blue-light">{agentResponse.model}</span>
                          </span>
                          <span className="px-2 py-1 bg-gotham-charcoal rounded text-gotham-silver">
                            Time: <span className="text-gotham-blue-light">{agentResponse.processingTime}ms</span>
                          </span>
                        </div>

                        {/* Lead Score if present */}
                        {agentResponse.leadScore && (
                          <div className="p-4 bg-gotham-charcoal rounded-lg border border-gotham-steel">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-gotham-silver">ML Score</span>
                              <span className={getTierBadge(agentResponse.leadScore.tier)}>
                                {agentResponse.leadScore.totalScore}/100 (Tier {agentResponse.leadScore.tier})
                              </span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-sm">
                              <div>
                                <span className="text-gotham-silver">Fit:</span>
                                <span className="text-white ml-1">{agentResponse.leadScore.breakdown.fitScore}/40</span>
                              </div>
                              <div>
                                <span className="text-gotham-silver">Intent:</span>
                                <span className="text-white ml-1">{agentResponse.leadScore.breakdown.intentScore}/35</span>
                              </div>
                              <div>
                                <span className="text-gotham-silver">Timing:</span>
                                <span className="text-white ml-1">{agentResponse.leadScore.breakdown.timingScore}/25</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Response */}
                        <div className="text-gotham-ash whitespace-pre-wrap leading-relaxed">
                          {agentResponse.response}
                        </div>
                      </div>
                    ) : (
                      <div className="text-gotham-silver">
                        Send a message to interact with the AI agent. The agent uses DMN routing to select the optimal model and processing path.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DMN Tab */}
          {activeTab === 'dmn' && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <Network className="w-6 h-6 text-gotham-blue-light" />
                DMN Decision Engine
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { id: 1, name: 'Task Classification', policy: 'Priority (P)', rules: 10, status: 'active' },
                  { id: 2, name: 'Security Level', policy: 'First (F)', rules: 8, status: 'active' },
                  { id: 4, name: 'Model Selection', policy: 'First (F)', rules: 10, status: 'active' },
                  { id: 5, name: 'Awareness Routing', policy: 'First (F)', rules: 12, status: 'active' },
                  { id: 6, name: 'ML Operation Routing', policy: 'Priority (P)', rules: 16, status: 'active' },
                  { id: 14, name: 'Virtual LPR Digital', policy: 'Priority (P)', rules: 14, status: 'active' },
                ].map(table => (
                  <div key={table.id} className="bg-gotham-dark border border-gotham-steel rounded-lg p-4 hover:border-gotham-blue-steel transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-gotham-silver">Table {table.id}</span>
                      <span className="flex items-center gap-1 text-xs text-green-500">
                        <Activity className="w-3 h-3" />
                        {table.status}
                      </span>
                    </div>
                    <h3 className="text-white font-medium mb-2">{table.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gotham-ash">
                      <span>Policy: {table.policy}</span>
                      <span>{table.rules} rules</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* DMN Test Console */}
              <div className="bg-gotham-dark border border-gotham-steel rounded-lg p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Test DMN Evaluation</h2>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault()
                    const formData = new FormData(e.currentTarget)
                    const context = formData.get('context') as string
                    if (!context) return

                    const res = await fetch('/api/dmn', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ context }),
                    })
                    const data = await res.json()
                    alert(JSON.stringify(data.evaluation, null, 2))
                  }}
                  className="flex gap-4"
                >
                  <input
                    type="text"
                    name="context"
                    placeholder="Enter context to evaluate (e.g., 'qualify this lead', 'send email campaign')"
                    className="flex-1"
                  />
                  <button type="submit" className="btn-primary">
                    Evaluate
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
