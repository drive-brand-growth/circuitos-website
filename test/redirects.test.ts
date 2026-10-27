import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { NextRequest } from 'next/server'
import { middleware } from '../middleware'
import { PATH_REDIRECTS } from '../lib/redirects'

const NEW = 'https://thecircuitmethod.com'
const OLD_HOSTS = ['usecircuitos.com', 'www.usecircuitos.com']

/** docs/domain-switch.md, written out so these cases do not trust lib/redirects.ts */
const CASES: [string, string][] = [
  ['/', '/'],
  ['/insights', '/field-notes'],
  ['/insights/honesty-gap', '/field-notes/honesty-gap'],
  ['/insights/deterministic-factory', '/field-notes/deterministic-factory'],
  ['/insights/governance-manifesto', '/field-notes/governance-manifesto'],
  ['/insights/lead-walk-through', '/field-notes/lead-walk-through'],
  ['/playground', '/practice'],
  ['/demo', '/work-with-me'],
  ['/receipts-test', '/causal'],
  ['/privacy', '/privacy'],
  ['/terms', '/terms'],
]

function run(url: string, method = 'GET') {
  return middleware(new NextRequest(url, { method }))
}

function assertMoved(url: string, location: string, method?: string) {
  const res = run(url, method)
  assert.equal(res.status, 301, url)
  assert.equal(res.headers.get('location'), location, url)
}

test('lib/redirects.ts holds the path map table in docs/domain-switch.md', () => {
  const doc = readFileSync(join(process.cwd(), 'docs', 'domain-switch.md'), 'utf8')
  const table = Array.from(doc.matchAll(/^\| `([^`]+)` \| `([^`]+)` \|$/gm), (m) => [m[1], m[2]])
  assert.deepEqual(PATH_REDIRECTS.map(({ from, to }) => [from, to]), table)
})

for (const host of OLD_HOSTS) {
  for (const [from, to] of CASES) {
    test(`${host}${from} answers 301 to ${to}`, () => assertMoved(`https://${host}${from}`, `${NEW}${to}`))
  }
}

test('the query string carries over', () => {
  assertMoved(
    'https://usecircuitos.com/insights/honesty-gap?utm_source=newsletter&ref=a%20b',
    `${NEW}/field-notes/honesty-gap?utm_source=newsletter&ref=a%20b`,
  )
  assertMoved('https://www.usecircuitos.com/demo?x=1', `${NEW}/work-with-me?x=1`)
})

test('an unknown path keeps its path', () => {
  assertMoved('https://usecircuitos.com/pricing', `${NEW}/pricing`)
  assertMoved('https://usecircuitos.com/insights/a/b', `${NEW}/insights/a/b`)
  assertMoved('https://www.usecircuitos.com/some/old/page?x=1', `${NEW}/some/old/page?x=1`)
})

test('a trailing slash still maps', () => {
  assertMoved('https://usecircuitos.com/insights/', `${NEW}/field-notes`)
  assertMoved('https://usecircuitos.com/insights/honesty-gap/', `${NEW}/field-notes/honesty-gap`)
})

test('every method on the old host moves, API routes included', () => {
  assertMoved('https://usecircuitos.com/api/slack/events', `${NEW}/api/slack/events`, 'POST')
  assertMoved('https://usecircuitos.com/api/slack/events', `${NEW}/api/slack/events`, 'OPTIONS')
})

test('a path shaped like a host stays on thecircuitmethod.com', () => {
  const res = run('https://usecircuitos.com//evil.example/x')
  assert.equal(res.status, 301)
  assert.equal(new URL(res.headers.get('location') ?? '').hostname, 'thecircuitmethod.com')
})

const NEVER = [
  NEW,
  'https://www.thecircuitmethod.com',
  'https://circuitos-website.vercel.app',
  'http://localhost:3000',
  'https://notusecircuitos.com',
  'https://usecircuitos.com.example.net',
]

for (const origin of NEVER) {
  test(`${origin} is never redirected`, () => {
    for (const path of [...CASES.flat(), '/pricing?x=1', '/api/slack/events']) {
      const res = run(`${origin}${path}`)
      assert.equal(res.status, 200, path)
      assert.equal(res.headers.get('location'), null, path)
      assert.equal(res.headers.get('x-middleware-next'), '1', path)
      assert.equal(res.headers.get('x-frame-options'), 'DENY', path)
    }
  })
}
