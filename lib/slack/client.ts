import { WebClient, type KnownBlock } from '@slack/web-api'

let _client: WebClient | null = null

function getClient(): WebClient {
  if (!_client) {
    const token = process.env.SLACK_BOT_TOKEN
    if (!token) throw new Error('SLACK_BOT_TOKEN not configured')
    _client = new WebClient(token)
  }
  return _client
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SlackBlocks = KnownBlock[] | any[]

export async function postMessage(
  channel: string,
  text: string,
  blocks?: SlackBlocks,
) {
  const client = getClient()
  return client.chat.postMessage({ channel, text, blocks: blocks as KnownBlock[] })
}

export async function postThreadReply(
  channel: string,
  threadTs: string,
  text: string,
  blocks?: SlackBlocks,
) {
  const client = getClient()
  return client.chat.postMessage({ channel, text, blocks: blocks as KnownBlock[], thread_ts: threadTs })
}
