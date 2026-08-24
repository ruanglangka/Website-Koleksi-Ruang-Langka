import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Katalog from './pages/Katalog.jsx'
import BookDetail from './pages/BookDetail.jsx'
import PanduanFasilitas from './pages/panduan/Fasilitas.jsx'
import PanduanKoleksi from './pages/panduan/Koleksi.jsx'
import PanduanPerawatan from './pages/panduan/Perawatan.jsx'
import PanduanLayanan from './pages/panduan/Layanan.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/katalog" element={<Katalog />} />
          <Route path="/buku/:id" element={<BookDetail />} />
          <Route path="/panduan/fasilitas" element={<PanduanFasilitas />} />
          <Route path="/panduan/koleksi" element={<PanduanKoleksi />} />
          <Route path="/panduan/perawatan" element={<PanduanPerawatan />} />
          <Route path="/panduan/layanan" element={<PanduanLayanan />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
