import React, { useState } from 'react'

const RANKING = [
  {
    rank: 1,
    kategori: 'Manuskrip',
    warna: 'from-navy-500 to-navy-700',
    keterangan: 'Naskah tulisan tangan tertua dalam koleksi, ditulis di atas lontar dan dluwang.',
  },
  {
    rank: 2,
    kategori: 'Novel',
    warna: 'from-navy-400 to-navy-600',
    keterangan: 'Karya sastra cetak lawas yang menjadi saksi perkembangan bahasa dan budaya baca.',
  },
  {
    rank: 3,
    kategori: 'Aksara',
    warna: 'from-gilt-500 to-gilt-400',
    keterangan: 'Koleksi bertuliskan aksara Jawa, Pegon, dan aksara daerah lain yang langka.',
  },
]

function BookSpine({ item, isOpen, onToggle }) {
  return (
    <button
      onClick={onToggle}
      aria-pressed={isOpen}
      className={`book-spine ${isOpen ? 'is-open' : ''} group relative w-full max-w-[190px] rounded-r-md rounded-l-sm bg-gradient-to-b ${item.warna} p-5 text-left shadow-book focus-visible:outline-gilt-400`}
      style={{ aspectRatio: '3 / 4' }}
    >
      <span className="absolute left-0 top-0 h-full w-2 rounded-l-sm bg-black/20" />
      <span className="font-display text-4xl font-bold text-parchment-50/90">
        {item.rank}
      </span>
      <span className="mt-3 block font-display text-xl font-semibold text-parchment-50">
        {item.kategori}
      </span>
      <span className="mt-2 block text-xs uppercase tracking-wide text-parchment-50/70">
        {isOpen ? 'Tutup detail' : 'Ketuk untuk membuka'}
      </span>

      {isOpen && (
        <span className="mt-3 block text-sm leading-relaxed text-parchment-50/90">
          {item.keterangan}
        </span>
      )}
    </button>
  )
}

export default function BookRanking() {
  const [openRank, setOpenRank] = useState(null)

  return (
    <div className="grid grid-cols-1 items-end gap-6 sm:grid-cols-3 sm:gap-4">
      {RANKING.map((item) => (
        <div
          key={item.rank}
          className={item.rank === 1 ? 'sm:-translate-y-4' : item.rank === 2 ? 'sm:translate-y-0' : 'sm:translate-y-2'}
        >
          <BookSpine
            item={item}
            isOpen={openRank === item.rank}
            onToggle={() => setOpenRank((cur) => (cur === item.rank ? null : item.rank))}
          />
        </div>
      ))}
    </div>
  )
}
