import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AdminAuthProvider } from './context/AdminAuthContext.jsx'
import RequireAdmin from './components/RequireAdmin.jsx'
import PublicLayout from './layouts/PublicLayout.jsx'
import RoleSelect from './pages/RoleSelect.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Katalog from './pages/Katalog.jsx'
import BookDetail from './pages/BookDetail.jsx'
import PanduanFasilitas from './pages/panduan/Fasilitas.jsx'
import PanduanKoleksi from './pages/panduan/Koleksi.jsx'
import PanduanLayanan from './pages/panduan/Layanan.jsx'
import AdminLogin from './pages/admin/AdminLogin.jsx'
import AdminPanel from './pages/admin/AdminPanel.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <AdminAuthProvider>
      <Routes>
        {/* Gerbang pilih peran — halaman pertama yang dilihat pengunjung */}
        <Route path="/" element={<RoleSelect />} />

        {/* Sisi publik (Navbar + Footer) */}
        <Route element={<PublicLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/katalog" element={<Katalog />} />
          <Route path="/buku/:id" element={<BookDetail />} />
          <Route path="/panduan/fasilitas" element={<PanduanFasilitas />} />
          <Route path="/panduan/koleksi" element={<PanduanKoleksi />} />
          <Route path="/panduan/layanan" element={<PanduanLayanan />} />
        </Route>

        {/* Sisi admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminPanel />
            </RequireAdmin>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AdminAuthProvider>
  )
}
