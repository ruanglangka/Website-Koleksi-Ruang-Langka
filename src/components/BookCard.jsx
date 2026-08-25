import React from 'react'
import { Link } from 'react-router-dom'

export default function BookCard({ book, isHorizontal = false }) {
  return (
    <Link
      to={`/buku/${book.id}`}
      // Perhatikan baris di bawah ini: bg-parchment-50 diubah jadi bg-card
      className={`group flex overflow-hidden rounded-xl border border-navy-500/10 bg-card shadow-card transition-all hover:-translate-y-1 hover:border-navy-500/25 hover:shadow-book dark:border-obsidian-border dark:bg-card-dark dark:shadow-card-dark dark:hover:border-gilt-400/30 ${
        isHorizontal ? 'flex-row items-center gap-4 p-3' : 'flex-col gap-1 p-4'
      }`}
    >
      <span className="inline-block w-fit rounded-full bg-gilt-400/15 px-2 py-0.5 text-[11px] font-medium text-gilt-500 dark:text-gilt-300">
        {book.kategori}
      </span>
      <h3 className="mt-1 truncate font-display text-base font-semibold text-ink-900 group-hover:text-navy-600 dark:text-parchment-100 dark:group-hover:text-gilt-300">
        {book.judul}
      </h3>
      <p className="truncate text-sm text-ink-800/60 dark:text-parchment-100/60">
        {book.penulis}
      </p>
      <p className="text-xs text-ink-800/50 dark:text-parchment-100/50">
        Tahun {book.tahun} · {book.bahasa}
      </p>
    </Link>
  )
}