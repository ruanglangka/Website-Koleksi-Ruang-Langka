import React from 'react'
import { Link } from 'react-router-dom'

// Warna badge status berdasarkan isi kolom "Status di Rak" pada spreadsheet.
// Kalau ada istilah status lain yang dipakai di spreadsheet-mu, tinggal
// tambahkan entrinya di sini (kuncinya tidak case-sensitive).
const STATUS_STYLES = {
  tersedia: {
    label: 'Tersedia',
    className:
      'bg-emerald-500/15 text-emerald-600 dark:bg-emerald-400/15 dark:text-emerald-300',
  },
  restorasi: {
    label: 'Sedang Restorasi',
    className:
      'bg-amber-500/15 text-amber-600 dark:bg-amber-400/15 dark:text-amber-300',
  },
  'sedang restorasi': {
    label: 'Sedang Restorasi',
    className:
      'bg-amber-500/15 text-amber-600 dark:bg-amber-400/15 dark:text-amber-300',
  },
}

function StatusBadge({ kondisi }) {
  if (!kondisi) return null
  const style = STATUS_STYLES[String(kondisi).trim().toLowerCase()] || {
    label: kondisi,
    className:
      'bg-ink-800/10 text-ink-800/70 dark:bg-parchment-100/10 dark:text-parchment-100/70',
  }
  return (
    <span
      className={`inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${style.className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {style.label}
    </span>
  )
}

export default function BookCard({ book, isHorizontal = false }) {
  return (
    <Link
      to={`/buku/${book.id}`}
      className={`group flex overflow-hidden rounded-xl border border-navy-500/10 bg-navy-50 shadow-card transition-all hover:-translate-y-1 hover:border-navy-500/25 hover:shadow-book dark:border-obsidian-border dark:bg-obsidian-card dark:shadow-card-dark dark:hover:border-gilt-400/30 ${
        isHorizontal ? 'flex-row items-center gap-4 p-3' : 'flex-col gap-1 p-4'
      }`}
    >
      <div className="flex w-full flex-wrap items-center gap-1.5">
        <span className="inline-block w-fit rounded-full bg-gilt-400/15 px-2 py-0.5 text-[11px] font-medium text-gilt-500 dark:text-gilt-300">
          {book.lokasiRak}
        </span>
        <StatusBadge kondisi={book.kondisi} />
      </div>
      <h3 className="mt-1 truncate font-display text-base font-semibold text-ink-900 group-hover:text-navy-600 dark:text-parchment-100 dark:group-hover:text-gilt-300">
        {book.judul}
      </h3>
      <p className="truncate text-sm text-ink-800/60 dark:text-parchment-100/60">
        Aksara {book.aksara}
      </p>
      <p className="text-xs text-ink-800/50 dark:text-parchment-100/50">
        No. Induk {book.nomorInduk}
      </p>
    </Link>
  )
}