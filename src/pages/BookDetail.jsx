import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchBookById } from '../api/booksApi.js'
import { ErrorState } from '../components/StatusStates.jsx'

const FIELD_LABELS = [
  ['penulis', 'Penulis / Penyalin'],
  ['kategori', 'Kategori'],
  ['tahun', 'Tahun'],
  ['bahasa', 'Bahasa'],
  ['lokasiRak', 'Lokasi Rak'],
  ['kondisi', 'Kondisi Fisik'],
]

export default function BookDetail() {
  const { id } = useParams()
  
  const [book, setBook] = useState(null)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let alive = true
    setStatus('loading')
    
    fetchBookById(id)
      .then((data) => {
        if (!alive) return
        if (!data) setStatus('notfound')
        else {
          setBook(data)
          setStatus('done')
        }
      })
      .catch(() => alive && setStatus('error'))
      
    return () => {
      alive = false
    }
  }, [id])

  if (status === 'loading') {
    return (
      <div className="mx-auto max-w-5xl animate-pulse px-4 py-12 sm:px-6 lg:px-8">
        <div className="h-4 w-32 rounded bg-navy-500/10 dark:bg-gilt-400/10" />
        <div className="mt-8 grid grid-cols-1 gap-10 sm:grid-cols-[240px_1fr]">
          <div className="aspect-[3/4] rounded-lg bg-navy-500/10 dark:bg-gilt-400/10" />
          <div className="space-y-3">
            <div className="h-3 w-24 rounded bg-navy-500/10 dark:bg-gilt-400/10" />
            <div className="h-7 w-3/4 rounded bg-navy-500/10 dark:bg-gilt-400/10" />
            <div className="h-4 w-1/2 rounded bg-navy-500/10 dark:bg-gilt-400/10" />
          </div>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="px-4 py-16">
        <ErrorState message="Tidak dapat mengambil detail koleksi ini." />
      </div>
    )
  }

  if (status === 'notfound') {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="font-display text-2xl font-semibold text-ink-900 dark:text-parchment-100">
          Koleksi tidak ditemukan
        </p>
        <Link 
          to="/katalog" 
          className="inline-flex items-center gap-1 text-sm font-medium text-navy-600 hover:underline dark:text-gilt-300"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="m12 19-7-7 7-7"/>
            <path d="M19 12H5"/>
          </svg>
          Kembali
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      
      <div className="flex items-center justify-between">
        <Link 
          to="/katalog" 
          className="inline-flex items-center gap-1 text-sm font-medium text-navy-600 hover:underline dark:text-gilt-300"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="m12 19-7-7 7-7"/>
            <path d="M19 12H5"/>
          </svg>
          Kembali
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-10 sm:grid-cols-[240px_1fr] sm:items-start">
        {/* Cover Display (Tanpa Fitur Upload) */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gradient-to-br from-navy-500/90 to-navy-700 shadow-book ring-1 ring-navy-900/10">
          {book.sampul ? (
            <img src={book.sampul} alt={book.judul} className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full w-full place-items-center p-4 text-center">
              <span className="font-display text-sm leading-snug text-parchment-50/80">
                {book.judul}
              </span>
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <span className="inline-block rounded-full bg-gilt-400/15 px-2.5 py-1 text-xs font-medium text-gilt-500 dark:text-gilt-300">
            {book.kategori}
          </span>
          <h1 className="mt-3 font-display text-2xl font-semibold leading-snug text-ink-900 dark:text-parchment-100 sm:text-3xl">
            {book.judul}
          </h1>

          <dl className="mt-6 divide-y divide-navy-500/10 border-t border-navy-500/10 dark:divide-gilt-400/10 dark:border-gilt-400/10">
            {FIELD_LABELS.map(([key, label]) =>
              book[key] ? (
                <div
                  key={key}
                  className="grid grid-cols-[130px_1fr] gap-4 py-2.5 text-sm sm:grid-cols-[160px_1fr]"
                >
                  <dt className="text-ink-800/50 dark:text-parchment-100/50">{label}</dt>
                  <dd className="text-ink-900 dark:text-parchment-100">{book[key]}</dd>
                </div>
              ) : null
            )}
          </dl>

          {book.deskripsi && (
            <div className="mt-8">
              <h2 className="text-xs uppercase tracking-wide text-ink-800/50 dark:text-parchment-100/50">
                Deskripsi
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-800/80 dark:text-parchment-100/80">
                {book.deskripsi}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}