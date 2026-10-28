import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchOffers } from '../store/searchSlice'
import { formatDate, formatPrice, formatTime } from '../utils/format'
import { ChevronIcon } from './icons'
import Loader from './Loader'
import Message from './Message'
import StockBadge from './StockBadge'

function OfferRow({ item }) {
  const [isOpen, setIsOpen] = useState(false)
  const hasOffers = item.warehouses.length > 0

  return (
    <li>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={!hasOffers}
        aria-expanded={isOpen}
        className="flex w-full items-center gap-3 px-5 py-4 text-left transition enabled:hover:bg-slate-50"
      >
        <ChevronIcon
          className={`size-4 shrink-0 text-slate-400 transition-transform ${isOpen ? 'rotate-90' : ''} ${
            hasOffers ? '' : 'invisible'
          }`}
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="font-semibold text-slate-900">{item.brand}</span>
            <span className="font-mono text-xs text-slate-400">{item.number}</span>
            {item.isOriginal && (
              <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-[11px] font-medium text-indigo-700">
                Искомая деталь
              </span>
            )}
          </div>
          <p className="mt-0.5 text-sm text-slate-500">{item.name}</p>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-6">
          <StockBadge count={item.count} />
          <span className="w-28 text-right font-semibold tabular-nums">
            {item.minPrice === null ? (
              <span className="text-slate-300">—</span>
            ) : (
              <>
                {item.warehouses.length > 1 && <span className="mr-1 text-xs font-normal text-slate-400">от</span>}
                {formatPrice(item.minPrice)}
              </>
            )}
          </span>
        </div>
      </button>

      {isOpen && (
        <div className="bg-slate-50/70 px-5 pb-3 sm:pl-12">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-400">
                <th className="py-2 font-medium">Склад</th>
                <th className="py-2 font-medium">Отгрузка</th>
                <th className="py-2 text-right font-medium">Остаток</th>
                <th className="py-2 text-right font-medium">Цена</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70">
              {item.warehouses.map((warehouse, index) => (
                <tr key={`${warehouse.id}-${index}`}>
                  <td className="py-2 text-slate-700">{warehouse.code}</td>
                  <td className="py-2 text-slate-500">
                    {formatDate(warehouse.shipmentDate)}
                    <span className="hidden text-slate-400 sm:inline">
                      {' '}
                      · заказ до {formatTime(warehouse.shipmentDate)}
                    </span>
                  </td>
                  <td className="py-2 text-right text-slate-700 tabular-nums">{warehouse.stock} шт.</td>
                  <td className="py-2 text-right font-medium tabular-nums">{formatPrice(warehouse.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </li>
  )
}

export default function OffersTable() {
  const dispatch = useDispatch()
  const { selected, offers } = useSelector((state) => state.search)
  const [inStockOnly, setInStockOnly] = useState(false)

  if (!selected) {
    return <Message title="Выберите производителя" text="Покажем саму деталь, её аналоги, цены и остатки на складах" />
  }

  if (offers.status === 'loading') return <Loader label="Загружаем предложения…" />

  if (offers.status === 'failed') {
    return (
      <Message
        type="error"
        title="Не удалось загрузить предложения"
        text={offers.error}
        onRetry={() => dispatch(fetchOffers(selected))}
      />
    )
  }

  if (offers.items.length === 0) {
    return <Message title="Предложений нет" text={`Для ${selected.brand} ${selected.number} ничего не найдено`} />
  }

  const items = inStockOnly ? offers.items.filter((item) => item.count > 0) : offers.items

  return (
    <>
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-3">
        <p className="text-sm text-slate-500">
          Найдено позиций: <span className="font-medium text-slate-900">{items.length}</span>
        </p>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600 select-none">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(event) => setInStockOnly(event.target.checked)}
            className="size-4 rounded accent-indigo-600"
          />
          Только в наличии
        </label>
      </div>

      {items.length === 0 ? (
        <Message title="Нет позиций в наличии" text="Снимите фильтр, чтобы увидеть все аналоги" />
      ) : (
        <ul className="divide-y divide-slate-100">
          {items.map((item) => (
            <OfferRow key={item.id} item={item} />
          ))}
        </ul>
      )}
    </>
  )
}
