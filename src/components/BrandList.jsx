import { useDispatch, useSelector } from 'react-redux'
import { fetchBrands, fetchOffers } from '../store/searchSlice'
import Loader from './Loader'
import Message from './Message'
import StockBadge from './StockBadge'

export default function BrandList() {
  const dispatch = useDispatch()
  const { query, selected, brands } = useSelector((state) => state.search)

  if (brands.status === 'loading') return <Loader label="Ищем производителей…" />

  if (brands.status === 'failed') {
    return (
      <Message
        type="error"
        title="Не удалось выполнить поиск"
        text={brands.error}
        onRetry={() => dispatch(fetchBrands(query))}
      />
    )
  }

  if (brands.items.length === 0) {
    return <Message title="Ничего не найдено" text={`По артикулу «${query}» производители не найдены`} />
  }

  return (
    <ul className="divide-y divide-slate-100">
      {brands.items.map((item) => {
        const isActive = selected?.brand === item.brand && selected?.number === item.number

        return (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => dispatch(fetchOffers({ number: item.number, brand: item.brand }))}
              aria-pressed={isActive}
              className={`flex w-full items-center gap-3 border-l-2 px-5 py-3.5 text-left transition ${
                isActive ? 'border-indigo-600 bg-indigo-50/60' : 'border-transparent hover:bg-slate-50'
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <span className={`font-semibold ${isActive ? 'text-indigo-700' : 'text-slate-900'}`}>
                    {item.brand}
                  </span>
                  <span className="truncate font-mono text-xs text-slate-400">{item.number}</span>
                </div>
                <p className="truncate text-sm text-slate-500">{item.name}</p>
              </div>
              <StockBadge count={item.count} />
            </button>
          </li>
        )
      })}
    </ul>
  )
}
