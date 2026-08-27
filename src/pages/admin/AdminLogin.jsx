import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import GoogleSignInButton from '../../components/GoogleSignInButton.jsx'
import { useAdminAuth, decodeJwt } from '../../context/AdminAuthContext.jsx'
import { verifyAdmin } from '../../api/adminApi.js'

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
// Mode percobaan HANYA aktif saat menjalankan `npm run dev` (import.meta.env.DEV),
// tidak pernah ikut ke build production/GitHub Pages, dan hanya muncul selama
// Client ID Google belum diisi.
const SHOW_DEV_BYPASS = import.meta.env.DEV && !CLIENT_ID

export default function AdminLogin() {
  const navigate = useNavigate()
  const { login } = useAdminAuth()
  const [status, setStatus] = useState('idle') // idle | verifying | error
  const [errorMsg, setErrorMsg] = useState('')

  async function handleCredential(idToken) {
    setStatus('verifying')
    setErrorMsg('')
    try {
      // Verifikasi ke server: token asli? emailnya ada di daftar admin?
      const result = await verifyAdmin(idToken)
      const claims = decodeJwt(idToken)
      if (!result.authorized || !claims) {
        throw new Error('Akun ini tidak terdaftar sebagai admin.')
      }
      login(idToken, claims)
      navigate('/admin', { replace: true })
    } catch (err) {
      setStatus('error')
      setErrorMsg(err.message || 'Login gagal. Coba lagi.')
    }
  }

  // Sesi PALSU untuk sekadar melihat tampilan /admin. idToken-nya tidak asli,
  // jadi Apps Script akan tetap menolak setiap aksi simpan/hapus data — ini
  // memang disengaja, keamanan tetap berlaku di server.
  function handleDevBypass() {
    const fakeClaims = {
      email: 'admin-percobaan@lokal.dev',
      name: 'Admin (Mode Percobaan)',
      picture: '',
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    }
    login('DEV_FAKE_TOKEN_TIDAK_VALID', fakeClaims)
    navigate('/admin', { replace: true })
  }

  return (
    <div className="paper-grain flex min-h-screen flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-navy-500/10 bg-navy-50 p-8 text-center shadow-card dark:border-obsidian-border dark:bg-obsidian-card dark:shadow-card-dark">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-navy-500/10 text-navy-600 dark:bg-gilt-400/10 dark:text-gilt-300">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="4" y="10" width="16" height="10" rx="2" />
            <path d="M8 10V7a4 4 0 018 0v3" />
          </svg>
        </div>
        <h1 className="mt-4 font-display text-xl font-semibold text-ink-900 dark:text-parchment-100">
          Login Admin
        </h1>
        <p className="mt-2 text-sm text-ink-800/70 dark:text-parchment-100/70">
          Khusus untuk pengelola katalog Ruang Langka. Masuk pakai akun Google yang sudah terdaftar.
        </p>

        <div className="mt-6">
          {status === 'verifying' ? (
            <p className="text-sm text-ink-800/60 dark:text-parchment-100/60">Memverifikasi akun…</p>
          ) : (
            <GoogleSignInButton onCredential={handleCredential} />
          )}
        </div>

        {status === 'error' && (
          <p className="mt-4 rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-600 dark:text-red-300">
            {errorMsg}
          </p>
        )}

        {SHOW_DEV_BYPASS && (
          <div className="mt-6 rounded-lg border border-dashed border-gilt-400/40 bg-gilt-400/5 p-4 text-left">
            <p className="text-xs font-semibold uppercase tracking-wide text-gilt-600 dark:text-gilt-300">
              Mode Percobaan (khusus development)
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-ink-800/70 dark:text-parchment-100/70">
              Client ID Google belum diatur. Tombol ini cuma untuk melihat tampilan panel admin —
              aksi tambah/ubah/hapus tetap akan ditolak server sampai login Google asli disiapkan.
            </p>
            <button
              onClick={handleDevBypass}
              className="mt-3 w-full rounded-lg border border-gilt-400/50 px-4 py-2 text-sm font-semibold text-gilt-600 hover:bg-gilt-400/10 dark:text-gilt-300"
            >
              Lihat Panel Admin (tanpa login sungguhan)
            </button>
          </div>
        )}

        <Link
          to="/"
          className="mt-6 inline-block text-sm text-navy-600 hover:underline dark:text-gilt-300"
        >
          ← Kembali 
        </Link>
      </div>
    </div>
  )
}