import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext.jsx'
import { useAdminAuth } from '../../context/AdminAuthContext.jsx'
import { fetchBooks } from '../../api/booksApi.js'
import { createBook, updateBook, deleteBook } from '../../api/adminApi.js'
import BookForm from '../../components/admin/BookForm.jsx'
import { useDebounce } from '../../hooks/useDebounce.js'

const LIMIT = 15

export default function AdminPanel() {
  const { isNight, toggle } = useTheme()
  const { session, logout } = useAdminAuth()

  const [searchInput, setSearchInput] = useState('')
  const debouncedSearch = useDebounce(searchInput, 400)
  const [page, setPage] = useState(1)

  const [result, setResult] = useState({ items: [], total: 0, totalPages: 1 })
  const [status, setStatus] = useState('loading')
  const [formMode, setFormMode] = useState(null) // null | 'create' | book object (edit)
  const [saving, setSaving] = useState(false)
  const [actionError, setActionError] = useState('')

  function loadBooks() {
    setStatus('loading')
    fetchBooks({ page, limit: LIMIT, search: debouncedSearch, sortBy: 'judul', sortDir: 'asc' })
      .then((data) => {
        setResult(data)
        setStatus('done')
      })
      .catch(() => setStatus('error'))
  }

  useEffect(() => {
    loadBooks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, debouncedSearch])

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

  return (
    <div className="min-h-screen">
      {/* Header admin — terpisah dari navbar publik */}
      <header className="sticky top-0 z-40 border-b border-navy-500/10 bg-parchment-50/90 backdrop-blur-md dark:border-gilt-400/10 dark:bg-ink-900/90">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div>
            <p className="font-display text-lg font-semibold text-navy-600 dark:text-gilt-300">
              Panel Admin
            </p>
            <p className="text-xs text-ink-800/60 dark:text-parchment-100/60">Koleksi Ruang Langka</p>
          </div>
          <div className="flex items-center gap-3">
            {session && (
              <div className="hidden items-center gap-2 sm:flex">
                {session.picture && (
                  <img src={session.picture} alt="" className="h-8 w-8 rounded-full" referrerPolicy="no-referrer" />
                )}
                <span className="text-sm text-ink-800/70 dark:text-parchment-100/70">{session.name}</span>
              </div>
            )}
            <button
              onClick={toggle}
              aria-label="Ganti tema"
              className="grid h-9 w-9 place-items-center rounded-full border border-navy-500/20 text-navy-600 dark:border-gilt-400/20 dark:text-gilt-300"
            >
              {isNight ? (
                <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="currentColor">
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="4.5" />
                </svg>
              )}
            </button>
            <Link
              to="/dashboard"
              className="hidden text-sm font-medium text-navy-600 hover:underline dark:text-gilt-300 sm:inline"
            >
              Lihat situs publik
            </Link>
            <button
              onClick={logout}
              className="rounded-lg border border-navy-500/25 px-3 py-1.5 text-sm font-semibold text-navy-600 hover:bg-navy-500/5 dark:border-gilt-400/25 dark:text-gilt-300 dark:hover:bg-gilt-400/10"
            >
              Keluar
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
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
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div className="relative max-w-xs flex-1">
                <input
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value)
                    setPage(1)
                  }}
                  placeholder="Cari judul atau penulis..."
                  className="w-full rounded-lg border border-navy-500/15 bg-navy-50 px-3 py-2 text-sm text-ink-900 placeholder:text-ink-800/40 focus:border-navy-500 dark:border-gilt-400/15 dark:bg-obsidian-card dark:text-parchment-100"
                />
              </div>
              <button
                onClick={() => setFormMode('create')}
                className="rounded-lg bg-navy-500 px-4 py-2 text-sm font-semibold text-parchment-50 hover:bg-navy-600 dark:bg-gilt-400 dark:text-ink-900 dark:hover:bg-gilt-300"
              >
                + Tambah Koleksi
              </button>
            </div>

            <div className="overflow-hidden rounded-xl border border-navy-500/10 dark:border-obsidian-border">
              <table className="w-full text-left text-sm">
                <thead className="bg-navy-50 text-xs uppercase tracking-wide text-ink-800/60 dark:bg-obsidian-card dark:text-parchment-100/60">
                  <tr>
                    <th className="px-4 py-3">Judul</th>
                    <th className="hidden px-4 py-3 sm:table-cell">Nomor Panggil</th>
                    <th className="hidden px-4 py-3 md:table-cell">Aksara</th>
                    <th className="px-4 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-500/10 dark:divide-obsidian-border">
                  {status === 'loading' &&
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-4 py-3">
                          <div className="h-4 w-40 rounded bg-navy-500/10 dark:bg-gilt-400/10" />
                        </td>
                        <td className="hidden px-4 py-3 sm:table-cell">
                          <div className="h-4 w-20 rounded bg-navy-500/10 dark:bg-gilt-400/10" />
                        </td>
                        <td className="hidden px-4 py-3 md:table-cell">
                          <div className="h-4 w-12 rounded bg-navy-500/10 dark:bg-gilt-400/10" />
                        </td>
                        <td className="px-4 py-3" />
                      </tr>
                    ))}

                  {status === 'error' && (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center text-ink-800/60 dark:text-parchment-100/60">
                        Gagal memuat data.{' '}
                        <button onClick={loadBooks} className="text-navy-600 underline dark:text-gilt-300">
                          Coba lagi
                        </button>
                      </td>
                    </tr>
                  )}

                  {status === 'done' && result.items.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center text-ink-800/60 dark:text-parchment-100/60">
                        Tidak ada koleksi ditemukan.
                      </td>
                    </tr>
                  )}

                  {status === 'done' &&
                    result.items.map((book) => (
                      <tr key={book.id} className="text-ink-900 dark:text-parchment-100">
                        <td className="px-4 py-3">
                          <p className="font-medium">{book.judul}</p>
                          <p className="text-xs text-ink-800/50 dark:text-parchment-100/50 sm:hidden">
                            {book.lokasiRak}
                          </p>
                        </td>
                        <td className="hidden px-4 py-3 sm:table-cell">{book.lokasiRak}</td>
                        <td className="hidden px-4 py-3 md:table-cell">{book.aksara}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setFormMode(book)}
                              className="rounded-md border border-navy-500/20 px-2.5 py-1 text-xs font-medium text-navy-600 hover:bg-navy-500/5 dark:border-gilt-400/20 dark:text-gilt-300 dark:hover:bg-gilt-400/10"
                            >
                              Ubah
                            </button>
                            <button
                              onClick={() => handleDelete(book)}
                              className="rounded-md border border-red-400/30 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-400/10 dark:text-red-300"
                            >
                              Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {status === 'done' && result.totalPages > 1 && (
              <div className="mt-4 flex items-center justify-center gap-3 text-sm">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="rounded-md border border-navy-500/20 px-3 py-1 disabled:opacity-30 dark:border-gilt-400/20"
                >
                  ‹ Sebelumnya
                </button>
                <span className="text-ink-800/60 dark:text-parchment-100/60">
                  Halaman {page} dari {result.totalPages}
                </span>
                <button
                  disabled={page >= result.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-md border border-navy-500/20 px-3 py-1 disabled:opacity-30 dark:border-gilt-400/20"
                >
                  Berikutnya ›
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
