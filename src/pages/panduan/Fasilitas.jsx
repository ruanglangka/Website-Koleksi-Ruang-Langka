import React from 'react'
import PanduanLayout, { Section } from './PanduanLayout.jsx'

export default function Fasilitas() {
  return (
    <PanduanLayout eyebrow="Panduan Pengunjung" title="Fasilitas Ruang Langka">
      <Section title="Pengertian Ruang Langka">
        <p>
          Ruang Langka adalah ruang khusus di Balai Layanan Perpustakaan Pemda DIY yang
          menyimpan dan melayani koleksi bahan pustaka bernilai sejarah tinggi, langka, dan
          memerlukan penanganan khusus — meliputi manuskrip, naskah kuno, dan cetakan lawas
          yang sudah sulit ditemukan di pasaran.
        </p>
      </Section>

      <Section title="Fasilitas yang Tersedia">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Ruang baca ber-AC dengan pengaturan suhu dan kelembapan terkontrol.</li>
          <li>Meja baca individu dengan pencahayaan khusus untuk naskah sensitif.</li>
          <li>Sarung tangan dan alat bantu baca untuk penanganan koleksi rapuh.</li>
          <li>Layanan alih media / digitalisasi koleksi atas permintaan.</li>
          <li>Katalog digital untuk pencarian koleksi secara mandiri.</li>
          <li>Pendampingan pustakawan Ruang Langka selama kunjungan.</li>
        </ul>
      </Section>
    </PanduanLayout>
  )
}
