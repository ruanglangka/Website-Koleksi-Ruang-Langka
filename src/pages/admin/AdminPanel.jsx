import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext.jsx'
import { useAdminAuth } from '../../context/AdminAuthContext.jsx'
import { fetchBooks } from '../../api/booksApi.js'
import { createBook, updateBook, deleteBook } from '../../api/adminApi.js'
import BookForm from '../../components/admin/BookForm.jsx'
import { useDebounce } from '../../hooks/useDebounce.js'

const LIMIT_OPTIONS = [10, 15, 25, 50, 100]

// Opsi field pencarian — persis seperti selektor "Semua Field" di situs
// publik. 'semua' berarti tidak membatasi field (cari di semua kolom).
const SEARCH_FIELD_OPTIONS = [
  { value: 'semua', label: 'Semua Field' },
  { value: 'judul', label: 'Judul' },
  { value: 'lokasiRak', label: 'Nomor Panggil' },
  { value: 'aksara', label: 'Aksara' },
  { value: 'nomorInduk', label: 'Nomor Induk' },
]

// Opsi sorting untuk tabel admin. value = `${field}-${dir}`, dipecah saat
// dikirim ke fetchBooks. "urutan-asc" adalah sinyal khusus ke Code.gs supaya
// TIDAK diurutkan ulang, dipertahankan sesuai urutan asli baris di
// spreadsheet (kolom "NO") — ini dipakai sebagai default.
const SORT_OPTIONS = [
  { value: 'urutan-asc', label: 'Urutan Asli' },
  { value: 'judul-asc', label: 'Judul (A-Z)' },
  { value: 'judul-desc', label: 'Judul (Z-A)' },
  { value: 'lokasiRak-asc', label: 'Nomor Panggil (A-Z)' },
  { value: 'lokasiRak-desc', label: 'Nomor Panggil (Z-A)' },
  { value: 'nomorInduk-asc', label: 'Nomor Induk (A-Z)' },
  { value: 'nomorInduk-desc', label: 'Nomor Induk (Z-A)' },
]

export default function AdminPanel() {
  const { isNight, toggle } = useTheme()
  const { session } = useAdminAuth()
  const navigate = useNavigate()

  const [searchInput, setSearchInput] = useState('')
  const debouncedSearch = useDebounce(searchInput, 400)
  const [searchField, setSearchField] = useState('semua')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(15)
  const [sortValue, setSortValue] = useState('urutan-asc')
  const [sortBy, sortDir] = sortValue.split('-')

  const [result, setResult] = useState({ items: [], total: 0, totalPages: 1 })
  const [status, setStatus] = useState('loading')
  const [formMode, setFormMode] = useState(null) // null | 'create' | book object (edit)
  const [saving, setSaving] = useState(false)
  const [actionError, setActionError] = useState('')

  function loadBooks() {
    setStatus('loading')
    fetchBooks({
      page,
      limit,
      search: debouncedSearch,
      searchField: searchField === 'semua' ? undefined : searchField,
      sortBy,
      sortDir,
    })
      .then((data) => {
        setResult(data)
        setStatus('done')
      })
      .catch(() => setStatus('error'))
  }

  useEffect(() => {
    loadBooks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, debouncedSearch, searchField, sortValue])

  function handleLimitChange(newLimit) {
    setLimit(newLimit)
    setPage(1)
  }

  function handleSearchFieldChange(newField) {
    setSearchField(newField)
    setPage(1)
  }

  function handleSortChange(newSortValue) {
    setSortValue(newSortValue)
    setPage(1)
  }

  async function handleSubmit(bookData) {
    setSaving(true)
    setActionError('')
    try {
      if (formMode && formMode !== 'create') {
        await updateBook(session.idToken, formMode.id, bookData)
      } else {
        await createBook(session.idToken, bookData)
      }
      setFormMode(null)
      loadBooks()
    } catch (err) {
      setActionError(err.message || 'Gagal menyimpan data.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(book) {
    if (!window.confirm(`Hapus koleksi "${book.judul}"? Tindakan ini tidak bisa dibatalkan.`)) return
    setActionError('')
    try {
      await deleteBook(session.idToken, book.id)
      loadBooks()
    } catch (err) {
      setActionError(err.message || 'Gagal menghapus data.')
    }
  }

  // Badge status ala kartu katalog publik: titik hijau untuk "Tersedia",
  // abu-abu netral untuk status lain (mis. "Dipinjam", atau kosong).
  function StatusBadge({ status: kondisi }) {
    if (!kondisi) {
      return <span className="text-xs text-ink-800/40 dark:text-parchment-100/40">—</span>
    }
    const isTersedia = kondisi.toLowerCase() === 'tersedia'
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${
          isTersedia
            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300'
            : 'bg-navy-500/10 text-navy-600 dark:bg-parchment-100/10 dark:text-parchment-200'
        }`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${isTersedia ? 'bg-emerald-500' : 'bg-ink-800/40 dark:bg-parchment-100/40'}`}
          aria-hidden="true"
        />
        {kondisi}
      </span>
    )
  }

  const rangeStart = result.total === 0 ? 0 : (page - 1) * limit + 1
  const rangeEnd = Math.min(page * limit, result.total)

  return (
    <div className="paper-grain min-h-screen">
      {/* Header — disamakan gayanya persis dengan Navbar situs publik */}
      <header className="sticky top-0 z-40 border-b border-heritage-100 bg-white/90 backdrop-blur dark:border-obsidian-border dark:bg-black/90">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          {/* KIRI: logo & judul, identik dengan Navbar publik */}
          <div className="flex shrink-0 items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-md bg-parchment-50 dark:bg-navy-500/15">
              <img
                src="icons/day.png"
                alt="Logo Karsa Siang"
                className="block h-11 w-11 object-contain dark:hidden"
              />
              <img
                src="icons/night.png"
                alt="Logo Karsa Malam"
                className="hidden h-11 w-11 object-contain dark:block"
              />
            </span>
            <div className="leading-tight">
              <p className="font-aksara text-[10px] uppercase tracking-[0.22em] text-gilt-500 dark:text-gilt-300">
                Panel Admin
              </p>
              <p className="font-display text-lg font-bold text-heritage-800 dark:text-heritage-50 sm:text-xl">
                Koleksi Ruang Langka
              </p>
            </div>
          </div>

          {/* KANAN: sesi admin, link situs publik, tombol tema & keluar bulat */}
          <div className="flex items-center gap-3">
            {session && (
              <div className="hidden items-center gap-2 rounded-full border border-navy-500/10 py-1 pl-1 pr-3 dark:border-gilt-400/15 sm:flex">
                {session.picture ? (
                  <img src={session.picture} alt="" className="h-7 w-7 rounded-full" referrerPolicy="no-referrer" />
                ) : (
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-navy-500/10 text-xs font-semibold text-navy-600 dark:bg-gilt-400/10 dark:text-gilt-300">
                    {(session.name || '?')[0]}
                  </span>
                )}
                <span className="text-sm text-ink-800/70 dark:text-parchment-100/70">{session.name}</span>
              </div>
            )}
            <Link
              to="/dashboard"
              className="hidden px-3 py-2 text-sm font-medium tracking-wide text-ink-800/80 transition-colors hover:text-navy-500 dark:text-parchment-100/80 dark:hover:text-gilt-300 sm:inline"
            >
              Lihat situs publik
            </Link>
            <span className="hidden h-6 w-px bg-ink-300/30 dark:bg-parchment-100/20 sm:block" aria-hidden="true" />
            <button
              onClick={toggle}
              aria-label={isNight ? 'Aktifkan mode siang' : 'Aktifkan mode malam'}
              title={isNight ? 'Mode Siang' : 'Mode Malam'}
              className="grid h-10 w-10 place-items-center rounded-full border border-navy-500/20 bg-parchment-100 text-navy-600 transition-colors hover:bg-navy-500/10 dark:border-gilt-400/20 dark:bg-ink-800 dark:text-gilt-300 dark:hover:bg-gilt-400/10"
            >
              {isNight ? (
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="4.5" />
                  <path d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" strokeLinecap="round" />
                </svg>
              )}
            </button>
            {/* "Keluar" cuma membawa balik ke halaman pilih peran — TIDAK
                menghapus sesi login. Login Google-nya tetap tersimpan (dan
                diperpanjang otomatis), jadi kalau pilih "Saya Admin" lagi
                nanti, langsung masuk tanpa diminta login ulang. Sesi cuma
                akan hilang kalau admin memang benar-benar sign-out dari
                akun Google-nya sendiri di browser. */}
            <button
              onClick={() => navigate('/')}
              aria-label="Keluar"
              title="Keluar"
              className="grid h-10 w-10 place-items-center rounded-full border border-navy-500/20 bg-parchment-100 text-navy-600 transition-colors hover:bg-navy-500/10 dark:border-gilt-400/20 dark:bg-ink-800 dark:text-gilt-300 dark:hover:bg-gilt-400/10"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-aksara text-xs uppercase tracking-[0.25em] text-gilt-500 dark:text-gilt-300">
              Manajemen Data
            </p>
            <h1 className="mt-1 font-display text-2xl font-semibold text-ink-900 dark:text-parchment-100 sm:text-3xl">
              Kelola Koleksi
            </h1>
          </div>
          {status === 'done' && (
            <div className="rounded-xl border border-navy-500/10 bg-navy-50 px-4 py-2 text-right shadow-card dark:border-obsidian-border dark:bg-obsidian-card dark:shadow-card-dark">
              <p className="font-display text-xl font-semibold text-navy-600 dark:text-gilt-300">
                {result.total.toLocaleString('id-ID')}
              </p>
              <p className="text-[11px] uppercase tracking-wide text-ink-800/50 dark:text-parchment-100/50">
                Total Koleksi
              </p>
            </div>
          )}
        </div>

        {actionError && (
          <p className="mb-4 rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-600 dark:text-red-300">
            {actionError}
          </p>
        )}

        {formMode ? (
          <BookForm
            initialBook={formMode === 'create' ? null : formMode}
            saving={saving}
            onCancel={() => setFormMode(null)}
            onSubmit={handleSubmit}
          />
        ) : (
          <>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-navy-500/10 bg-navy-50/60 p-3 dark:border-gilt-400/10 dark:bg-ink-800/60">
              <div className="flex flex-1 flex-wrap items-center gap-3">
                {/* Input pencarian + selektor field digabung jadi satu grup,
                    sama seperti di situs publik: kotak pencarian di kiri,
                    dropdown "Semua Field" menempel di kanan. */}
                <div className="flex max-w-md flex-1 overflow-hidden rounded-lg border border-navy-500/15 bg-parchment-50 focus-within:border-navy-500 dark:border-gilt-400/15 dark:bg-obsidian-card">
                  <div className="relative flex-1">
                    <svg
                      viewBox="0 0 24 24"
                      className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-800/40 dark:text-parchment-100/40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <circle cx="11" cy="11" r="7" />
                      <path d="M20 20l-3-3" strokeLinecap="round" />
                    </svg>
                    <input
                      value={searchInput}
                      onChange={(e) => {
                        setSearchInput(e.target.value)
                        setPage(1)
                      }}
                      placeholder="Kata kunci..."
                      className="w-full bg-transparent py-2 pl-9 pr-3 text-sm text-ink-900 placeholder:text-ink-800/40 focus:outline-none dark:text-parchment-100 dark:placeholder:text-parchment-100/40"
                    />
                  </div>
                  <div className="relative shrink-0 border-l border-navy-500/15 dark:border-gilt-400/15">
                    <select
                      value={searchField}
                      onChange={(e) => handleSearchFieldChange(e.target.value)}
                      className="h-full appearance-none bg-navy-50/60 py-2 pl-3 pr-8 text-sm font-medium text-ink-900 focus:outline-none dark:bg-ink-800/60 dark:text-parchment-100"
                      aria-label="Cari berdasarkan field"
                    >
                      {SEARCH_FIELD_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <svg
                      viewBox="0 0 24 24"
                      className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-800/40 dark:text-parchment-100/40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>

                {/* Dropdown sorting — sejajar dengan pencarian, sama seperti
                    selektor urutan di situs publik. */}
                <div className="relative">
                  <svg
                    viewBox="0 0 24 24"
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-800/40 dark:text-parchment-100/40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M6 8h12M8 12h8M10 16h4" strokeLinecap="round" />
                  </svg>
                  <select
                    value={sortValue}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="min-w-[11rem] appearance-none rounded-lg border border-navy-500/15 bg-parchment-50 py-2 pl-9 pr-8 text-sm text-ink-900 focus:border-navy-500 dark:border-gilt-400/15 dark:bg-obsidian-card dark:text-parchment-100"
                    aria-label="Urutkan berdasarkan"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <svg
                    viewBox="0 0 24 24"
                    className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-800/40 dark:text-parchment-100/40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              <button
                onClick={() => setFormMode('create')}
                className="flex items-center gap-1.5 rounded-lg bg-navy-500 px-4 py-2 text-sm font-semibold text-parchment-50 shadow-book transition-colors hover:bg-navy-600 dark:bg-gilt-400 dark:text-ink-900 dark:hover:bg-gilt-300"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                </svg>
                Tambah Koleksi
              </button>
            </div>

            <div className="relative overflow-hidden rounded-xl border border-navy-500/10 shadow-card dark:border-obsidian-border dark:shadow-card-dark">
              <span
                className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-navy-500 via-gilt-400 to-navy-500 dark:from-gilt-500 dark:via-gilt-300 dark:to-gilt-500"
                aria-hidden="true"
              />
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-navy-50 text-xs uppercase tracking-wide text-navy-700 dark:bg-obsidian-card dark:text-gilt-300/80">
                    <tr>
                      <th className="w-16 px-4 py-3">No</th>
                      <th className="px-4 py-3">Judul</th>
                      <th className="hidden px-4 py-3 sm:table-cell">Nomor Panggil</th>
                      <th className="hidden px-4 py-3 lg:table-cell">Nomor Induk</th>
                      <th className="hidden px-4 py-3 md:table-cell">Aksara</th>
                      <th className="hidden px-4 py-3 sm:table-cell">Status</th>
                      <th className="px-4 py-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-500/10 dark:divide-obsidian-border">
                    {status === 'loading' &&
                      Array.from({ length: 6 }).map((_, i) => (
                        <tr key={i} className="animate-pulse">
                          <td className="px-4 py-3">
                            <div className="h-4 w-6 rounded bg-navy-500/10 dark:bg-gilt-400/10" />
                          </td>
                          <td className="px-4 py-3">
                            <div className="h-4 w-40 rounded bg-navy-500/10 dark:bg-gilt-400/10" />
                          </td>
                          <td className="hidden px-4 py-3 sm:table-cell">
                            <div className="h-4 w-20 rounded bg-navy-500/10 dark:bg-gilt-400/10" />
                          </td>
                          <td className="hidden px-4 py-3 lg:table-cell">
                            <div className="h-4 w-24 rounded bg-navy-500/10 dark:bg-gilt-400/10" />
                          </td>
                          <td className="hidden px-4 py-3 md:table-cell">
                            <div className="h-4 w-12 rounded bg-navy-500/10 dark:bg-gilt-400/10" />
                          </td>
                          <td className="hidden px-4 py-3 sm:table-cell">
                            <div className="h-4 w-16 rounded bg-navy-500/10 dark:bg-gilt-400/10" />
                          </td>
                          <td className="px-4 py-3" />
                        </tr>
                      ))}

                    {status === 'error' && (
                      <tr>
                        <td colSpan={7} className="px-4 py-10 text-center text-ink-800/60 dark:text-parchment-100/60">
                          Gagal memuat data.{' '}
                          <button onClick={loadBooks} className="text-navy-600 underline dark:text-gilt-300">
                            Coba lagi
                          </button>
                        </td>
                      </tr>
                    )}

                    {status === 'done' && result.items.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-4 py-10 text-center text-ink-800/60 dark:text-parchment-100/60">
                          Tidak ada koleksi ditemukan.
                        </td>
                      </tr>
                    )}

                    {status === 'done' &&
                      result.items.map((book, idx) => (
                        <tr
                          key={book.id}
                          className="text-ink-900 transition-colors odd:bg-navy-50/30 hover:bg-navy-50 dark:text-parchment-100 dark:odd:bg-white/[0.02] dark:hover:bg-gilt-400/5"
                        >
                          <td className="px-4 py-3 text-ink-800/50 dark:text-parchment-100/50">
                            {(page - 1) * limit + idx + 1}
                          </td>
                          <td className="px-4 py-3">
                            <p className="font-medium">{book.judul}</p>
                            <p className="text-xs text-ink-800/50 dark:text-parchment-100/50 sm:hidden">
                              {book.lokasiRak}
                            </p>
                            <p className="mt-0.5 text-xs text-ink-800/50 dark:text-parchment-100/50 lg:hidden">
                              No. Induk: {book.nomorInduk || '—'}
                            </p>
                          </td>
                          <td className="hidden px-4 py-3 sm:table-cell">{book.lokasiRak}</td>
                          <td className="hidden px-4 py-3 lg:table-cell">{book.nomorInduk || '—'}</td>
                          <td className="hidden px-4 py-3 md:table-cell">
                            {book.aksara && (
                              <span className="rounded-full bg-navy-50 px-2 py-0.5 text-xs font-medium text-navy-600 dark:bg-gilt-400/10 dark:text-gilt-300">
                                {book.aksara}
                              </span>
                            )}
                          </td>
                          <td className="hidden px-4 py-3 sm:table-cell">
                            <StatusBadge status={book.kondisi} />
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => setFormMode(book)}
                                className="flex items-center gap-1 rounded-md border border-navy-500/20 px-2.5 py-1 text-xs font-medium text-navy-600 transition-colors hover:bg-navy-500/5 dark:border-gilt-400/20 dark:text-gilt-300 dark:hover:bg-gilt-400/10"
                              >
                                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
                                  <path d="M12 20h9" strokeLinecap="round" />
                                  <path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Ubah
                              </button>
                              <button
                                onClick={() => handleDelete(book)}
                                className="flex items-center gap-1 rounded-md border border-red-400/30 px-2.5 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-400/10 dark:text-red-300"
                              >
                                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
                                  <path d="M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Hapus
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {status === 'done' && (
              <div className="mt-5 flex flex-col items-center justify-between gap-4 sm:flex-row">
                <div className="flex items-center gap-2 text-sm text-ink-800/60 dark:text-parchment-100/60">
                  <span>
                    Menampilkan {rangeStart.toLocaleString('id-ID')}–{rangeEnd.toLocaleString('id-ID')} dari{' '}
                    {result.total.toLocaleString('id-ID')}
                  </span>
                  <span className="hidden h-4 w-px bg-navy-500/15 dark:bg-gilt-400/15 sm:block" aria-hidden="true" />
                  <label className="hidden items-center gap-1.5 sm:flex">
                    Baris/hal:
                    <select
                      value={limit}
                      onChange={(e) => handleLimitChange(Number(e.target.value))}
                      className="rounded-md border border-navy-500/15 bg-parchment-50 px-2 py-1 text-sm text-ink-900 dark:border-gilt-400/15 dark:bg-obsidian-card dark:text-parchment-100"
                    >
                      {LIMIT_OPTIONS.map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                {result.totalPages > 1 && (
                  <div className="flex items-center gap-2 text-sm">
                    <button
                      disabled={page <= 1}
                      onClick={() => setPage(1)}
                      className="rounded-md border border-navy-500/20 px-2.5 py-1.5 disabled:opacity-30 dark:border-gilt-400/20 dark:text-gilt-300"
                      aria-label="Halaman pertama"
                    >
                      «
                    </button>
                    <button
                      disabled={page <= 1}
                      onClick={() => setPage((p) => p - 1)}
                      className="rounded-md border border-navy-500/20 px-3 py-1.5 disabled:opacity-30 dark:border-gilt-400/20 dark:text-gilt-300"
                    >
                      ‹ Sebelumnya
                    </button>
                    <span className="px-2 text-ink-800/60 dark:text-parchment-100/60">
                      Halaman {page} dari {result.totalPages}
                    </span>
                    <button
                      disabled={page >= result.totalPages}
                      onClick={() => setPage((p) => p + 1)}
                      className="rounded-md border border-navy-500/20 px-3 py-1.5 disabled:opacity-30 dark:border-gilt-400/20 dark:text-gilt-300"
                    >
                      Berikutnya ›
                    </button>
                    <button
                      disabled={page >= result.totalPages}
                      onClick={() => setPage(result.totalPages)}
                      className="rounded-md border border-navy-500/20 px-2.5 py-1.5 disabled:opacity-30 dark:border-gilt-400/20 dark:text-gilt-300"
                      aria-label="Halaman terakhir"
                    >
                      »
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}