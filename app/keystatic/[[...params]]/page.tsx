import type { Metadata } from 'next'
import EditorSetup from '@/components/EditorSetup'
import { editorReady } from '@/lib/editor'
import KeystaticApp from '../keystatic-app'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Editor',
  robots: { index: false, follow: false },
}

export default function KeystaticPage() {
  if (!editorReady()) return <EditorSetup />
  return <KeystaticApp />
}
