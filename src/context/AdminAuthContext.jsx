import React, { createContext, useContext, useEffect, useState } from 'react'

const AdminAuthContext = createContext(null)

const STORAGE_KEY = 'rl_admin_session'

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
  const raw = sessionStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    if (!parsed.exp || parsed.exp * 1000 < Date.now()) {
      sessionStorage.removeItem(STORAGE_KEY)
      return null
    }
    return parsed
  } catch {
    return null
  }
}

export function AdminAuthProvider({ children }) {
  const [session, setSession] = useState(loadSession)

  // Login token Google (ID token dari tombol Sign in) — dipanggil setelah
  // server (whoami) mengonfirmasi email-nya ada di daftar admin.
  function login(idToken, claims) {
    const data = {
      idToken,
      email: claims.email,
      name: claims.name,
      picture: claims.picture,
      exp: claims.exp,
    }
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    setSession(data)
  }

  function logout() {
    sessionStorage.removeItem(STORAGE_KEY)
    setSession(null)
  }

  // Auto-logout begitu token kedaluwarsa (token Google ID biasanya valid ~1 jam)
  useEffect(() => {
    if (!session) return undefined
    const ms = session.exp * 1000 - Date.now()
    if (ms <= 0) {
      logout()
      return undefined
    }
    const timer = setTimeout(logout, ms)
    return () => clearTimeout(timer)
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
