import React from 'react'

export function LoadingGrid({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse overflow-hidden rounded-xl border border-navy-500/10 bg-parchment-100 dark:border-gilt-400/10 dark:bg-ink-800"
        >
          <div className="aspect-[3/4] w-full bg-navy-500/10 dark:bg-gilt-400/10" />
          <div className="space-y-2 p-4">
            <div className="h-3 w-1/3 rounded bg-navy-500/15 dark:bg-gilt-400/15" />
            <div className="h-4 w-4/5 rounded bg-navy-500/15 dark:bg-gilt-400/15" />
            <div className="h-3 w-2/5 rounded bg-navy-500/15 dark:bg-gilt-400/15" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="mx-auto max-w-md rounded-xl border border-navy-500/20 bg-navy-50 p-6 text-center dark:border-gilt-400/20 dark:bg-ink-800">
      <p className="font-display text-lg font-semibold text-navy-600 dark:text-gilt-300">
        Data tidak dapat dimuat
      </p>
      <p className="mt-1.5 text-sm text-ink-800/70 dark:text-parchment-100/70">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 rounded-lg bg-navy-500 px-4 py-2 text-sm font-medium text-parchment-50 hover:bg-navy-600 dark:bg-gilt-400 dark:text-ink-900"
        >
          Coba lagi
        </button>
      )}
    </div>
  )
}

export function EmptyState({ message = 'Tidak ada koleksi yang ditemukan.' }) {
  return (
    <div className="mx-auto max-w-md py-12 text-center">
      <p className="font-display text-lg text-ink-800/70 dark:text-parchment-100/70">{message}</p>
      <p className="mt-1 text-sm text-ink-800/50 dark:text-parchment-100/50">
        Coba ubah kata kunci pencarian atau kategori.
      </p>
    </div>
  )
}
