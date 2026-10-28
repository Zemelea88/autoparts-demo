const API_URL = 'https://api.favorit-parts.ru/hs/hsprice/'
const API_KEY = import.meta.env.VITE_FAVORIT_KEY || '00000000-0000-0000-0000-000000000001'

const EMPTY_GOODS_ID = '00000000-0000-0000-0000-000000000000'

const API_ERRORS = {
  'Empty key!': 'Не указан ключ покупателя',
  'Invalid key client!': 'Неверный ключ покупателя',
  'Invalid access key': 'Неверный ключ доступа',
  'Empty number goods!': 'Не указан номер детали',
  'Request quota exceeded!': 'Превышен лимит запросов, попробуйте позже',
}

async function request(params) {
  const query = new URLSearchParams({ key: API_KEY, ...params })

  let response
  try {
    response = await fetch(`${API_URL}?${query}`)
  } catch {
    throw new Error('Не удалось связаться с сервером. Проверьте подключение к интернету.')
  }

  let data
  try {
    data = await response.json()
  } catch {
    throw new Error(`Сервер вернул некорректный ответ (HTTP ${response.status})`)
  }

  if (data.error) throw new Error(API_ERRORS[data.error] ?? data.error)
  if (!response.ok) throw new Error(`Ошибка сервера (HTTP ${response.status})`)

  return (data.goods ?? []).filter((good) => good.goodsID !== EMPTY_GOODS_ID && good.brand)
}

function toItem(good) {
  const warehouses = (good.warehouses ?? [])
    .filter((w) => w.stock > 0)
    .map((w) => ({
      id: w.id,
      code: w.code || 'Склад',
      price: w.price,
      stock: w.stock,
      shipmentDate: w.shipmentDate,
    }))
    .sort((a, b) => a.price - b.price)

  return {
    id: good.goodsID,
    brand: good.brand,
    number: good.number,
    name: good.name,
    count: good.count,
    minPrice: warehouses[0]?.price ?? null,
    warehouses,
  }
}

const byAvailability = (a, b) => (b.count > 0) - (a.count > 0)
const byPrice = (a, b) => byAvailability(a, b) || (a.minPrice ?? 0) - (b.minPrice ?? 0)

export async function searchBrands(number) {
  const goods = await request({ number })
  return goods.map(toItem).sort(byAvailability)
}

export async function searchOffers(number, brand) {
  const goods = await request({ number, brand, analogues: 'on' })

  const originals = goods.map((good) => ({ ...toItem(good), isOriginal: true }))
  const seen = new Set(originals.map((item) => item.id))
  const analogues = []
  for (const good of goods.flatMap((g) => g.analogues ?? [])) {
    if (seen.has(good.goodsID)) continue
    seen.add(good.goodsID)
    analogues.push(toItem(good))
  }

  return [...originals, ...analogues.sort(byPrice)]
}
