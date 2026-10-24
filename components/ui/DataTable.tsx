type DataTableProps = {
  caption: string
  columns: readonly string[]
  rows: readonly (readonly string[])[]
}

export default function DataTable({ caption, columns, rows }: DataTableProps) {
  return (
    <div className="overflow-x-auto rounded-3xl bg-[var(--bg-elevated)] shadow-[var(--shadow)] ring-1 ring-[var(--line)]">
      <table className="w-full min-w-[640px] text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="text-[var(--muted)]">
          <tr>
            {columns.map((column) => (
              <th key={column} className="px-5 py-4 font-medium">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.join('|')} className="border-t border-[var(--line)] text-[var(--fg)]">
              {row.map((cell) => (
                <td key={cell} className="px-5 py-4 align-top">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
