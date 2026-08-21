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
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-16 sm:pb-24 lg:pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Grid Container 2 Kolom */}
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-8 lg:gap-16">

            {/* ===== KOLOM KIRI: TEKS & TOMBOL ===== */}
            <div className="flex flex-col items-start text-left">
              <h1 className="font-display text-4xl font-bold leading-tight text-ink-900 dark:text-parchment-50 sm:text-5xl lg:text-6xl lg:leading-[1.1]">
                Menjaga Naskah, <br /> Menghidupkan Sejarah
              </h1>

              <p className="mt-6 max-w-xl text-lg text-ink-800/80 dark:text-parchment-100/70">
                Jelajahi 13.253 koleksi Ruang Langka Balai Layanan Perpustakaan Pemda DIY mulai dari manuskrip bersejarah hingga literatur berusia lebih dari 50 tahun.
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
            </div>

            {/* ===== KOLOM KANAN: GAMBAR ===== */}
            <div className="relative mx-auto w-full max-w-md md:max-w-none">
              {/* Dekorasi latar belakang */}
              <div className="absolute -inset-2 rounded-2xl bg-gradient-to-tr from-gilt-200/50 to-navy-200/50 blur-lg dark:from-gilt-900/30 dark:to-navy-900/30"></div>

              {/* Kontainer Gambar Asli */}
              <div className="relative aspect-[4/3] w-4/5 mx-auto overflow-hidden rounded-2xl shadow-xl ring-1 ring-ink-900/10 dark:ring-white/10">
                <img
                  src="assets/perpus.png"
                  alt="Perpustakaan Grhatama"
                  className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-105"
                />
              </div>
            </div>
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