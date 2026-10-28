export default function StockBadge({ count }) {
  if (count > 0) {
    return (
      <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium whitespace-nowrap text-emerald-700">
        {count} шт.
      </span>
    )
  }

  return (
    <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium whitespace-nowrap text-slate-500">
      Нет в наличии
    </span>
  )
}
