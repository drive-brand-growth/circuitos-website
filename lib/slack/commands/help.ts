export async function handleHelp() {
  const sections = [
    {
      title: ':bar_chart: Status & Monitoring',
      commands: [
        '"system status" — health check all services',
        '"dashboard overview" — KPI summary',
        '"governance telemetry" — autonomy gate stats',
        '"system health" — integration health',
      ],
    },
    {
      title: ':pencil: Content',
      commands: [
        '"generate a blog post" — trigger AI blog generation',
        '"show recent posts" — list latest blog posts',
        '"social queue" — show pending social posts',
        '"approve post <id>" — approve a social post',
        '"push post <id>" — publish to GHL',
        '"distribute social for blog <id>" — create social from blog',
        '"linkedin batch" — generate LinkedIn posts',
        '"content performance" — content metrics',
      ],
    },
    {
      title: ':dart: Leads & Scoring',
      commands: [
        '"score lead John Doe at Acme Corp" — score a prospect',
        '"rescore contact <id>" — re-score existing contact',
        '"pipeline metrics" — funnel breakdown',
        '"scoring distribution" — score histogram',
        '"engagement metrics" — engagement stats',
        '"enrich John Doe at Acme" — run enrichment',
        '"monthly report" — full monthly summary',
      ],
    },
    {
      title: ':email: Campaigns',
      commands: [
        '"list campaigns" — show Instantly campaigns',
        '"campaign analytics <id>" — campaign metrics',
      ],
    },
  ]

  const blocks = [
    {
      type: 'header',
      text: { type: 'plain_text', text: 'CircuitOS Ops — Commands', emoji: true },
    },
    ...sections.flatMap(s => [
      { type: 'section', text: { type: 'mrkdwn', text: `*${s.title}*\n${s.commands.map(c => `> ${c}`).join('\n')}` } },
      { type: 'divider' },
    ]),
    {
      type: 'context',
      elements: [
        { type: 'mrkdwn', text: 'You can use natural language — I understand the intent. Add "for <vertical>" to target a specific vertical (default: licensing).' },
      ],
    },
  ]

  return {
    text: 'CircuitOS Ops — Available Commands',
    blocks,
  }
}
