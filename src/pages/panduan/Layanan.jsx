import React from 'react'
import PanduanLayout, { Section } from './PanduanLayout.jsx'
import ProcedureFlow from '../../components/ProcedureFlow.jsx'

const STEPS = [
  'Pemustaka mengisi buku tamu',
  'Pemustaka menelusur koleksi melalui opac/bantuan petugas',
  'Pemustaka menuliskan koleksi yang akan dipinjam pada kertas peminjaman',
  'Petugas mengambilkan pada ruang koleksi',
  'Pemustaka membaca di ruang baca',
  'Pemustaka meletakan koleksi yang sudah dibaca pada meja khusus',
]

export default function Layanan() {
  return (
    <PanduanLayout eyebrow="Panduan Pengunjung" title="Layanan & Tata Tertib">
      <Section title="Aturan Penggunaan Koleksi">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Koleksi di Ruang Langka hanya bersifat baca di tempat (Close-Access).</li>
          <li>Pemustaka wajib menuliskan koleksi yang akan dibaca pada kertas data.</li>
          <li>Pemustaka wajib menjaga koleksi yang dibaca.</li>
          <li>Tidak diperkenankan untuk memfoto atau mengambil gambar dari koleksi yang dipinjam.</li>
          <li>
            Jika diperlukan akses lebih silahkan bersurat kepada Kepala Balai Layanan
            Perpustakaan DPAD DIY.
          </li>
          <li>
            Mengirimkan permohonan informasi yang dibutuhkan melalui surat permohonan foto
            koleksi ditujukan ke Kepala Balai Yanpus DIY. Surat dapat dikirim langsung atau via
            email. Disertai data diri dan kontak person.
          </li>
        </ul>
      </Section>

      <Section title="Tata Cara Penggunaan Koleksi">
        <ProcedureFlow steps={STEPS} />
      </Section>
    </PanduanLayout>
  )
}
