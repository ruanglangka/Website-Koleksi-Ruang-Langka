import React from 'react'

const SOCIALS = [
  {
    label: 'Instagram',
    href: 'https://instagram.com/balaiyanpus.dpaddiy',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: 'https://facebook.com/balaiyanpus.dpaddiy',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: 'Youtube',
    href: 'https://youtube.com/@balaiyanpusdpaddiy',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
      </svg>
    ),
  },
  {
    label: 'Tiktok',
    href: 'https://tiktok.com/@balai_yanpus',
    icon: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
    ),
  },
]

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-navy-500/15 bg-navy-50 dark:border-gilt-400/15 dark:bg-ink-800">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 lg:gap-12">
          
          {/* ===== KOLOM 1: IDENTITAS & SOSIAL MEDIA ===== */}
          <div className="md:col-span-1">
            <h3 className="font-display text-2xl font-bold text-navy-700 dark:text-gilt-300">
              Koleksi Ruang Langka
            </h3>
            {/* Warna teks diubah menyerupai teks diagram (ink-900 / parchment-100) */}
            <p className="mt-3 text-sm leading-relaxed text-ink-900/80 dark:text-parchment-100/80">
              Eksplorasi warisan literasi Nusantara. Dikelola resmi oleh Balai Layanan Perpustakaan (Grhatama Pustaka) DPAD DIY.
            </p>
            <div className="mt-6 flex gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="grid h-10 w-10 place-items-center rounded-full border border-navy-500/20 text-navy-600 transition-colors hover:bg-navy-500 hover:text-parchment-50 dark:border-gilt-400/20 dark:text-gilt-300 dark:hover:bg-gilt-400 dark:hover:text-ink-900"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

         {/* ===== KOLOM 2: ALAMAT ===== */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-navy-700 dark:text-gilt-400">
              Lokasi Kami
            </h4>
            <div className="mt-5 flex items-start gap-3 text-sm text-ink-900/90 dark:text-parchment-100/90">
              {/* Ikon Pin Lokasi */}
              <svg className="mt-0.5 h-5 w-5 shrink-0 text-navy-500 dark:text-gilt-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              
              <a 
                href="https://maps.app.goo.gl/PDuzHWvR1i565akP7" 
                target="_blank" 
                rel="noopener noreferrer"
                className="leading-relaxed transition-colors hover:text-navy-600 hover:underline hover:underline-offset-4 dark:hover:text-gilt-300"
              >
                Jl. Janti, Wonocatur, Banguntapan,<br />
                Bantul, Daerah Istimewa Yogyakarta<br />
                55198
              </a>
            </div>
          </div>

          {/* ===== KOLOM 3: KONTAK ===== */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-navy-700 dark:text-gilt-400">
              Hubungi Kami
            </h4>
            <ul className="mt-5 space-y-4 text-sm text-ink-900/90 dark:text-parchment-100/90">
              
              {/* Telepon */}
              <li className="flex items-center gap-3">
                <svg className="h-5 w-5 shrink-0 text-navy-500 dark:text-gilt-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.48-4.08-7.074-6.971l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                <a 
                  href="https://wa.me/628812658192" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-navy-600 hover:underline hover:underline-offset-4 dark:hover:text-gilt-300"
                >
                  (+62) 8812-6581-92
                </a>
              </li>
              
              {/* Email */}
              <li className="flex items-center gap-3">
                <svg className="h-5 w-5 shrink-0 text-navy-500 dark:text-gilt-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                <a 
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=balaiyanpus@jogjaprov.go.id" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-navy-600 hover:underline hover:underline-offset-4 dark:hover:text-gilt-300"
                >
                  balaiyanpus@jogjaprov.go.id
                </a>
              </li>

              {/* Website Baru */}
              <li className="flex items-center gap-3">
                <svg className="h-5 w-5 shrink-0 text-navy-500 dark:text-gilt-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
                <a 
                  href="https://balaiyanpus.jogjaprov.go.id/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-navy-600 hover:underline hover:underline-offset-4 dark:hover:text-gilt-300"
                >
                  balaiyanpus.jogjaprov.go.id
                </a>
              </li>

            </ul>
          </div>

        </div>
      </div>

      {/* ===== COPYRIGHT BAR ===== */}
      <div className="border-t border-navy-500/15 py-6 text-center text-xs text-ink-900/60 dark:border-gilt-400/15 dark:text-parchment-100/60">
        © {new Date().getFullYear()} Balai Layanan Perpustakaan DPAD DIY — Koleksi Ruang Langka
      </div>
    </footer>
  )
}