'use client'

import { FormEvent, useState } from 'react'

export default function NewsletterForm() {
  const [message, setMessage] = useState('')

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const email = String(data.get('email') || '').trim()
    if (!email.includes('@') || !email.includes('.')) {
      setMessage('Enter an email address. Nothing is sent either way.')
      return
    }
    setMessage('This list is not connected. Nothing was sent, and nothing was stored.')
    event.currentTarget.reset()
  }

  return (
    <form onSubmit={onSubmit} className="mt-8" noValidate>
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="notes-email">
          Email address
        </label>
        <input
          id="notes-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          className="w-full rounded-lg bg-transparent border border-[#27272a] px-4 py-3 text-sm text-white outline-none placeholder:text-[#71717a]"
        />
        <button type="submit" className="btn-primary text-white rounded-lg px-6 py-3 text-sm font-semibold">
          Request notes
        </button>
      </div>
      {message ? (
        <p className="mt-3 text-sm text-[#a1a1aa]" role="status">
          {message}
        </p>
      ) : null}
    </form>
  )
}
