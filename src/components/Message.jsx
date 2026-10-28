import { AlertIcon, BoxIcon } from './icons'

export default function Message({ type = 'empty', title, text, onRetry }) {
  const isError = type === 'error'
  const Icon = isError ? AlertIcon : BoxIcon

  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <div
        className={`mb-4 flex size-12 items-center justify-center rounded-full ${
          isError ? 'bg-red-50 text-red-500' : 'bg-slate-100 text-slate-400'
        }`}
      >
        <Icon className="size-6" />
      </div>
      <p className="font-medium text-slate-900">{title}</p>
      {text && <p className="mt-1 max-w-sm text-sm text-slate-500">{text}</p>}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
        >
          Повторить
        </button>
      )}
    </div>
  )
}
