import React from 'react'
import { NavLink } from 'react-router-dom'

const TABS = [
  { to: '/panduan/fasilitas', label: 'Fasilitas' },
  { to: '/panduan/koleksi', label: 'Koleksi' },
  { to: '/panduan/layanan', label: 'Layanan & Tata Tertib' },
]

export default function PanduanLayout({ eyebrow, title, children }) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <p className="font-aksara text-xs uppercase tracking-[0.25em] text-gilt-500 dark:text-gilt-300">
        {eyebrow}
      </p>
      <h1 className="mt-1 font-display text-2xl font-semibold text-ink-900 dark:text-parchment-100 sm:text-3xl">
        {title}
      </h1>

      <div className="mt-6 flex gap-1 overflow-x-auto border-b border-navy-500/12 dark:border-gilt-400/10">
        {TABS.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            className={({ isActive }) =>
              `whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'border-navy-500 text-navy-600 dark:border-gilt-400 dark:text-gilt-300'
                  : 'border-transparent text-ink-800/60 hover:text-navy-500 dark:text-parchment-100/60 dark:hover:text-gilt-300'
              }`
            }
          >
            {t.label}
          </NavLink>
        ))}
      </div>

      <div className="prose-panduan mt-8 space-y-8">{children}</div>
    </div>
  )
}

export function Section({ title, children }) {
  return (
    <section>
      <h2 className="font-display text-lg font-semibold text-navy-600 dark:text-gilt-300">{title}</h2>
      <div className="mt-2 space-y-3 text-sm leading-relaxed text-ink-800/80 dark:text-parchment-100/80">
        {children}
      </div>
    </section>
  )
}
