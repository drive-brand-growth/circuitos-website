import crypto from 'crypto'

const FIVE_MINUTES = 5 * 60

/**
 * Verify Slack request signature using HMAC-SHA256.
 * https://api.slack.com/authentication/verifying-requests-from-slack
 */
export function verifySlackRequest(
  signingSecret: string,
  timestamp: string,
  body: string,
  signature: string,
): boolean {
  // Missing headers = invalid
  if (!timestamp || !signature) return false

  // Reject requests older than 5 minutes (replay protection)
  const ts = parseInt(timestamp, 10)
  if (isNaN(ts)) return false
  const now = Math.floor(Date.now() / 1000)
  if (Math.abs(now - ts) > FIVE_MINUTES) return false

  const baseString = `v0:${timestamp}:${body}`
  const hmac = crypto.createHmac('sha256', signingSecret).update(baseString).digest('hex')
  const expected = `v0=${hmac}`

  // timingSafeEqual requires same-length buffers
  if (expected.length !== signature.length) return false

  // Constant-time comparison to prevent timing attacks
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
}
