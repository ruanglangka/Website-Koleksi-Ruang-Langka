import React, { createContext, useContext, useEffect, useState } from 'react'

const AdminAuthContext = createContext(null)

const STORAGE_KEY = 'rl_admin_session'
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
// Coba perpanjang token diam-diam sekian menit SEBELUM benar-benar kedaluwarsa,
// supaya ada jeda aman sebelum Apps Script mulai menolaknya.
const REFRESH_BEFORE_EXPIRY_MS = 2 * 60 * 1000

// Dekode payload JWT (tanpa verifikasi tanda tangan) — HANYA dipakai untuk
// menampilkan nama/email/foto di UI dan melacak kedaluwarsa di sisi klien.
// Keputusan otorisasi yang sesungguhnya SELALU diverifikasi ulang di server
// (Apps Script) setiap kali admin melakukan aksi tulis (tambah/ubah/hapus),
// jadi token palsu tidak akan pernah bisa mengubah data — lihat requireAdmin()
// di apps-script/Code.gs.
function decodeJwt(token) {
  try {
    const payload = token.split('.')[1]
    const json = decodeURIComponent(
      atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
        .split('')
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('')
    )
    return JSON.parse(json)
  } catch {
    return null
  }
}

function loadSession() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    if (!parsed.exp || parsed.exp * 1000 < Date.now()) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }
    return parsed
  } catch {
    return null
  }
}

/**
 * Mencoba memperpanjang sesi TANPA menampilkan popup — memanfaatkan fitur
 * "One Tap" Google: kalau browser masih ingat sesi Google admin (dan sudah
 * pernah setuju sebelumnya), token baru akan diberikan otomatis. Kalau
 * tidak (mis. admin sudah logout total dari akun Google-nya di browser
 * itu), onFail() dipanggil dan admin baru diminta login manual lagi.
 */
function trySilentRefresh(onSuccess, onFail) {
  if (!CLIENT_ID || !window.google?.accounts?.id) {
    onFail()
    return
  }
  try {
    window.google.accounts.id.initialize({
      client_id: CLIENT_ID,
      auto_select: true,
      callback: (response) => {
        if (response?.credential) onSuccess(response.credential)
        else onFail()
      },
    })
    window.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed?.() || notification.isSkippedMoment?.()) {
        onFail()
      }
    })
  } catch {
    onFail()
  }
}

export function AdminAuthProvider({ children }) {
  const [session, setSession] = useState(loadSession)

  // Login token Google (ID token dari tombol Sign in, atau dari refresh diam-diam)
  function login(idToken, claims) {
    const data = {
      idToken,
      email: claims.email,
      name: claims.name,
      picture: claims.picture,
      exp: claims.exp,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    setSession(data)
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY)
    setSession(null)
  }

  // Jadwalkan perpanjangan diam-diam beberapa menit sebelum token kedaluwarsa.
  // Kalau berhasil, login() dipanggil lagi dengan token baru — yang otomatis
  // menjadwalkan ulang refresh berikutnya (efek ini jalan lagi karena `session`
  // berubah) — jadi selama admin masih login Google di browser itu, sesi bisa
  // terus diperpanjang tanpa batas tanpa perlu klik apa pun.
  useEffect(() => {
    if (!session) return undefined

    const msUntilExpiry = session.exp * 1000 - Date.now()
    if (msUntilExpiry <= 0) {
      logout()
      return undefined
    }

    const msUntilRefresh = Math.max(msUntilExpiry - REFRESH_BEFORE_EXPIRY_MS, 1000)
    const timer = setTimeout(() => {
      trySilentRefresh(
        (newIdToken) => {
          const claims = decodeJwt(newIdToken)
          if (claims) {
            login(newIdToken, claims)
          } else {
            logout()
          }
        },
        () => logout()
      )
    }, msUntilRefresh)

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  return (
    <AdminAuthContext.Provider value={{ session, isAuthenticated: !!session, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider')
  return ctx
}

export { decodeJwt }