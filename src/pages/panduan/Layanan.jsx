import React from 'react'
import PanduanLayout, { Section } from './PanduanLayout.jsx'

export default function Layanan() {
  return (
    <PanduanLayout eyebrow="Panduan Pengunjung" title="Layanan & Tata Tertib">
      <Section title="Aturan Penggunaan Koleksi">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Koleksi Ruang Langka hanya dapat dibaca di tempat, tidak untuk dibawa pulang.</li>
          <li>Pengunjung wajib mencuci tangan dan menggunakan sarung tangan yang disediakan.</li>
          <li>Dilarang membawa makanan, minuman, tinta, atau alat tulis basah ke ruang baca.</li>
          <li>Penggandaan/fotokopi koleksi hanya dilakukan oleh petugas sesuai ketentuan hak cipta.</li>
          <li>Pengambilan gambar diperbolehkan tanpa lampu kilat (flash).</li>
        </ul>
      </Section>

      <Section title="Tata Cara / Prosedur Peminjaman (Layanan Baca di Tempat)">
        <ol className="list-decimal space-y-1.5 pl-5">
          <li>Pengunjung mendaftar di meja layanan dan menunjukkan identitas diri.</li>
          <li>Mencari koleksi melalui katalog digital atau meminta bantuan pustakawan.</li>
          <li>Mengisi formulir permintaan koleksi dengan menyebutkan judul/kode koleksi.</li>
          <li>Petugas mengambilkan koleksi dari ruang penyimpanan.</li>
          <li>Koleksi dibaca di ruang baca yang telah disediakan, didampingi petugas bila diperlukan.</li>
          <li>Koleksi dikembalikan kepada petugas setelah selesai digunakan.</li>
        </ol>
      </Section>
    </PanduanLayout>
  )
}
