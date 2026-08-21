import React from 'react'
import PanduanLayout, { Section } from './PanduanLayout.jsx'

export default function Koleksi() {
  return (
    <PanduanLayout eyebrow="Panduan Pengunjung" title="Koleksi Buku Langka">
      <Section title="Pengertian & Ciri Koleksi Buku Langka">
        <p>
          Koleksi buku langka adalah bahan pustaka yang jumlah eksemplarnya sangat terbatas,
          sudah tidak dicetak ulang, dan memiliki nilai sejarah, ilmiah, atau budaya yang
          tinggi. Ciri umumnya antara lain: usia terbitan yang tua, kertas atau media tulis
          khas (lontar, dluwang, kertas Eropa lawas), serta kondisi fisik yang rentan.
        </p>
      </Section>

      <Section title="Klasifikasi Koleksi">
        <ul className="list-disc space-y-1.5 pl-5">
          <li><strong>Manuskrip</strong> — naskah tulisan tangan, termasuk naskah beraksara Jawa, Pegon, dan Arab.</li>
          <li><strong>Cetakan Kuno</strong> — buku cetak terbitan lama yang sudah langka di pasaran.</li>
          <li><strong>Peta & Dokumen Kartografi</strong> — peta wilayah bersejarah.</li>
          <li><strong>Surat Kabar & Majalah Lawas</strong> — terbitan berkala masa kolonial dan awal kemerdekaan.</li>
        </ul>
      </Section>

      <Section title="Perawatan Koleksi">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Penyimpanan pada suhu dan kelembapan ruang yang terkontrol.</li>
          <li>Fumigasi berkala untuk mencegah serangan serangga dan jamur.</li>
          <li>Penggunaan sarung tangan saat penanganan koleksi yang sangat rapuh.</li>
          <li>Digitalisasi/alih media sebagai cadangan sekaligus akses tanpa menyentuh fisik asli.</li>
        </ul>
      </Section>
    </PanduanLayout>
  )
}
