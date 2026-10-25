import type { Metadata } from 'next'
import EditorSetup from '@/components/EditorSetup'
import { editorReady } from '@/lib/editor'
import OpenEditor from './open-editor'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Editor',
  robots: { index: false, follow: false },
}

export default function AdminPage() {
  if (!editorReady()) return <EditorSetup />
  return <OpenEditor />
}
