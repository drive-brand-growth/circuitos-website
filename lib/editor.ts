/** Hosted /admin needs a GitHub App. Local dev does not. Never set the secrets here. */
export function editorReady(): boolean {
  if (process.env.NODE_ENV === 'development') return true
  const secret = process.env.KEYSTATIC_SECRET ?? ''
  return Boolean(
    process.env.KEYSTATIC_GITHUB_CLIENT_ID &&
      process.env.KEYSTATIC_GITHUB_CLIENT_SECRET &&
      secret.length >= 32,
  )
}
