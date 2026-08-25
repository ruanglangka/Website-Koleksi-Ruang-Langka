import React from 'react'

// Sama seperti FacilityGallery: isi `image` dengan hasil import foto asli
// (mis. import manuskrip1 from '../assets/koleksi/manuskrip-1.jpg') untuk
// mengganti placeholder begitu foto contoh koleksi sudah tersedia.
const EXAMPLES = [
  {
    category: 'Manuskrip',
    desc: 'Naskah tulisan tangan, salah satu bentuk koleksi langka tertua di Ruang Langka.',
    image: null,
  },
  {
    category: 'Cetakan Inggris',
    desc: 'Buku cetak berbahasa Inggris dari masa penerbitan lawas.',
    image: null,
  },
  {
    category: 'Cetakan Belanda',
    desc: 'Terbitan berbahasa Belanda, banyak berasal dari masa kolonial.',
    image: null,
  },
  {
    category: 'Cetakan Jawa',
    desc: 'Buku cetak beraksara atau berbahasa Jawa dari berbagai era penerbitan.',
    image: null,
  },
  {
    category: 'Cetakan Melayu',
    desc: 'Terbitan berbahasa Melayu yang kini sudah sulit ditemukan di pasaran.',
    image: null,
  },
  {
    category: 'Reproduksi Jawa',
    desc: 'Hasil alih media/reproduksi dari naskah atau cetakan Jawa asli.',
    image: null,
  },
  {
    category: 'Arab Pegon',
    desc: 'Naskah berbahasa Jawa/Melayu yang ditulis dengan aksara Arab Pegon.',
    image: null,
  },
]

function BookPlaceholderIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-7 w-7"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 6.2c-1.6-1.1-4.2-1.6-6.3-1.1v12.4c2.1-.5 4.7 0 6.3 1.1 1.6-1.1 4.2-1.6 6.3-1.1V5.1c-2.1-.5-4.7 0-6.3 1.1z" />
      <path d="M12 6.2v12.4" />
    </svg>
  )
}

export default function ExampleGallery() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {EXAMPLES.map((ex) => (
        <figure
          key={ex.category}
          className="group overflow-hidden rounded-lg border border-navy-500/15 bg-parchment-50 shadow-sm transition-shadow hover:shadow-book dark:border-gilt-400/15 dark:bg-ink-800"
        >
          <div className="relative aspect-[3/4] overflow-hidden border-b border-navy-500/12 dark:border-gilt-400/12">
            {ex.image ? (
              <img src={ex.image} alt={ex.category} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-paper-texture bg-navy-50 px-3 text-center dark:bg-ink-900">
                <div className="text-navy-500/35 dark:text-gilt-300/35">
                  <BookPlaceholderIcon />
                </div>
                <span className="text-[10px] italic tracking-wide text-ink-800/35 dark:text-parchment-100/35">
                  foto menyusul
                </span>
              </div>
            )}
            <span className="absolute left-2 top-2 max-w-[calc(100%-1rem)] truncate rounded-full bg-ink-900/70 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.1em] text-parchment-50 backdrop-blur-sm dark:bg-parchment-50/80 dark:text-ink-900">
              {ex.category}
            </span>
          </div>
          <figcaption className="p-3">
            <p className="text-xs leading-relaxed text-ink-800/70 dark:text-parchment-100/70">
              {ex.desc}
            </p>
          </figcaption>
        </figure>
      ))}
    </div>
  )
}
