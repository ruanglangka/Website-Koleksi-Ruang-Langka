import React, { useEffect, useRef } from 'react'

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

/**
 * Tombol "Sign in with Google" resmi (Google Identity Services).
 * Script-nya dimuat lewat <script> di index.html.
 * `onCredential(idToken)` dipanggil begitu pengguna berhasil memilih akun.
 */
export default function GoogleSignInButton({ onCredential }) {
  const btnRef = useRef(null)

  useEffect(() => {
    if (!CLIENT_ID) return undefined
    let cancelled = false

    function init() {
      if (cancelled) return
      if (!window.google?.accounts?.id) {
        // Script GSI dimuat async, coba lagi sebentar lagi kalau belum siap.
        setTimeout(init, 150)
        return
      }
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: (response) => onCredential(response.credential),
      })
      if (btnRef.current) {
        window.google.accounts.id.renderButton(btnRef.current, {
          theme: 'outline',
          size: 'large',
          shape: 'pill',
          text: 'signin_with',
          width: 280,
        })
      }
    }

    init()
    return () => {
      cancelled = true
    }
  }, [onCredential])

  if (!CLIENT_ID) {
    return (
      <p className="rounded-lg border border-gilt-400/30 bg-gilt-400/10 px-4 py-3 text-center text-sm text-gilt-600 dark:text-gilt-300">
        <strong>VITE_GOOGLE_CLIENT_ID</strong> belum diatur di file <code>.env</code>. Lihat README
        bagian "Setup Admin (Google Login)".
      </p>
    )
  }

  return <div ref={btnRef} className="flex justify-center" />
}
