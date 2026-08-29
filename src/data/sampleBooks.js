// Data contoh (mock) — dipakai HANYA jika VITE_API_URL belum diatur,
// supaya tampilan tetap bisa dicoba sebelum Google Apps Script disambungkan.
// Setelah API asli terhubung, file ini tidak lagi dipakai (lihat booksApi.js).
//
// Struktur field di sini SENGAJA dibuat sama persis dengan kolom di
// spreadsheet "Katalog Baru Ruang Koleksi Langka":
// NO | NOMOR PANGGIL | DATA BIBLIOGRAFIS | STATUS DI RAK | AKSARA | NOMOR INDUK

const AKSARA = ['Jawa', 'Latin', 'Arab', 'Arab Pegon']
const KONDISI = ['Tersedia', 'Sedang Restorasi']

function generate(n) {
  const arr = []
  for (let i = 1; i <= n; i++) {
    arr.push({
      id: String(i),
      judul: `Menak Cina : koleksi naskah No. ${i}`,
      lokasiRak: `L 899.22${21 + (i % 9)} MEN`,
      kondisi: KONDISI[i % KONDISI.length],
      aksara: AKSARA[i % AKSARA.length],
      nomorInduk: `${40000 + i}-A`,
    })
  }
  return arr
}

const ALL_BOOKS = generate(13253)

const SEARCHABLE_FIELDS = ['judul', 'lokasiRak', 'aksara', 'nomorInduk']

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
  if (action === 'featured') {
    return { items: ALL_BOOKS.slice(0, 3) }
  }
  if (action === 'detail') {
    return { item: ALL_BOOKS.find((b) => b.id === String(id)) || null }
  }

  // action === 'list'
  let filtered = ALL_BOOKS
  if (search) {
    const q = search.toLowerCase()
    if (searchField !== 'semua' && SEARCHABLE_FIELDS.includes(searchField)) {
      filtered = filtered.filter((b) => String(b[searchField] || '').toLowerCase().includes(q))
    } else {
      filtered = filtered.filter((b) =>
        SEARCHABLE_FIELDS.some((f) => String(b[f] || '').toLowerCase().includes(q))
      )
    }
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
