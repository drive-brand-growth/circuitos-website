type DataTableProps = {
  caption: string
  columns: readonly string[]
  rows: readonly (readonly string[])[]
}

export default function DataTable({ caption, columns, rows }: DataTableProps) {
  return (
    <div>
      <div className="space-y-4 min-[700px]:hidden">
        <p className="sr-only">{caption}</p>
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="panel p-5">
            <dl>
              {columns.map((column, columnIndex) => (
                <div key={column} className={columnIndex > 0 ? 'mt-4' : ''}>
                  <dt className="text-xs font-medium text-muted">{column}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-fg break-words">{row[columnIndex] ?? ''}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>

      <div className="panel overflow-x-auto hidden min-[700px]:block">
        <table className="w-full min-w-[640px] text-left text-sm">
          <caption className="sr-only">{caption}</caption>
          <thead className="text-muted">
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
              <tr key={row.join('|')} className="border-t border-line text-fg">
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
    </div>
  )
}
