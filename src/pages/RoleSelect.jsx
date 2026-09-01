import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext.jsx'
import AnimatedLogo from '../components/Mascot/AnimatedLogo.jsx'

function RoleCard({ icon, title, desc, onClick, cta }) {
  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl border border-navy-500/10 bg-navy-50 p-6 text-left shadow-card transition-all hover:-translate-y-1 hover:border-navy-500/25 hover:shadow-book dark:border-obsidian-border dark:bg-obsidian-card dark:shadow-card-dark dark:hover:border-gilt-400/30 sm:p-8"
    >
      <span
        className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-navy-500 via-gilt-400 to-navy-500 dark:from-gilt-500 dark:via-gilt-300 dark:to-gilt-500"
        aria-hidden="true"
      />
      <div className="grid h-12 w-12 place-items-center rounded-full bg-navy-500/10 text-navy-600 dark:bg-gilt-400/10 dark:text-gilt-300">
        {icon}
      </div>
      <h2 className="mt-4 font-display text-xl font-semibold text-ink-900 dark:text-parchment-100">
        {title}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-800/70 dark:text-parchment-100/70">{desc}</p>
      <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-navy-600 group-hover:underline dark:text-gilt-300">
        {cta}
        <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M8 4l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </button>
  )
}

export default function RoleSelect() {
  const navigate = useNavigate()
  const { isNight, toggle } = useTheme()

  return (
    <div className="paper-grain relative flex min-h-screen flex-col items-center justify-center px-4 py-16">
      <button
        onClick={toggle}
        aria-label={isNight ? 'Aktifkan mode siang' : 'Aktifkan mode malam'}
        title={isNight ? 'Mode Siang' : 'Mode Malam'}
        className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-navy-500/20 bg-navy-50 text-navy-600 transition-colors hover:bg-navy-500/10 dark:border-gilt-400/20 dark:bg-obsidian-card dark:text-gilt-300 dark:hover:bg-gilt-400/10 sm:right-6 sm:top-6"
      >
        {isNight ? (
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="4.5" />
            <path
              d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"
              strokeLinecap="round"
            />
          </svg>
        )}
      </button>

      <div className="mb-10 text-center">
        <AnimatedLogo className="mx-auto h-24 w-24 sm:h-28 sm:w-28" />
        <p className="mt-5 font-aksara text-xs uppercase tracking-[0.25em] text-gilt-500 dark:text-gilt-300">
          Balai Layanan Perpustakaan DPAD DIY
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink-900 dark:text-parchment-100 sm:text-4xl">
          Koleksi Ruang Langka
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-ink-800/70 dark:text-parchment-100/70">
          Pilih bagaimana kamu ingin masuk ke situs ini.
        </p>
      </div>

      <div className="grid w-full max-w-3xl grid-cols-1 gap-5 sm:grid-cols-2">
        <RoleCard
          onClick={() => navigate('/dashboard')}
          cta="Masuk sebagai Pengunjung"
          title="User"
          desc="Jelajahi katalog koleksi Ruang Langka. Cari, baca detail, dan pelajari panduan kunjungan."
          icon={
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 6.5c-2-1.5-4.5-2-7-1.5v13c2.5-.5 5 0 7 1.5 2-1.5 4.5-2 7-1.5V5c-2.5-.5-5 0-7 1.5z" />
              <path d="M12 6.5v13" />
            </svg>
          }
        />
        <RoleCard
          onClick={() => navigate('/admin/login')}
          cta="Masuk sebagai Admin"
          title="Admin"
          desc="Kelola data katalog koleksi Ruang Langka"
          icon={
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="8" r="3.2" />
              <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" strokeLinecap="round" />
            </svg>
          }
        />
      </div>
    </div>
  )
}
