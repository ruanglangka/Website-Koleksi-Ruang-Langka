import React, { useState } from 'react'

const RANKING = [
  {
    rank: 1,
    title: 'Dongeng Koetjing Setiwelan',
    subject: 'Dongeng',
    language: 'Jawa',
    coverUrl: 'assets/dongeng_koetjing_setiwelan.png', 
    description: 'Buku adaptasi dongeng "Puss in Boots" ke dalam bahasa dan aksara Jawa yang diperkaya dengan ilustrasi bernuansa Arab-Islam.',
  },
  {
    rank: 2,
    title: 'Moesoeh dalam Selimoet',
    author: 'Agatha Christie',
    language: 'Indonesia',
    coverUrl: 'assets/moesoeh_dalam_selimoet.png',
    description: 'Buku terjemahan novel "The Secret Adversary" (1922) yang diterbitkan dalam jilid I dan II.',
    subject: 'Novel Fiksi Indonesia',
  },
  {
    rank: 3,
    title: 'Suluk Plencung',
    publication: 'Yogyakarta : Yopdyog, 2003',
    subject: 'Kesusastraan Jawa-- Tembang',
    coverUrl: 'assets/suluk_plencung.png',
    description: 'Teks terdiri dari Dasanama, Yudaganara, Ajisaka, Piwulang, Sastra Gendhing, Nitisastra, Ngelmu, Dongeng, Ki Kewala, Wulangreh, Seh Tekawerdi, Sayid Dullah, Resi Ciptadriya, dan Suluk Pamungkas.',
    language: 'Jawa',
    workType: 'Puisi',
  },
]

const PODIUM = {
  1: { order: 'sm:order-2', height: 'h-72 sm:h-80', width: 'w-40 sm:w-52' },
  2: { order: 'sm:order-1', height: 'h-56 sm:h-64', width: 'w-36 sm:w-44' },
  3: { order: 'sm:order-3', height: 'h-56 sm:h-64', width: 'w-36 sm:w-44' },
}

function resolveSrc(path) {
  if (!path) return null
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`
}

function CoverPlaceholder({ title }) {
  return (
    <div className="grid h-full w-full place-items-center bg-gradient-to-br from-navy-500 to-navy-800 p-3 text-center">
      <span className="font-display text-xs italic leading-snug text-parchment-50/80 sm:text-sm">
        {title}
      </span>
    </div>
  )
}

function PodiumCard({ item, isOpen, onToggle, index }) {
  const [failed, setFailed] = useState(false)
  
  const showPhoto = Boolean(item.coverUrl) && !failed
  const p = PODIUM[item.rank]

  return (
    <div className={`podium-card flex flex-col items-center ${p.order}`} style={{ animationDelay: `${index * 110}ms` }}>
      <div className="book-perspective">
        <button
          type="button"
          onClick={onToggle}
          aria-pressed={isOpen}
          aria-label={`${item.title}, peringkat ${item.rank}. ${isOpen ? 'Tutup' : 'Buka'} detail.`}
          className={`book-tilt group relative ${p.width} ${p.height} overflow-hidden rounded-r-2xl rounded-l-md shadow-xl ring-1 ring-black/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gilt-400 ${
            isOpen ? 'is-open ring-2 ring-gilt-400/70' : ''
          }`}
        >
          {showPhoto ? (
            <img
              src={resolveSrc(item.coverUrl)} 
              alt={`Sampul ${item.title}`} 
              className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              onError={() => setFailed(true)}
            />
          ) : (
            <CoverPlaceholder title={item.title} /> 
          )}

          <span className="book-spine-shadow" aria-hidden="true" />
          <span className="book-page-edge" aria-hidden="true" />

          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ink-900/90 via-ink-900/40 to-transparent" />

          <span className="absolute left-3 top-3 grid h-8 w-8 place-items-center rounded-full border border-gilt-400 bg-ink-900/70 font-display text-sm italic text-gilt-300 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
            {item.rank}
          </span>

          <div className="absolute inset-x-0 bottom-0 p-4 text-left">
            <span className="text-[10px] uppercase tracking-wide text-gilt-300/80">{item.subject}</span>
            <h3 className="mt-0.5 font-display text-base font-semibold leading-snug text-white sm:text-lg">
              {item.title} 
            </h3>
            <p className="mt-0.5 text-xs text-white/70 line-clamp-1">{item.author}</p> 
          </div>
        </button>
      </div>

      <div
        className={`grid w-full transition-[grid-template-rows] duration-300 ease-out ${
          isOpen ? 'mt-2 grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <p className="rounded-lg border border-navy-500/15 bg-parchment-100/70 px-3 py-2 text-xs leading-relaxed text-ink-800/75 dark:border-gilt-400/15 dark:bg-ink-800/60 dark:text-parchment-100/75">
            {item.description} 
          </p>
        </div>
      </div>

      <p className="mt-2 text-[10px] uppercase tracking-wide text-ink-800/35 dark:text-parchment-100/35">
        Bahasa {item.language} 
      </p>
    </div>
  )
}

export default function BookRanking() {
  const [openRank, setOpenRank] = useState(null)

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gilt-500 dark:text-gilt-300">
          Peringkat Koleksi
        </p>
        <h2 className="mt-1.5 font-display text-2xl font-semibold text-ink-900 dark:text-parchment-100">
          Koleksi Terpopuler
        </h2>
        <p className="mt-1.5 text-sm text-ink-800/60 dark:text-parchment-100/60">
          Tiga koleksi dengan peminjaman terbanyak bulan ini. Ketuk kartu untuk melihat keterangan singkat.
        </p>
      </div>

      <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-end sm:justify-center sm:gap-6">
        {RANKING.map((item, i) => (
          <PodiumCard
            key={item.rank}
            item={item}
            index={i}
            isOpen={openRank === item.rank}
            onToggle={() => setOpenRank((cur) => (cur === item.rank ? null : item.rank))}
          />
        ))}
      </div>
    </div>
  )
}