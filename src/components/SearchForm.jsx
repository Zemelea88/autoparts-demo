import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBrands, resetSearch } from '../store/searchSlice'
import { CloseIcon, SearchIcon } from './icons'
import { Spinner } from './Loader'

const MIN_LENGTH = 3
const DEBOUNCE_MS = 500
const EXAMPLES = ['01089', '7160500039S', 'OC90']

export default function SearchForm() {
  const dispatch = useDispatch()
  const query = useSelector((state) => state.search.query)
  const isLoading = useSelector((state) => state.search.brands.status === 'loading')
  const [value, setValue] = useState('')

  useEffect(() => {
    const number = value.trim()
    if (number.length < MIN_LENGTH) {
      if (query) dispatch(resetSearch())
      return
    }
    if (number === query) return

    const timer = setTimeout(() => dispatch(fetchBrands(number)), DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [value, query, dispatch])

  const handleSubmit = (event) => {
    event.preventDefault()
    const number = value.trim()
    if (number.length >= MIN_LENGTH) dispatch(fetchBrands(number))
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="article" className="sr-only">
        Артикул детали
      </label>
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-slate-400" />
        <input
          id="article"
          type="text"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Введите артикул, например 01089"
          autoComplete="off"
          autoFocus
          className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pr-12 pl-12 text-base shadow-sm transition outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
        />
        {isLoading ? (
          <span className="absolute top-1/2 right-4 -translate-y-1/2 text-indigo-600">
            <Spinner />
          </span>
        ) : (
          value && (
            <button
              type="button"
              onClick={() => setValue('')}
              aria-label="Очистить"
              className="absolute top-1/2 right-3 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              <CloseIcon className="size-4" />
            </button>
          )
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <span>Например:</span>
        {EXAMPLES.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => setValue(example)}
            className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-700"
          >
            {example}
          </button>
        ))}
      </div>
    </form>
  )
}
