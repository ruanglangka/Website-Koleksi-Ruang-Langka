import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import BookCard from '../components/BookCard.jsx'
import Pagination from '../components/Pagination.jsx'
import { LoadingGrid, ErrorState, EmptyState } from '../components/StatusStates.jsx'
import { fetchBooks, fetchCategories } from '../api/booksApi.js'
import { useDebounce } from '../hooks/useDebounce.js'

const LIMIT = 20

const SORT_OPTIONS = [
  { value: 'judul-asc', label: 'Judul (A–Z)' },
  { value: 'judul-desc', label: 'Judul (Z–A)' },
  { value: 'tahun-asc', label: 'Tahun (Terlama)' },
  { value: 'tahun-desc', label: 'Tahun (Terbaru)' },
]

export default function Katalog() {
  const [searchParams, setSearchParams] = useSearchParams()

  const [searchInput, setSearchInput] = useState(searchParams.get('q') || '')
  const debouncedSearch = useDebounce(searchInput, 400)

  const kategori = searchParams.get('kategori') || ''
  const sort = searchParams.get('sort') || 'judul-asc'
  const page = Number(searchParams.get('page') || 1)
  const [sortBy, sortDir] = sort.split('-')

  const [categories, setCategories] = useState([])
  const [result, setResult] = useState({ items: [], total: 0, totalPages: 1 })
  const [status, setStatus] = useState('loading')
  const [viewMode, setViewMode] = useState('grid') // grid | list

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => setCategories([]))
  }, [])

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
      kategori,
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
  }, [page, searchParams, kategori, sortBy, sortDir])

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
            placeholder="Cari judul buku atau penulis..."
            className="w-full rounded-lg border border-navy-500/15 bg-parchment-50 py-2.5 pl-10 pr-4 text-sm text-ink-900 placeholder:text-ink-800/40 focus:border-navy-500 dark:border-gilt-400/15 dark:bg-ink-900 dark:text-parchment-100 dark:placeholder:text-parchment-100/40"
          />
        </div>

        <select
          value={kategori}
          onChange={(e) => updateParam('kategori', e.target.value)}
          className="rounded-lg border border-navy-500/15 bg-parchment-50 px-3 py-2.5 text-sm text-ink-900 dark:border-gilt-400/15 dark:bg-ink-900 dark:text-parchment-100"
        >
          <option value="">Semua Kategori</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

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

        <div className="flex gap-1 self-start rounded-lg border border-navy-500/15 p-1 dark:border-gilt-400/15 sm:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            aria-label="Tampilan grid"
            className={`grid h-8 w-8 place-items-center rounded-md ${
              viewMode === 'grid' ? 'bg-navy-500 text-parchment-50 dark:bg-gilt-400 dark:text-ink-900' : 'text-ink-800/60 dark:text-parchment-100/60'
            }`}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
              <rect x="3" y="3" width="8" height="8" rx="1.5" />
              <rect x="13" y="3" width="8" height="8" rx="1.5" />
              <rect x="3" y="13" width="8" height="8" rx="1.5" />
              <rect x="13" y="13" width="8" height="8" rx="1.5" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('list')}
            aria-label="Tampilan daftar"
            className={`grid h-8 w-8 place-items-center rounded-md ${
              viewMode === 'list' ? 'bg-navy-500 text-parchment-50 dark:bg-gilt-400 dark:text-ink-900' : 'text-ink-800/60 dark:text-parchment-100/60'
            }`}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
            </svg>
          </button>
        </div>
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
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4'
                : 'flex flex-col gap-3'
            }
          >
            {result.items.map((book) => (
              <BookCard key={book.id} book={book} orientation={viewMode === 'list' ? 'horizontal' : 'vertical'} />
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
