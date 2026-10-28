import { useSelector } from 'react-redux'
import BrandList from './components/BrandList'
import { GearIcon } from './components/icons'
import OffersTable from './components/OffersTable'
import SearchForm from './components/SearchForm'

function Panel({ step, title, subtitle, children }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white">
          {step}
        </span>
        <div className="min-w-0">
          <h2 className="font-semibold">{title}</h2>
          {subtitle && <p className="truncate text-sm text-slate-500">{subtitle}</p>}
        </div>
      </header>
      {children}
    </section>
  )
}

export default function App() {
  const { query, selected, brands } = useSelector((state) => state.search)
  const hasBrands = brands.items.length > 0

  return (
    <div className="mx-auto min-h-screen max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-8 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
          <GearIcon className="size-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Подбор автозапчастей</h1>
          <p className="text-sm text-slate-500">Поиск по артикулу, аналоги и наличие на складах</p>
        </div>
      </header>

      <SearchForm />

      {query ? (
        <main className={`mt-8 grid items-start gap-6 ${hasBrands ? 'lg:grid-cols-[360px_1fr]' : 'mx-auto max-w-md'}`}>
          <Panel step={1} title="Производитель" subtitle={`Артикул «${query}»`}>
            <BrandList />
          </Panel>
          {hasBrands && (
            <Panel
              step={2}
              title="Аналоги и предложения"
              subtitle={selected ? `${selected.brand} · ${selected.number}` : null}
            >
              <OffersTable />
            </Panel>
          )}
        </main>
      ) : (
        <p className="mt-16 text-center text-sm text-slate-400">
          Введите артикул детали — мы найдём производителей, а затем аналоги с ценами и остатками
        </p>
      )}
    </div>
  )
}
