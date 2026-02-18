const COS_API = () => process.env.COS_API_BASE_URL || 'https://api.drivebrandgrowth.com'
const CONSOLE_API = () => process.env.CONSOLE_API_URL || 'https://api.drivebrandgrowth.com/console'
const DASH_KEY = () => process.env.COS_DASHBOARD_KEY || ''

async function fetchJson(url: string, opts?: RequestInit) {
  const res = await fetch(url, { signal: AbortSignal.timeout(15000), ...opts })
  if (!res.ok) return null
  try { return await res.json() } catch { return null }
}

export async function handleContent(action: string, params: Record<string, string>) {
  const vertical = params.vertical || 'licensing'

  switch (action) {
    case 'generate_blog':
      return generateBlog()
    case 'blog_status':
      return blogStatus()
    case 'social_queue':
      return socialQueue()
    case 'approve_post':
      return approvePost(params.id)
    case 'push_post':
      return pushPost(params.id)
    case 'distribute':
      return distribute(params.blog_id)
    case 'linkedin_batch':
      return linkedinBatch()
    case 'content_perf':
      return contentPerformance(vertical)
    default:
      return { text: `Unknown content action: ${action}`, blocks: [] }
  }
}

async function generateBlog() {
  const data = await fetchJson(`${CONSOLE_API()}/api/v1/blog/auto-generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  })

  if (!data) {
    return { text: 'Blog generation triggered (check logs for status)', blocks: [] }
  }

  return {
    text: 'Blog generation triggered',
    blocks: [
      { type: 'header', text: { type: 'plain_text', text: 'Blog Generation', emoji: true } },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: data.title
            ? `:white_check_mark: Generated: *${data.title}*\nSlug: \`${data.slug || 'N/A'}\`\nStatus: ${data.status || 'draft'}`
            : ':white_check_mark: Generation triggered. Check blog admin for the new post.',
        },
      },
    ],
  }
}

async function blogStatus() {
  const data = await fetchJson(`${CONSOLE_API()}/api/v1/blog/public/posts?limit=5`)

  if (!data || !Array.isArray(data.posts || data)) {
    return { text: 'Could not fetch blog posts', blocks: [] }
  }

  const posts = data.posts || data
  const lines = posts.slice(0, 5).map((p: { title: string; status: string; slug: string; published_at?: string }) =>
    `- *${p.title}* (${p.status}) — \`${p.slug}\`${p.published_at ? ` — ${new Date(p.published_at).toLocaleDateString()}` : ''}`
  )

  return {
    text: `Recent blog posts (${posts.length})`,
    blocks: [
      { type: 'header', text: { type: 'plain_text', text: 'Recent Blog Posts', emoji: true } },
      { type: 'section', text: { type: 'mrkdwn', text: lines.join('\n') || 'No posts found' } },
    ],
  }
}

async function socialQueue() {
  // The queue summary endpoint requires auth — try the public-style call first
  const data = await fetchJson(`${CONSOLE_API()}/api/v1/social/analytics/queue-summary`)

  if (!data) {
    return { text: 'Could not fetch social queue. Auth may be required.', blocks: [] }
  }

  const lines = Object.entries(data).map(([status, count]) => `- *${status}*: ${count}`)

  return {
    text: 'Social post queue summary',
    blocks: [
      { type: 'header', text: { type: 'plain_text', text: 'Social Queue', emoji: true } },
      { type: 'section', text: { type: 'mrkdwn', text: lines.join('\n') || 'No data' } },
    ],
  }
}

async function approvePost(postId?: string) {
  if (!postId) {
    return { text: 'Missing post ID. Usage: "approve social post <id>"', blocks: [] }
  }

  const data = await fetchJson(`${CONSOLE_API()}/api/v1/social/posts/${postId}/approve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  })

  return {
    text: data ? `Post ${postId} approved` : `Could not approve post ${postId}. Auth may be required.`,
    blocks: [],
  }
}

async function pushPost(postId?: string) {
  if (!postId) {
    return { text: 'Missing post ID. Usage: "push social post <id>"', blocks: [] }
  }

  const data = await fetchJson(`${CONSOLE_API()}/api/v1/social/posts/${postId}/push`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  })

  return {
    text: data ? `Post ${postId} pushed to GHL` : `Could not push post ${postId}. Auth may be required.`,
    blocks: [],
  }
}

async function distribute(blogPostId?: string) {
  if (!blogPostId) {
    return { text: 'Missing blog post ID. Usage: "distribute social for blog <id>"', blocks: [] }
  }

  const data = await fetchJson(`${CONSOLE_API()}/api/v1/social/distribute/${blogPostId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  })

  if (!data) {
    return { text: `Distribution triggered for blog ${blogPostId}. Check social queue.`, blocks: [] }
  }

  return {
    text: `Social posts generated for blog ${blogPostId}`,
    blocks: [
      { type: 'header', text: { type: 'plain_text', text: 'Social Distribution', emoji: true } },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: data.status === 'already_distributed'
            ? `:warning: Already distributed for blog ${blogPostId}`
            : `:white_check_mark: Generated ${data.posts_created || '?'} social posts from blog ${blogPostId}`,
        },
      },
    ],
  }
}

async function linkedinBatch() {
  const data = await fetchJson(`${CONSOLE_API()}/api/v1/social/generate-licensing/cron`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  })

  return {
    text: data ? 'LinkedIn batch generation triggered' : 'LinkedIn batch triggered (check social queue)',
    blocks: [
      { type: 'header', text: { type: 'plain_text', text: 'LinkedIn Batch', emoji: true } },
      {
        type: 'section',
        text: { type: 'mrkdwn', text: ':white_check_mark: LinkedIn licensing post batch triggered. Check the social queue for new pending posts.' },
      },
    ],
  }
}

async function contentPerformance(vertical: string) {
  const data = await fetchJson(
    `${COS_API()}/${vertical}/api/v1/dashboard/content-performance`,
    { headers: { 'X-Dashboard-Key': DASH_KEY() } },
  )

  if (!data) {
    return { text: `Could not fetch content performance for ${vertical}`, blocks: [] }
  }

  return {
    text: `Content performance for ${vertical}`,
    blocks: [
      { type: 'header', text: { type: 'plain_text', text: `Content Performance: ${vertical}`, emoji: true } },
      {
        type: 'section',
        text: { type: 'mrkdwn', text: '```' + JSON.stringify(data, null, 2).slice(0, 2800) + '```' },
      },
    ],
  }
}
