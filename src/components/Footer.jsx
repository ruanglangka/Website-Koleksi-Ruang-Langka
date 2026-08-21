import React from 'react'

const SOCIALS = [
  {
    label: 'Instagram',
    href: 'https://instagram.com/dispusarda_diy',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'Twitter / X',
    href: 'https://twitter.com/dispusarda_diy',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M18.9 3H21l-6.6 7.55L22 21h-5.9l-4.6-6.02L5.6 21H3.5l7.05-8.06L2 3h6l4.15 5.49L18.9 3zm-1 16.2h1.16L7.15 4.7H5.9L17.9 19.2z" />
      </svg>
    ),
  },
]

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-maroon-500/15 bg-parchment-100/60 dark:border-gilt-400/10 dark:bg-ink-800/60">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h3 className="font-display text-lg font-semibold text-maroon-600 dark:text-gilt-300">
            Koleksi Ruang Langka
          </h3>
          <p className="mt-2 text-sm text-ink-800/70 dark:text-parchment-100/70">
            Balai Layanan Perpustakaan Pemda DIY
          </p>
          <div className="mt-4 flex gap-3">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="grid h-9 w-9 place-items-center rounded-full border border-maroon-500/20 text-maroon-600 transition-colors hover:bg-maroon-500 hover:text-parchment-50 dark:border-gilt-400/20 dark:text-gilt-300 dark:hover:bg-gilt-400 dark:hover:text-ink-900"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-ink-800/60 dark:text-parchment-100/60">
            Kontak
          </h4>
          <ul className="mt-3 space-y-2 text-sm text-ink-800/75 dark:text-parchment-100/75">
            <li>Telepon: (0274) 4342220</li>
            <li>Grahatama Pustaka: Jl. Janti, Karangjambe, Banguntapan, Bantul, DIY</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-ink-800/60 dark:text-parchment-100/60">
            Layanan Terkait
          </h4>
          <ul className="mt-3 space-y-2 text-sm text-ink-800/75 dark:text-parchment-100/75">
            <li>Ruang Baca Masyarakat (RBM)</li>
            <li>Jogja Library for The Blind (JLC)</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-maroon-500/10 py-4 text-center text-xs text-ink-800/50 dark:border-gilt-400/10 dark:text-parchment-100/50">
        © {new Date().getFullYear()} Balai Layanan Perpustakaan Pemda DIY — Koleksi Ruang Langka
      </div>
    </footer>
  )
}
