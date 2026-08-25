import React from 'react'

function ImageIcon() {
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
      <rect x="3.5" y="4.5" width="17" height="15" rx="1.5" />
      <circle cx="9" cy="10" r="1.6" />
      <path d="M4 17l5-5 3 3 3.5-4L20 16" />
    </svg>
  )
}

// Placeholder foto generik untuk halaman panduan. Isi prop `image` (hasil
// import file gambar) untuk menampilkan foto asli begitu tersedia; sebelum
// itu kartu menampilkan ikon + label "foto menyusul".
export default function PhotoPlaceholder({ image, alt = '', label, aspect = 'aspect-[4/3]' }) {
  return (
    <div
      className={`relative overflow-hidden rounded-lg border border-navy-500/15 dark:border-gilt-400/15 ${aspect}`}
    >
      {image ? (
        <img src={image} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-paper-texture bg-navy-50 dark:bg-ink-900">
          <div className="text-navy-500/35 dark:text-gilt-300/35">
            <ImageIcon />
          </div>
          <span className="text-[10px] italic tracking-wide text-ink-800/35 dark:text-parchment-100/35">
            foto menyusul
          </span>
        </div>
      )}
      {label && (
        <span className="absolute left-2 top-2 rounded-full bg-ink-900/70 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.1em] text-parchment-50 backdrop-blur-sm dark:bg-parchment-50/80 dark:text-ink-900">
          {label}
        </span>
      )}
    </div>
  )
}
