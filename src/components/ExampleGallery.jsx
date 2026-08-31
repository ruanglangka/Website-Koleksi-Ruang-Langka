import React from 'react'
import manuskrip1Photo from '../assets/koleksi/manuskrip1.png'
import manuskrip2Photo from '../assets/koleksi/manuskrip2.png'
import inggrisCetakPhoto from '../assets/koleksi/inggrisCetak.png'
import arabPegon1Photo from '../assets/koleksi/arabPegon1.png'
import arabPegon2Photo from '../assets/koleksi/arabPegon2.png'
import belandaCetakPhoto from '../assets/koleksi/belandaCetak.png'
import jawaCetak1Photo from '../assets/koleksi/jawaCetak1.png'
import jawaCetak2Photo from '../assets/koleksi/jawaCetak2.png'
import jawaCetak3Photo from '../assets/koleksi/jawaCetak3.png'
import melayuCetakPhoto from '../assets/koleksi/melayuCetak.png'
import jawaReproduksi1Photo from '../assets/koleksi/jawaReproduksi1.png'
import jawaReproduksi2Photo from '../assets/koleksi/jawaReproduksi2.png'

// Sama seperti FacilityGallery: isi `image` dengan hasil import foto asli
// (mis. import manuskrip1 from '../assets/koleksi/manuskrip-1.jpg') untuk
// mengganti placeholder begitu foto contoh koleksi sudah tersedia.
const EXAMPLES = [
  {
    category: 'Manuskrip',
    desc: 'Naskah tulisan tangan, salah satu bentuk koleksi langka tertua di Ruang Langka.',
    image: manuskrip1Photo,
  },
  {
    category: 'Manuskrip',
    desc: 'Naskah tulisan tangan, salah satu bentuk koleksi langka tertua di Ruang Langka.',
    image: manuskrip2Photo,
  },
  {
    category: 'Inggris Cetak',
    desc: 'Buku cetak berbahasa Inggris dari masa penerbitan lawas.',
    image: inggrisCetakPhoto,
  },
  {
    category: 'Belanda Cetak',
    desc: 'Terbitan berbahasa Belanda, banyak berasal dari masa kolonial.',
    image: belandaCetakPhoto,
  },
  {
    category: 'Jawa Cetak',
    desc: 'Buku cetak beraksara atau berbahasa Jawa dari berbagai era penerbitan.',
    image: jawaCetak1Photo,
  },
  {
    category: 'Jawa Cetak',
    desc: 'Buku cetak beraksara atau berbahasa Jawa dari berbagai era penerbitan.',
    image: jawaCetak2Photo,
  },
  {
    category: 'Jawa Cetak',
    desc: 'Buku cetak beraksara atau berbahasa Jawa dari berbagai era penerbitan.',
    image: jawaCetak3Photo,
  },
  {
    category: 'Melayu Cetak',
    desc: 'Terbitan berbahasa Melayu yang kini sudah sulit ditemukan di pasaran.',
    image: melayuCetakPhoto,
  },
  {
    category: 'Jawa Reproduksi',
    desc: 'Hasil alih media/reproduksi dari naskah atau cetakan Jawa asli.',
    image: jawaReproduksi1Photo,
  },
  {
    category: 'Jawa Reproduksi',
    desc: 'Hasil alih media/reproduksi dari naskah atau cetakan Jawa asli.',
    image: jawaReproduksi2Photo,
  },
  {
    category: 'Arab Pegon',
    desc: 'Naskah berbahasa Jawa/Melayu yang ditulis dengan aksara Arab Pegon.',
    image: arabPegon1Photo,
  },
  {
    category: 'Arab Pegon',
    desc: 'Naskah berbahasa Jawa/Melayu yang ditulis dengan aksara Arab Pegon.',
    image: arabPegon2Photo,
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
      {EXAMPLES.map((ex, idx) => (
        <div
          key={`${ex.category}-${idx}`}
          className="group relative overflow-hidden rounded-xl border border-navy-500/10 bg-navy-50 shadow-card transition-all hover:-translate-y-1 hover:border-navy-500/25 hover:shadow-book dark:border-obsidian-border dark:bg-obsidian-card dark:shadow-card-dark dark:hover:border-gilt-400/30"
        >
          {/* Garis gradasi emas di atas, sama seperti kartu-kartu lain */}
          <span
            className="absolute inset-x-0 top-0 z-10 h-[3px] bg-gradient-to-r from-navy-500 via-gilt-400 to-navy-500 dark:from-gilt-500 dark:via-gilt-300 dark:to-gilt-500"
            aria-hidden="true"
          />

          <div className="relative aspect-[3/4] overflow-hidden">
            {ex.image ? (
              <img
                src={ex.image}
                alt={ex.category}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-paper-texture bg-navy-100 px-3 text-center dark:bg-ink-900">
                <div className="text-navy-500/35 dark:text-gilt-300/35">
                  <BookPlaceholderIcon />
                </div>
                <span className="text-[10px] italic tracking-wide text-ink-800/35 dark:text-parchment-100/35">
                  foto menyusul
                </span>
              </div>
            )}
          </div>

          <div className="p-3">
            <span className="inline-block max-w-full truncate rounded-full bg-gilt-400/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.1em] text-gilt-500 dark:text-gilt-300">
              {ex.category}
            </span>
            <p className="mt-1.5 text-xs leading-relaxed text-ink-800/70 dark:text-parchment-100/70">
              {ex.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}