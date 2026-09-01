import React, { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext.jsx'
import dayLogo from '../assets/icons/day.png'
import nightLogo from '../assets/icons/night.png'

const PANDUAN_LINKS = [
  { to: '/panduan/fasilitas', label: 'Fasilitas Ruang Langka' },
  { to: '/panduan/koleksi', label: 'Koleksi Buku Langka' },
  { to: '/panduan/perawatan', label: 'Perawatan Koleksi Langka' },
  { to: '/panduan/layanan', label: 'Layanan & Tata Tertib' },
]

export default function Navbar() {
  const { isNight, toggle } = useTheme()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function onClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const linkClass = ({ isActive }) =>
    `px-3 py-2 text-sm font-medium tracking-wide transition-colors ${
      isActive
        ? 'text-gilt-500 dark:text-gilt-300'
        : 'text-ink-800/80 hover:text-navy-500 dark:text-parchment-100/80 dark:hover:text-gilt-300'
    }`

  const iconButtonClass =
    'grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-full border border-navy-500/20 bg-parchment-100 text-navy-600 transition-colors hover:bg-navy-500/10 dark:border-gilt-400/20 dark:bg-ink-800 dark:text-gilt-300 dark:hover:bg-gilt-400/10'

  return (
    <header className="sticky top-0 z-40 border-b border-heritage-100 dark:border-obsidian-border bg-white/90 dark:bg-black/90 backdrop-blur">
      {/* Padding disesuaikan untuk layar kecil (px-4 py-3) dan layar besar (sm:px-6 sm:py-5) */}
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-5 lg:px-8">
        
        {/* ===== KIRI: LOGO & JUDUL ===== */}
        {/* Gap diperkecil di mobile (gap-2), kembali normal di layar besar (sm:gap-4) */}
        <Link to="/dashboard" className="flex items-center gap-2 sm:gap-4 shrink-0">
          <span className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-md bg-parchment-50 dark:bg-navy-500/15 overflow-hidden shrink-0">
            <img 
              src={dayLogo} 
              alt="Logo Karsa Siang" 
              className="h-full w-full object-contain block dark:hidden" 
            />
            <img 
              src={nightLogo}
              alt="Logo Karsa Malam" 
              className="h-full w-full object-contain hidden dark:block" 
            />
          </span>
        
        <span className="leading-tight overflow-hidden">
          {/* Ukuran font diperkecil di mobile (text-lg) agar tidak menabrak tombol menu */}
          <span className="block font-display text-lg sm:text-2xl md:text-3xl font-bold text-heritage-800 dark:text-heritage-50 truncate">
            Koleksi Ruang Langka
          </span>
          {/* Subtitle disembunyikan di layar sangat kecil agar rapi, muncul kembali di layar sm (hidden sm:block) */}
          <span className="hidden sm:block text-[9px] uppercase tracking-[0.15em] text-ink-800/60 dark:text-parchment-100/60 sm:text-[10px]">
            Balai Layanan Perpustakaan DPAD DIY
          </span>
        </span>
      </Link>

        {/* ===== KANAN: MENU & TOMBOL ===== */}
        <div className="flex items-center gap-3 lg:gap-8 ml-auto">
          
          {/* Menu Navigasi Desktop */}
          <nav className="hidden items-center gap-8 md:flex">
            <NavLink to="/dashboard" end className={linkClass}>
              Home
            </NavLink>
            <NavLink to="/katalog" className={linkClass}>
              Katalog
            </NavLink>
            
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium tracking-wide text-ink-800/80 transition-colors hover:text-navy-500 dark:text-parchment-100/80 dark:hover:text-gilt-300"
              >
                Panduan
                <svg
                  className={`h-3.5 w-3.5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                  viewBox="0 0 12 8"
                  fill="none"
                >
                  <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
              
              {/* Dropdown Menu Desktop */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 overflow-hidden rounded-xl border border-navy-500/15 bg-parchment-50 shadow-book dark:border-gilt-400/15 dark:bg-ink-800">
                  {PANDUAN_LINKS.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-3 text-sm text-ink-800/85 transition-colors hover:bg-navy-500/5 hover:text-navy-600 dark:text-parchment-100/85 dark:hover:bg-gilt-400/10 dark:hover:text-gilt-300"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Garis Pemisah (Divider) Estetik */}
          <span className="hidden h-6 w-px bg-ink-300/30 dark:bg-parchment-100/20 md:block"></span>

          {/* Tombol Sleep Mode, Logout (desktop), & Mobile Burger */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              aria-label={isNight ? 'Aktifkan mode siang' : 'Aktifkan mode malam'}
              title={isNight ? 'Mode Siang' : 'Mode Malam'}
              className={iconButtonClass}
            >
              {isNight ? (
                <svg viewBox="0 0 24 24" className="h-4 w-4 sm:h-5 sm:w-5" fill="currentColor">
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="4.5" />
                  <path d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" strokeLinecap="round" />
                </svg>
              )}
            </button>

            <Link
              to="/"
              aria-label="Keluar"
              title="Keluar"
              className={`hidden md:grid ${iconButtonClass}`}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </Link>

            <button
              className="grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-full text-ink-800 md:hidden dark:text-parchment-100 transition-colors hover:bg-navy-500/10 dark:hover:bg-gilt-400/10"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Buka menu"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
                {mobileOpen ? (
                   <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                ) : (
                   <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ===== MENU MOBILE ===== */}
      <div 
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="border-t border-navy-500/15 bg-parchment-50 px-4 py-3 dark:border-gilt-400/10 dark:bg-ink-900 shadow-inner">
          <div className="flex flex-col">
            <NavLink to="/dashboard" end onClick={() => setMobileOpen(false)} className={linkClass}>
              Home
            </NavLink>
            <NavLink to="/katalog" onClick={() => setMobileOpen(false)} className={linkClass}>
              Katalog
            </NavLink>
            <span className="mt-2 px-3 text-xs font-semibold uppercase tracking-wide text-ink-800/50 dark:text-parchment-100/50">
              Panduan
            </span>
            {PANDUAN_LINKS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 text-sm text-ink-800/80 dark:text-parchment-100/80 hover:text-navy-500 dark:hover:text-gilt-300 transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className="mt-3 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-ink-600 transition-colors hover:bg-navy-500/10 hover:text-ink-900 dark:text-parchment-300 dark:hover:bg-gilt-400/10 dark:hover:text-parchment-100"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Keluar
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}