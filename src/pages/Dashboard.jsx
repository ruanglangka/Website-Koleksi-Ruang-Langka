import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import BookRanking from '../components/BookRanking.jsx'
import FeaturedBookCard from '../components/FeaturedBookCard.jsx'
import AnimatedLogo from '../components/Mascot/Animated.jsx'; 
import AnimatedPoint from '../components/Mascot/AnimatedPoint.jsx'; 

function resolveSrc(path) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`
}

const PANDUAN_CARDS = [
  {
    to: '/panduan/fasilitas',
    title: 'Fasilitas Ruang Langka',
    desc: 'Ketahui ruang langka, syarat layanan baca, dan fasilitas pendukung lainnya',
  },
  {
    to: '/panduan/koleksi',
    title: 'Koleksi Buku Langka',
    desc: 'Pelajari ciri, klasifikasi, dan contoh koleksi naskah kuno.',
  },
  {
    to: '/panduan/perawatan',
    title: 'Perawatan Koleksi ',
    desc: 'Kenali jenis, prosedur perawatan, dan alat yang dipakai untuk menjaga kelestarian koleksi',
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
    description: 'Kucing Setiwelan merupakan dongeng adaptasi dari karya sastra "Puss in Boot" dengan versi bahasa jawa dan aksara jawa. Arti dari kata setiwelan ini adalah sepatu atau "steviuel" dalam bahasa belanda. Jadi untuk judul buku inimerupakan alih bahasa dari versi aslinya kedalam bahasa jawa. Buku ini, layaknya buku dongeng untuk anak-anak, yang dihiasi dengan ilustrasi yang mempesona dan penuh imajinasi. Tak hanya itu, setiap halamannya juga diperkaya dengan hiasan-hiasan yang indah. Yang menarik, untuk versi Jawa ini, ilustrasi yang digunakan mengusung nuansa Arab-Islam. Hal tersebut terlihat pada ornamen gambar yang menghiasi buku tersebut. Dalam versi Jawa, kucing itu disebut "Si Mulus", sementara tuannya yang asli bernama "Usman" lebih dikenal dengan julukan "Wuragil" atau "Si anak bungsu".',
  },
  {
    id: '2',
    title: 'Moesoeh dalam Selimoet',
    author: 'Agatha Christie',
    translator: 'A.H. Wignjadisastra',
    publication: 'Weltevreden : Balai Poestaka, 1929',
    language: 'Indonesia',
    coverUrl: 'assets/moesoeh_dalam_selimoet.png',
    description: 'Ketika kapal Lusitania ditorpedo, seorang pria misterius menitipkan dokumen rahasia yang sangat penting bagi keselamatan Inggris kepada Jane Finn. Sayangnya, tak lama setelah itu Jane menghilang tanpa jejak. Lima tahun berlalu, perang telah usai, namun krisis baru justru muncul. Dokumen krusial tersebut kini menjadi incaran "Tuan Brown", dalang licik dari sebuah organisasi besar yang berniat memicu revolusi kaum ekstrem, pemogokan buruh, dan teror pemerintahan. Dalam situasi genting ini, dua petualang muda, Tommy dan Tuppence Beresford, tanpa sengaja terseret ke dalam pusaran intrik perburuan dokumen tersebut. Mereka harus berpacu dengan waktu untuk menemukan Jane Finn, mengamankan dokumennya, dan mengungkap kedok "Tuan Brown" yang selama ini memanipulasi keadaan dari balik layar.',
    subject: 'Novel Fiksi Indonesia',
  },
  {
    id: '3',
    title: 'Suluk Plencung',
    publication: 'Yogyakarta : Yopdyog, 2003',
    subject: 'Kesusastraan Jawa-- Tembang',
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
                Jelajahi koleksi Ruang Langka Balai Layanan Perpustakaan DPAD DIY mulai dari manuskrip bersejarah hingga literatur berusia lebih dari 50 tahun.
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
              <AnimatedLogo
                onError={() => setLogoFailed(true)}
                className="h-40 w-40 shrink-0 sm:h-56 sm:w-56 lg:h-72 lg:w-72 lg:mr-16"
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
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 border-t border-navy-500/10 dark:border-gilt-400/10">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-xl font-semibold text-ink-900 dark:text-parchment-100">
            Koleksi Pilihan
          </h2>
          <Link 
            to="/katalog" 
            className="inline-flex items-center gap-1 text-sm font-medium text-navy-600 hover:underline dark:text-gilt-300"
          >
            Lihat semua
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
              <path d="M5 12h14"/>
              <path d="m12 5 7 7-7 7"/>
            </svg>
          </Link>
        </div>

        <div className="flex flex-col gap-4">
          {featured.map((book) => (
            <FeaturedBookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

     {/* Kartu panduan */}
      <section className="border-t border-navy-500/10 py-14 dark:border-gilt-400/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header section */}
          <div className="mb-10 max-w-2xl">
            <span className="mb-2 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-gilt-500 dark:text-gilt-400">
              Panduan Eksplorasi
            </span>
            <h2 className="font-display text-2xl font-semibold text-ink-900 sm:text-3xl dark:text-parchment-100">
              Mulai Jelajahi Koleksi
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-800/70 dark:text-parchment-100/70">
              Maksimalkan kunjungan Anda. Ketahui fasilitas yang tersedia dan patuhi tata tertib untuk menjaga kelestarian koleksi berharga di sini.
            </p>
          </div>
          <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-end">
            {/* Maskot penyu menunjuk */}
            <div className="shrink-0">
              <AnimatedPoint className="h-32 w-32 sm:h-40 sm:w-40 lg:h-48 lg:w-48" />
            </div>

            <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {PANDUAN_CARDS.map((card) => (
                <Link
                  key={card.to}
                  to={card.to}
                  className="group relative overflow-hidden rounded-xl border border-navy-500/10 bg-navy-50 p-6 shadow-card transition-all hover:-translate-y-1 hover:border-navy-500/25 hover:shadow-book dark:border-obsidian-border dark:bg-obsidian-card dark:shadow-card-dark dark:hover:border-gilt-400/30"
                >
                  <span
                    className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-navy-500 via-gilt-400 to-navy-500 dark:from-gilt-500 dark:via-gilt-300 dark:to-gilt-500"
                    aria-hidden="true"
                  />
                  <h3 className="font-display text-lg font-semibold text-navy-600 group-hover:underline dark:text-gilt-300">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm text-ink-800/70 dark:text-parchment-100/70">{card.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}