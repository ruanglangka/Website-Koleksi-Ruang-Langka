import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <p className="font-display text-5xl font-bold text-navy-500/40 dark:text-gilt-400/40">404</p>
      <h1 className="mt-2 font-display text-2xl font-semibold text-ink-900 dark:text-parchment-100">
        Halaman tidak ditemukan
      </h1>
      <p className="mt-2 text-sm text-ink-800/60 dark:text-parchment-100/60">
        Halaman yang kamu cari mungkin sudah dipindahkan atau tidak tersedia.
      </p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-lg bg-navy-500 px-5 py-2.5 text-sm font-semibold text-parchment-50 dark:bg-gilt-400 dark:text-ink-900"
      >
        Kembali ke Beranda
      </Link>
    </div>
  )
}
