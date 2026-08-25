import React from 'react'

export default function FeaturedBookCard({ book }) {
  return (
    // Mengganti <Link> menjadi <div> dan menghapus atribut "to=..."
    <div className="group flex gap-4 rounded-xl border border-navy-500/12 bg-parchment-50 p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-book dark:border-gilt-400/10 dark:bg-ink-800 sm:gap-6 sm:p-5">
      
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
        
        <p className="mt-0.5 text-sm text-ink-800/60 dark:text-parchment-100/60">
          {book.publication} • Bahasa {book.language}
        </p>
        
        {book.description && (
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-800/70 dark:text-parchment-100/70">
            {book.description}
          </p>
        )}
      </div>
    </div>
  )
}