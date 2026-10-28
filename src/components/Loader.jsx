export function Spinner({ className = 'size-5' }) {
  return (
    <span
      className={`inline-block animate-spin rounded-full border-2 border-current border-r-transparent ${className}`}
      role="status"
      aria-label="Загрузка"
    />
  )
}

export default function Loader({ label = 'Загрузка…' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-indigo-600">
      <Spinner className="size-8" />
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  )
}
