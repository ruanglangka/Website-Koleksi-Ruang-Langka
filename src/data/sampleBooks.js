// Data contoh (mock) — dipakai HANYA jika VITE_API_URL belum diatur,
// supaya tampilan tetap bisa dicoba sebelum Google Apps Script disambungkan.
// Setelah API asli terhubung, file ini tidak lagi dipakai (lihat booksApi.js).
//
// PENTING: skema field di sini disamakan dengan hasil pemetaan COLUMN_MAP
// pada Code.gs (aksara, nomorInduk, lokasiRak, judul, kondisi), supaya
// sorting/pencarian saat development (tanpa VITE_API_URL) berperilaku sama
// persis dengan saat sudah tersambung ke Google Spreadsheet asli.

const AKSARA_LIST = ['Jawa', 'Latin', 'Arab Pegon', 'Bali', 'Sunda']

function generate(n) {
  const arr = []
  for (let i = 1; i <= n; i++) {
    const aksara = AKSARA_LIST[i % AKSARA_LIST.length]
    arr.push({
      id: String(i),
      judul: `Koleksi Naskah No. ${i}`,
      lokasiRak: `L ${100 + (i % 800)}.${1 + (i % 9)} ${String.fromCharCode(65 + (i % 26))}${String.fromCharCode(65 + ((i * 3) % 26))}`,
      kondisi: i % 5 === 0 ? 'Rusak' : 'Tersedia',
      aksara,
      nomorInduk: `${60000 + i}-PD/A.${19 + (i % 6)}`,
    })
  }
  return arr
}

const ALL_BOOKS = generate(13253)

export function getMockResponse({
  action,
  page = 1,
  limit = 20,
  search = '',
  searchField = 'semua',
  sortBy = 'judul',
  sortDir = 'asc',
  id,
}) {
  if (action === 'categories') {
    return { categories: AKSARA_LIST }
  }
  if (action === 'featured') {
    return { items: ALL_BOOKS.slice(0, 3) }
  }
  if (action === 'detail') {
    return { item: ALL_BOOKS.find((b) => b.id === String(id)) || null }
  }

  // Field yang boleh dipakai untuk pencarian, sinkron dengan
  // SEARCHABLE_FIELDS di Code.gs.
  const SEARCHABLE_FIELDS = ['judul', 'lokasiRak', 'aksara', 'nomorInduk']

  // action === 'list'
  let filtered = ALL_BOOKS
  if (search) {
    const q = search.toLowerCase()
    filtered = filtered.filter((b) => {
      if (searchField && searchField !== 'semua' && SEARCHABLE_FIELDS.includes(searchField)) {
        return String(b[searchField] ?? '').toLowerCase().includes(q)
      }
      return SEARCHABLE_FIELDS.some((f) => String(b[f] ?? '').toLowerCase().includes(q))
    })
  }

  filtered = [...filtered].sort((a, b) => {
    const av = a[sortBy] ?? ''
    const bv = b[sortBy] ?? ''
    const cmp = String(av).localeCompare(String(bv), 'id', { numeric: true })
    return sortDir === 'asc' ? cmp : -cmp
  })

  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const start = (page - 1) * limit
  const items = filtered.slice(start, start + limit)

  return { items, total, page: Number(page), totalPages }
}