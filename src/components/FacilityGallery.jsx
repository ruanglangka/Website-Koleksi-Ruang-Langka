import React from 'react'
import acPhoto from '../../public/assets/fasilitas/AC.jpeg'
import wifiPhoto from '../../public/assets/fasilitas/wifi.jpg'
import mejaBacaPhoto from '../../public/assets/fasilitas/mejaBaca.jpeg'
import lesehanPhoto from '../../public/assets/fasilitas/lesehan.jpeg'
import mejaLipatPhoto from '../../public/assets/fasilitas/mejaLipat.jpeg'

// Tiap fasilitas: nomor plat (gaya katalog arsip), nama, deskripsi singkat,
// ikon garis, dan `image` (opsional). Kalau foto sudah ada, isi `image` dengan
// path-nya (mis. import acPhoto from '../../assets/fasilitas/ac.jpg' lalu
// image: acPhoto) — kartu otomatis menampilkan foto dan berhenti menampilkan
// placeholder "foto menyusul".
const FACILITIES = [
  {
    roman: 'I',
    name: 'Ruang Ber-AC',
    desc: 'Ruang baca bersuhu sejuk dan stabil, nyaman untuk kunjungan berjam-jam.',
    image: acPhoto,
    icon: (
      <>
        <path d="M12 2v20" />
        <path d="M3.5 7l17 10" />
        <path d="M20.5 7l-17 10" />
      </>
    ),
  },
  {
    roman: 'II',
    name: 'Wifi',
    desc: 'Akses internet nirkabel gratis bagi pengunjung yang membutuhkan referensi digital.',
    image: wifiPhoto,
    icon: (
      <>
        <path d="M2.5 8.5a15 15 0 0 1 19 0" />
        <path d="M5.5 12.2a10.5 10.5 0 0 1 13 0" />
        <path d="M8.8 15.9a6 6 0 0 1 6.4 0" />
        <circle cx="12" cy="19" r="1" fill="currentColor" stroke="none" />
      </>
    ),
  },
  {
    roman: 'III',
    name: 'Meja Baca',
    desc: 'Meja individu dengan pencahayaan memadai untuk membaca dan mencatat.',
    image: mejaBacaPhoto,
    icon: (
      <>
        <path d="M12 6.2c-1.6-1.1-4.2-1.6-6.3-1.1v12.4c2.1-.5 4.7 0 6.3 1.1 1.6-1.1 4.2-1.6 6.3-1.1V5.1c-2.1-.5-4.7 0-6.3 1.1z" />
        <path d="M12 6.2v12.4" />
      </>
    ),
  },
  {
    roman: 'IV',
    name: 'Tempat Baca Lesehan',
    desc: 'Area baca lesehan bagi yang ingin membaca lebih santai dan leluasa.',
    image: lesehanPhoto,
    icon: (
      <>
        <rect x="4" y="10" width="16" height="7.5" rx="3" />
        <path d="M4 14.5h16" />
      </>
    ),
  },
  {
    roman: 'V',
    name: 'Meja Lipat',
    desc: 'Meja lipat tambahan yang dapat digunakan sesuai kebutuhan kunjungan.',
    image: mejaLipatPhoto,
    icon: (
      <>
        <path d="M3 9.5h18" />
        <path d="M6.5 9.5v9.5" />
        <path d="M17.5 9.5v9.5" />
        <path d="M3.5 19h17" />
        <path d="M6.5 9.5l2-4.2M17.5 9.5l-2-4.2" />
      </>
    ),
  },
]

function FacilityIcon({ children }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-7 w-7"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  )
}

export default function FacilityGallery() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {FACILITIES.map((f) => (
        <figure
          key={f.roman}
          className="group overflow-hidden rounded-lg border border-navy-500/15 bg-parchment-50 shadow-sm transition-shadow hover:shadow-book dark:border-gilt-400/15 dark:bg-ink-800"
        >
          <div className="relative aspect-[4/3] overflow-hidden border-b border-navy-500/12 dark:border-gilt-400/12">
            {f.image ? (
              <img src={f.image} alt={f.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-paper-texture bg-navy-50 dark:bg-ink-900">
                <div className="text-navy-500/35 dark:text-gilt-300/35">
                  <FacilityIcon>{f.icon}</FacilityIcon>
                </div>
                <span className="text-[10px] italic tracking-wide text-ink-800/35 dark:text-parchment-100/35">
                  foto menyusul
                </span>
              </div>
            )}
            <span className="absolute left-2 top-2 rounded-full bg-ink-900/70 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.15em] text-parchment-50 backdrop-blur-sm dark:bg-parchment-50/80 dark:text-ink-900">
              Plat {f.roman}
            </span>
          </div>
          <figcaption className="p-3.5">
            <p className="font-display text-sm font-semibold text-ink-900 dark:text-parchment-100">
              {f.name}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-ink-800/65 dark:text-parchment-100/65">
              {f.desc}
            </p>
          </figcaption>
        </figure>
      ))}
    </div>
  )
}
