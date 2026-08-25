// Data contoh (mock) — dipakai HANYA jika VITE_API_URL belum diatur,
// supaya tampilan tetap bisa dicoba sebelum Google Apps Script disambungkan.
// Setelah API asli terhubung, file ini tidak lagi dipakai (lihat booksApi.js).

const KATEGORI = ['Manuskrip', 'Naskah Jawa', 'Aksara Kuno', 'Novel Lawas', 'Peta Kuno']

function generate(n) {
  const arr = []
  for (let i = 1; i <= n; i++) {
    const kategori = KATEGORI[i % KATEGORI.length]
    arr.push({
      id: String(i),
      judul: `${kategori} Koleksi No. ${i}`,
      penulis: `Penulis/Penyalin ${((i * 7) % 40) + 1}`,
      kategori,
      tahun: 1800 + ((i * 3) % 200),
      bahasa: i % 3 === 0 ? 'Jawa' : i % 3 === 1 ? 'Melayu' : 'Belanda',
      lokasiRak: `R.${1 + (i % 12)}-${1 + (i % 30)}`,
      kondisi: i % 5 === 0 ? 'Rapuh' : 'Baik',
      deskripsi:
        'Deskripsi contoh koleksi. Data lengkap akan tampil otomatis setelah Google Spreadsheet dan Apps Script terhubung.',
      sampul: '',
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
  kategori = '',
  sortBy = 'judul',
  sortDir = 'asc',
  id,
}) {
  if (action === 'categories') {
    return { categories: KATEGORI }
  }
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
    filtered = filtered.filter((b) => {
      if (searchField === 'semua') {
        return (
          b.judul.toLowerCase().includes(q) ||
          b.penulis.toLowerCase().includes(q) ||
          b.kategori.toLowerCase().includes(q) ||
          String(b.tahun).includes(q) ||
          b.lokasiRak.toLowerCase().includes(q) ||
          b.id.toLowerCase().includes(q)
        )
      }
      const value = b[searchField]
      return value !== undefined && String(value).toLowerCase().includes(q)
    })
  }
  if (kategori) {
    filtered = filtered.filter((b) => b.kategori === kategori)
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
