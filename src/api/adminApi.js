// ============================================================================
// adminApi.js — aksi TULIS (tambah/ubah/hapus) ke Google Apps Script.
// Berbeda dari booksApi.js (baca/list, pakai GET), file ini pakai POST dan
// menyertakan idToken Google supaya Apps Script bisa memverifikasi identitas
// admin sebelum menyentuh Spreadsheet.
//
// PENTING soal CORS: request dikirim dengan Content-Type 'text/plain' (bukan
// 'application/json') supaya browser menganggapnya "simple request" dan tidak
// mengirim preflight OPTIONS — Apps Script Web App tidak menangani preflight
// dengan baik. Apps Script tetap mem-parse body-nya sebagai JSON di sisi server.
// ============================================================================

const API_URL = import.meta.env.VITE_API_URL || ''

async function callAdminApi(body) {
  if (!API_URL) {
    throw new Error(
      'VITE_API_URL belum diatur. Admin panel butuh koneksi ke Apps Script yang sama dengan katalog.'
    )
  }
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    throw new Error(`Gagal menghubungi server (status ${res.status})`)
  }
  const json = await res.json()
  if (json.error) throw new Error(json.error)
  return json
}

/** Memverifikasi idToken Google ke server & mengecek apakah emailnya ada di daftar admin. */
export async function verifyAdmin(idToken) {
  return callAdminApi({ action: 'whoami', idToken })
}

/** Menambah koleksi baru. */
export async function createBook(idToken, book) {
  return callAdminApi({ action: 'create', idToken, book })
}

/** Mengubah koleksi yang sudah ada (berdasarkan id). */
export async function updateBook(idToken, id, book) {
  return callAdminApi({ action: 'update', idToken, id, book })
}

/** Menghapus koleksi berdasarkan id. */
export async function deleteBook(idToken, id) {
  return callAdminApi({ action: 'delete', idToken, id })
}
