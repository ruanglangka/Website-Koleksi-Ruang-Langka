import React from 'react'

export default function FeaturedBookCard({ book }) {
  return (
    <div className="group relative flex gap-4 overflow-hidden rounded-xl border border-navy-500/10 bg-navy-50 p-4 shadow-card transition-all hover:-translate-y-1 hover:border-navy-500/25 hover:shadow-book dark:border-obsidian-border dark:bg-obsidian-card dark:shadow-card-dark dark:hover:border-gilt-400/30 sm:gap-6 sm:p-5">

      {/* Garis gradasi emas di atas, sama seperti kartu panduan */}
      <span
        className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-navy-500 via-gilt-400 to-navy-500 dark:from-gilt-500 dark:via-gilt-300 dark:to-gilt-500"
        aria-hidden="true"
      />

      {/* Cover di kiri */}
      <div className="aspect-[3/4] w-24 shrink-0 overflow-hidden rounded-lg shadow-md sm:w-32">
        {book.coverUrl ? (
          <img
            src={book.coverUrl}
            alt={`Sampul ${book.title}`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full w-full place-items-center bg-gradient-to-br from-navy-500 to-navy-800 p-2 text-center">
            <span className="font-display text-xs italic text-parchment-50/80">
              {book.title}
            </span>
          </div>
        )}
      </div>

      {/* Judul, info penerbitan, deskripsi di kanan */}
      <div className="min-w-0 flex-1">
        <span className="inline-block rounded-full bg-gilt-400/15 px-2 py-0.5 text-[11px] font-medium text-gilt-500 dark:text-gilt-300">
          {book.subject}
        </span>

        <h3 className="mt-1.5 font-display text-base font-semibold leading-snug text-ink-900 group-hover:text-navy-500 dark:text-parchment-100 dark:group-hover:text-gilt-300 sm:text-lg">
          {book.title}
        </h3>

        {book.description && (
          <p className="mt-2 text-sm leading-relaxed text-ink-800/70 dark:text-parchment-100/70">
            {book.description}
          </p>
        )}
      </div>
    </div>
  )
}