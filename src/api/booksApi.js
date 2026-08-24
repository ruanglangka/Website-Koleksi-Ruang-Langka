// ============================================================================
// booksApi.js
// Lapisan komunikasi antara website React dan Google Apps Script (sebagai API
// gratis) yang membaca data dari Google Spreadsheet.
//
// CARA SETUP:
// 1. Deploy file apps-script/Code.gs sebagai Web App (lihat README.md).
// 2. Salin URL Web App yang dihasilkan (formatnya https://script.google.com/macros/s/XXXX/exec)
// 3. Tempel URL tersebut ke variabel VITE_API_URL pada file .env
//    (contoh ada di .env.example)
// ============================================================================

const API_URL = import.meta.env.VITE_API_URL || ''

if (!API_URL && import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.warn(
    '[booksApi] VITE_API_URL belum diatur. Website akan memakai data contoh (mock) di src/data/sampleBooks.js. ' +
      'Lihat README.md bagian "Menghubungkan ke Google Spreadsheet".'
  )
}

async function callApi(params = {}) {
  if (!API_URL) {
    const { getMockResponse } = await import('../data/sampleBooks.js')
    return getMockResponse(params)
  }

  const url = new URL(API_URL)
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value)
    }
  })

  const res = await fetch(url.toString())
  if (!res.ok) {
    throw new Error(`Gagal mengambil data dari server (status ${res.status})`)
  }
  const json = await res.json()
  if (json.error) {
    throw new Error(json.error)
  }
  return json
}

/**
 * Mengambil daftar buku dengan pagination, pencarian, filter kategori, dan sorting.
 * Semua pemrosesan (filter/sort/pagination) dilakukan di sisi Apps Script
 * agar client tidak perlu mengunduh 13.000+ baris sekaligus.
 */
export async function fetchBooks({
  page = 1,
  limit = 20,
  search = '',
  searchField = 'semua',
  kategori = '',
  sortBy = 'judul',
  sortDir = 'asc',
} = {}) {
  const data = await callApi({
    action: 'list',
    page,
    limit,
    search,
    searchField,
    kategori,
    sortBy,
    sortDir,
  })
  return {
    items: data.items || [],
    total: data.total || 0,
    page: data.page || page,
    totalPages: data.totalPages || 1,
  }
}

/** Mengambil satu buku berdasarkan ID (nomor baris / kode koleksi). */
export async function fetchBookById(id) {
  const data = await callApi({ action: 'detail', id })
  return data.item || null
}

/** Mengambil daftar kategori unik untuk dropdown filter. */
export async function fetchCategories() {
  const data = await callApi({ action: 'categories' })
  return data.categories || []
}

/** Mengambil beberapa buku unggulan untuk ranking di dashboard. */
export async function fetchFeatured() {
  const data = await callApi({ action: 'featured' })
  return data.items || []
}
