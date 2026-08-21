import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import BookRanking from '../components/BookRanking.jsx'
import BookCard from '../components/BookCard.jsx'
import { LoadingGrid, ErrorState } from '../components/StatusStates.jsx'
import { fetchFeatured } from '../api/booksApi.js'

const PANDUAN_CARDS = [
  {
    to: '/panduan/fasilitas',
    title: 'Fasilitas Ruang Langka',
    desc: 'Kenali ruang baca, peralatan digitalisasi, dan fasilitas pendukung lainnya.',
  },
  {
    to: '/panduan/koleksi',
    title: 'Koleksi Buku Langka',
    desc: 'Pelajari ciri, klasifikasi, dan cara perawatan koleksi naskah kuno.',
  },
  {
    to: '/panduan/layanan',
    title: 'Layanan & Tata Tertib',
    desc: 'Aturan penggunaan koleksi dan prosedur peminjaman yang berlaku.',
  },
]

export default function Dashboard() {
  const [featured, setFeatured] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let alive = true
    setStatus('loading')
    fetchFeatured()
      .then((items) => {
        if (!alive) return
        setFeatured(items)
        setStatus('done')
      })
      .catch(() => alive && setStatus('error'))
    return () => {
      alive = false
    }
  }, [])

  return (
    <div>
      {/* HERO */}
      <section className="paper-grain border-b border-navy-500/10 dark:border-gilt-400/10">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <p className="font-aksara text-sm uppercase tracking-[0.25em] text-gilt-500 dark:text-gilt-300">
            Naskah · Manuskrip · Warisan Aksara
          </p>
          <h1 className="mt-3 max-w-2xl font-display text-3xl font-semibold leading-tight text-ink-900 dark:text-parchment-100 sm:text-4xl lg:text-5xl">
            Menjaga dan menghadirkan koleksi langka Yogyakarta dalam satu katalog digital.
          </h1>
          <p className="mt-4 max-w-xl text-ink-800/70 dark:text-parchment-100/70">
            Jelajahi 13.253 koleksi Ruang Langka Balai Layanan Perpustakaan Pemda DIY — dari
            manuskrip beraksara Jawa hingga novel-novel lawas.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/katalog"
              className="rounded-lg bg-navy-500 px-5 py-2.5 text-sm font-semibold text-parchment-50 shadow-book transition-colors hover:bg-navy-600 dark:bg-gilt-400 dark:text-ink-900 dark:hover:bg-gilt-300"
            >
              Jelajahi Katalog
            </Link>
            <Link
              to="/panduan/fasilitas"
              className="rounded-lg border border-navy-500/25 px-5 py-2.5 text-sm font-semibold text-navy-600 transition-colors hover:bg-navy-500/5 dark:border-gilt-400/25 dark:text-gilt-300 dark:hover:bg-gilt-400/10"
            >
              Baca Panduan
            </Link>
          </div>

          {/* Ranking buku */}
          <div className="mt-14">
            <h2 className="mb-6 font-display text-xl font-semibold text-ink-900 dark:text-parchment-100">
              Sorotan Kategori Koleksi
            </h2>
            <BookRanking />
          </div>
        </div>
      </section>

      {/* Koleksi terbaru / unggulan */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-xl font-semibold text-ink-900 dark:text-parchment-100">
            Koleksi Pilihan
          </h2>
          <Link to="/katalog" className="text-sm font-medium text-navy-600 hover:underline dark:text-gilt-300">
            Lihat semua →
          </Link>
        </div>

        {status === 'loading' && <LoadingGrid count={3} />}
        {status === 'error' && (
          <ErrorState message="Tidak dapat mengambil koleksi unggulan dari server." />
        )}
        {status === 'done' && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {featured.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </section>

      {/* Kartu panduan */}
      <section className="bg-parchment-100/50 py-14 dark:bg-ink-800/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-6 font-display text-xl font-semibold text-ink-900 dark:text-parchment-100">
            Sebelum Berkunjung, Baca Panduan
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {PANDUAN_CARDS.map((card) => (
              <Link
                key={card.to}
                to={card.to}
                className="group rounded-xl border border-navy-500/12 bg-parchment-50 p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-book dark:border-gilt-400/10 dark:bg-ink-900"
              >
                <h3 className="font-display text-lg font-semibold text-navy-600 group-hover:underline dark:text-gilt-300">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm text-ink-800/70 dark:text-parchment-100/70">{card.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
