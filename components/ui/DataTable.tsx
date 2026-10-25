type DataTableProps = {
  caption: string
  columns: readonly string[]
  rows: readonly (readonly string[])[]
}

export default function DataTable({ caption, columns, rows }: DataTableProps) {
  return (
    <div className="card rounded-xl overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="text-[#a1a1aa]">
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
            <tr key={row.join('|')} className="border-t border-[#27272a] text-white">
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
