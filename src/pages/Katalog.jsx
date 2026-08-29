import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import BookCard from '../components/BookCard.jsx'
import Pagination from '../components/Pagination.jsx'
import { LoadingGrid, ErrorState, EmptyState } from '../components/StatusStates.jsx'
import { fetchBooks } from '../api/booksApi.js'
import { useDebounce } from '../hooks/useDebounce.js'

const LIMIT = 20

const SORT_OPTIONS = [
  { value: 'judul-asc', label: 'Judul (A–Z)' },
  { value: 'judul-desc', label: 'Judul (Z–A)' },
  { value: 'lokasiRak-asc', label: 'Nomor Panggil (Terawal)' },
  { value: 'lokasiRak-desc', label: 'Nomor Panggil (Terakhir)' },
  { value: 'aksara-asc', label: 'Aksara (A–Z)' },
  { value: 'nomorInduk-asc', label: 'Nomor Induk (Terawal)' },
  { value: 'nomorInduk-desc', label: 'Nomor Induk (Terakhir)' },
]

// Pilihan field pencarian, ala OPAC iPusnas: user pilih dulu mau cari
// berdasarkan apa, baru ketik kata kuncinya.
const SEARCH_FIELD_OPTIONS = [
  { value: 'semua', label: 'Semua Field' },
  { value: 'judul', label: 'Judul' },
  { value: 'lokasiRak', label: 'Nomor Panggil' },
  { value: 'aksara', label: 'Aksara' },
  { value: 'nomorInduk', label: 'Nomor Induk' },
]

export default function Katalog() {
  const [searchParams, setSearchParams] = useSearchParams()

  const [searchInput, setSearchInput] = useState(searchParams.get('q') || '')
  const debouncedSearch = useDebounce(searchInput, 400)
  const searchField = searchParams.get('field') || 'semua'

  const sort = searchParams.get('sort') || 'judul-asc'
  const page = Number(searchParams.get('page') || 1)
  const [sortBy, sortDir] = sort.split('-')

  const [result, setResult] = useState({ items: [], total: 0, totalPages: 1 })
  const [status, setStatus] = useState('loading')

  // sinkronkan input pencarian (debounced) ke URL, reset ke halaman 1
  useEffect(() => {
    const current = searchParams.get('q') || ''
    if (debouncedSearch === current) return
    const next = new URLSearchParams(searchParams)
    if (debouncedSearch) next.set('q', debouncedSearch)
    else next.delete('q')
    next.set('page', '1')
    setSearchParams(next, { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch])

  useEffect(() => {
    let alive = true
    setStatus('loading')
    fetchBooks({
      page,
      limit: LIMIT,
      search: searchParams.get('q') || '',
      searchField,
      sortBy,
      sortDir,
    })
      .then((data) => {
        if (!alive) return
        setResult(data)
        setStatus(data.items.length ? 'done' : 'empty')
      })
      .catch(() => alive && setStatus('error'))
    return () => {
      alive = false
    }
  }, [page, searchParams, searchField, sortBy, sortDir])

  function updateParam(key, value) {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    if (key !== 'page') next.set('page', '1')
    setSearchParams(next)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="font-aksara text-xs uppercase tracking-[0.25em] text-gilt-500 dark:text-gilt-300">
          Katalog Digital
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-ink-900 dark:text-parchment-100 sm:text-3xl">
          Cari Koleksi Ruang Langka
        </h1>
      </div>

      {/* Search + sorting */}
      <div className="mb-6 flex flex-col gap-3 rounded-xl border border-navy-500/12 bg-parchment-100/60 p-4 dark:border-gilt-400/10 dark:bg-ink-800/60 sm:flex-row sm:items-center">
        {/* Kotak kata kunci + pilihan field pencarian (ala OPAC) menyatu jadi satu grup */}
        <div className="flex flex-1 flex-col overflow-hidden rounded-lg border border-navy-500/15 dark:border-gilt-400/15 sm:flex-row">
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
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Kata kunci..."
              className="w-full border-0 bg-parchment-50 py-2.5 pl-10 pr-4 text-sm text-ink-900 placeholder:text-ink-800/40 focus:outline-none focus:ring-0 dark:bg-ink-900 dark:text-parchment-100 dark:placeholder:text-parchment-100/40"
            />
          </div>
          <select
            value={searchField}
            onChange={(e) => updateParam('field', e.target.value)}
            aria-label="Cari berdasarkan"
            className="border-0 border-t border-navy-500/15 bg-parchment-100 px-3 py-2.5 text-sm text-ink-900 focus:outline-none focus:ring-0 dark:border-gilt-400/15 dark:bg-ink-800 dark:text-parchment-100 sm:border-l sm:border-t-0"
          >
            {SEARCH_FIELD_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <select
          value={sort}
          onChange={(e) => updateParam('sort', e.target.value)}
          className="rounded-lg border border-navy-500/15 bg-parchment-50 px-3 py-2.5 text-sm text-ink-900 dark:border-gilt-400/15 dark:bg-ink-900 dark:text-parchment-100"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {/* Hasil */}
      {status === 'loading' && <LoadingGrid />}
      {status === 'error' && (
        <ErrorState
          message="Tidak dapat mengambil data katalog dari server."
          onRetry={() => setStatus('loading')}
        />
      )}
      {status === 'empty' && <EmptyState />}
      {status === 'done' && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {result.items.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>

          <Pagination
            page={result.page || page}
            totalPages={result.totalPages}
            total={result.total}
            limit={LIMIT}
            onChange={(p) => updateParam('page', String(p))}
          />
        </>
      )}
    </div>
  )
}
