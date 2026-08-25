import React, { useEffect, useRef, useState } from 'react'
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

  // Cover photo upload state. `coverPreview` overrides `book.sampul` once the
  // user picks a new image. This is a local, client-side preview — wire
  // `persistCover()` below to your backend (e.g. an `updateBookCover` call in
  // booksApi.js) when you're ready to actually save the file.
  const [coverPreview, setCoverPreview] = useState(null)
  const [uploadState, setUploadState] = useState('idle') // idle | saving | saved | error
  const fileInputRef = useRef(null)

  useEffect(() => {
    let alive = true
    setStatus('loading')
    setCoverPreview(null)
    setUploadState('idle')
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

  function handlePickCover() {
    fileInputRef.current?.click()
  }

  function handleCoverChange(e) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      setCoverPreview(reader.result)
      persistCover(reader.result, file)
    }
    reader.readAsDataURL(file)

    // allow re-selecting the same file later
    e.target.value = ''
  }

  async function persistCover(dataUrl, file) {
    setUploadState('saving')
    try {
      // TODO: replace with a real call once the backend supports it, e.g.
      // await updateBookCover(id, file)
      await new Promise((resolve) => setTimeout(resolve, 500))
      setUploadState('saved')
      setTimeout(() => setUploadState('idle'), 1800)
    } catch {
      setUploadState('error')
    }
  }

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
        <Link to="/katalog" className="mt-4 inline-block text-navy-600 hover:underline dark:text-gilt-300">
          ← Kembali ke katalog
        </Link>
      </div>
    )
  }

  const displayedCover = coverPreview || book.sampul

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <Link
          to="/katalog"
          className="inline-flex items-center gap-1 text-sm font-medium text-navy-600 hover:underline dark:text-gilt-300"
        >
          ← Kembali ke katalog
        </Link>

        {uploadState !== 'idle' && (
          <span
            className={`text-xs font-medium ${
              uploadState === 'error'
                ? 'text-red-500'
                : 'text-navy-500/70 dark:text-gilt-300/70'
            }`}
          >
            {uploadState === 'saving' && 'Menyimpan sampul…'}
            {uploadState === 'saved' && 'Sampul tersimpan'}
            {uploadState === 'error' && 'Gagal menyimpan sampul'}
          </span>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-10 sm:grid-cols-[240px_1fr] sm:items-start">
        {/* Cover, with upload affordance */}
        <div className="group relative">
          <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gradient-to-br from-navy-500/90 to-navy-700 shadow-book ring-1 ring-navy-900/10">
            {displayedCover ? (
              <img src={displayedCover} alt={book.judul} className="h-full w-full object-cover" />
            ) : (
              <div className="grid h-full w-full place-items-center p-4 text-center">
                <span className="font-display text-sm leading-snug text-parchment-50/80">
                  {book.judul}
                </span>
              </div>
            )}

            {/* hover / focus overlay for changing the cover photo */}
            <button
              type="button"
              onClick={handlePickCover}
              className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-ink-900/0 text-parchment-50 opacity-0 transition-all duration-200 hover:bg-ink-900/60 hover:opacity-100 focus-visible:bg-ink-900/60 focus-visible:opacity-100 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 7.5h2.4l1.2-2h8.8l1.2 2H20a1 1 0 0 1 1 1V18a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8.5a1 1 0 0 1 1-1Z"
                />
                <circle cx="12" cy="13" r="3.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-xs font-medium">
                {displayedCover ? 'Ganti foto sampul' : 'Unggah foto sampul'}
              </span>
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleCoverChange}
            className="hidden"
          />
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