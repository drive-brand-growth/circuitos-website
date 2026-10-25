import React from 'react'
import Markdoc from '@markdoc/markdoc'

export default function MarkdocBody({ document }: { document: { node: unknown } }) {
  const transformed = Markdoc.transform(document.node as unknown as Parameters<typeof Markdoc.transform>[0])
  return <div className="note-body">{Markdoc.renderers.react(transformed, React)}</div>
}
