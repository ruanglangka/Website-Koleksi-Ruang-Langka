import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import BookRanking from '../components/BookRanking.jsx'
import FeaturedBookCard from '../components/FeaturedBookCard.jsx'

function resolveSrc(path) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`
}

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

// ==========================================
// DATA KOLEKSI BUKU (Silakan diedit di sini)
// ==========================================
const FEATURED_BOOKS_DATA = [
  {
    id: '1',
    title: 'Dongeng Koetjing Setiwelan',
    publication: 'Weltevreden : Balepustaka, 1922',
    subject: 'Dongeng',
    language: 'Jawa',
    coverUrl: 'assets/dongeng_koetjing_setiwelan.png', 
    description: 'Buku cerita klasik terjemahan lawas dari dongeng "Puss in Boots". Mengisahkan petualangan seekor kucing cerdik bersepatu bot yang membantu majikannya yang miskin meraih kekayaan dan gelar bangsawan.',
  },
  {
    id: '2',
    title: 'Moesoeh dalam Selimoet',
    author: 'Agatha Christie',
    translator: 'A.H. Wignjadisastra',
    publication: 'Weltevreden : Balai Poestaka, 1929',
    language: 'Indonesia',
    coverUrl: 'assets/moesoeh_dalam_selimoet.png',
    description: 'Buku terjemahan novel "The Secret Adversary" (1922) yang diterbitkan dalam jilid I dan II.',
    subject: 'Novel Fiksi Indonesia',
  },
  {
    id: '3',
    title: 'Suluk Plencung',
    publication: 'Yogyakarta : Yopdyog, 2003',
    subject: 'Kesusastraan Jawa, Mantra',
    coverUrl: 'assets/suluk_plencung.png',
    description: 'Teks terdiri dari Dasanama, Yudaganara, Ajisaka, Piwulang, Sastra Gendhing, Nitisastra, Ngelmu, Dongeng, Ki Kewala, Wulangreh, Seh Tekawerdi, Sayid Dullah, Resi Ciptadriya, dan Suluk Pamungkas.',
    language: 'Jawa',
    workType: 'Puisi',
  }
]

export default function Dashboard() {
  const [featured] = useState(FEATURED_BOOKS_DATA) 
  const [logoFailed, setLogoFailed] = useState(false)

  return (
    <div>
      {/* HERO */}
      <section className="paper-grain border-b border-navy-500/10 dark:border-gilt-400/10">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="flex flex-col-reverse items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="font-aksara text-sm uppercase tracking-[0.25em] text-gilt-500 dark:text-gilt-300">
                Katalog Koleksi Langka
              </p>
              <h1 className="mt-3 font-display text-3xl font-semibold leading-tight text-ink-900 dark:text-parchment-100 sm:text-4xl lg:text-5xl">
                Menjaga Naskah, 
              </h1>
              <h1 className="mt-3 font-display text-3xl font-semibold leading-tight text-ink-900 dark:text-parchment-100 sm:text-4xl lg:text-5xl">
                Menghidupkan Sejarah
              </h1>
              <p className="mt-4 max-w-xl text-ink-800/70 dark:text-parchment-100/70">
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

            {!logoFailed && (
              <img
                src={resolveSrc('assets/penyu.png')}
                alt="Logo Ruang Langka"
                onError={() => setLogoFailed(true)}
                className="h-40 w-40 shrink-0 object-contain sm:h-56 sm:w-56 lg:h-72 lg:w-72 lg:mr-16"
              />
            )}
          </div>

          {/* Ranking buku */}
          <div className="mt-14">
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

        <div className="flex flex-col gap-4">
          {featured.map((book) => (
            <FeaturedBookCard key={book.id} book={book} />
          ))}
        </div>
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
                // DARI SINI: bg-parchment-50 diubah ke bg-card dan dark:bg-ink-900 diubah ke dark:bg-card-dark
                className="group rounded-xl border border-navy-500/12 bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-book dark:border-gilt-400/10 dark:bg-card-dark"
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