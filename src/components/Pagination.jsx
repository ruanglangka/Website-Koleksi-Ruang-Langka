import React from 'react'

function getPageList(current, total) {
  const delta = 1
  const range = []
  const rangeWithDots = []
  let last = null

  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
      range.push(i)
    }
  }

  for (const i of range) {
    if (last !== null) {
      if (i - last === 2) {
        rangeWithDots.push(last + 1)
      } else if (i - last > 2) {
        rangeWithDots.push('...')
      }
    }
    rangeWithDots.push(i)
    last = i
  }
  return rangeWithDots
}

export default function Pagination({ page, totalPages, onChange, total, limit }) {
  if (totalPages <= 1) return null
  const pages = getPageList(page, totalPages)

  const btnBase =
    'grid h-9 min-w-[2.25rem] place-items-center rounded-lg px-2 text-sm font-medium transition-colors'
  const inactive =
    'text-ink-800/70 hover:bg-maroon-500/10 dark:text-parchment-100/70 dark:hover:bg-gilt-400/10'
  const active = 'bg-maroon-500 text-parchment-50 dark:bg-gilt-400 dark:text-ink-900'

  return (
    <nav className="mt-8 flex flex-col items-center gap-3" aria-label="Navigasi halaman">
      {typeof total === 'number' && (
        <p className="text-xs text-ink-800/50 dark:text-parchment-100/50">
          Menampilkan {(page - 1) * limit + 1}–{Math.min(page * limit, total)} dari {total.toLocaleString('id-ID')} koleksi
        </p>
      )}
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        <button
          className={`${btnBase} ${inactive} disabled:opacity-30`}
          disabled={page <= 1}
          onClick={() => onChange(1)}
          aria-label="Halaman pertama"
        >
          «
        </button>
        <button
          className={`${btnBase} ${inactive} disabled:opacity-30`}
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          aria-label="Halaman sebelumnya"
        >
          ‹
        </button>

        {pages.map((p, idx) =>
          p === '...' ? (
            <span key={`dots-${idx}`} className="px-1 text-ink-800/40 dark:text-parchment-100/40">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onChange(p)}
              aria-current={p === page ? 'page' : undefined}
              className={`${btnBase} ${p === page ? active : inactive}`}
            >
              {p}
            </button>
          )
        )}

        <button
          className={`${btnBase} ${inactive} disabled:opacity-30`}
          disabled={page >= totalPages}
          onClick={() => onChange(page + 1)}
          aria-label="Halaman berikutnya"
        >
          ›
        </button>
        <button
          className={`${btnBase} ${inactive} disabled:opacity-30`}
          disabled={page >= totalPages}
          onClick={() => onChange(totalPages)}
          aria-label="Halaman terakhir"
        >
          »
        </button>
      </div>
    </nav>
  )
}
