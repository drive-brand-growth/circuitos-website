// Fails when content/site.yaml is not bundled into the traced build output.
// Run after `next build`: node scripts/check-content-traced.mjs
import { existsSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const required = ['site.yaml', 'home.yaml', 'glossary.yaml']
const missing = required.filter((f) => !existsSync(join(root, '.next/standalone/content', f)))
if (missing.length) {
  console.error(`content not traced into .next/standalone/content: ${missing.join(', ')}`)
  process.exit(1)
}
console.log('content files are present in the traced output')
