import React from 'react'
import PanduanLayout, { Section } from './PanduanLayout.jsx'
import FacilityGallery from '../../components/FacilityGallery.jsx'

export default function Fasilitas() {
  return (
    <PanduanLayout eyebrow="Panduan Pengunjung" title="Fasilitas Ruang Langka">
      <Section title="Pengertian Ruang Langka">
        <p className="text-justify mb-4">
          Ruang koleksi langka adalah ruangan atau bagian khusus dalam
          perpustakaan Grahatama Pustaka yang digunakan untuk
          menyimpan, mengelola, dan melestarikan bahan pustaka yang
          memiliki nilai sejarah, budaya, ilmiah, atau estetika tinggi. Koleksi
          ini biasanya mencakup naskah kuno, manuskrip, buku terbitan lama,
          peta, foto, atau benda lain yang langka, unik, atau sulit ditemukan.
          Ruang ini memiliki pengendalian akses ketat, lingkungan terkontrol
          (suhu, kelembapan, dan cahaya), serta peraturan khusus untuk
          menjaga keutuhan dan keaslian koleksi agar tetap terpelihara untuk
          kepentingan penelitian, pendidikan, dan pelestarian warisan budaya.
        </p>
        <p className="text-justify mb-4">
          Ruang koleksi langka Grahatama Pustaka terletak di lantai 2, Gedung
          Grahatama Pustaka di Jl. Raya Janti, Wonocatur, Banguntapan, Kec.
          Banguntapan, Kabupaten Bantul, Daerah Istimewa Yogyakarta
          55198. Memiliki koleksi sekitar 13 Ribu eksemplar yang terbagi ke
          dalam 2 ruangan. Koleksi tersebut berbahasa Jawa, Belanda,
          Indonesia, Perancis, Jerman, Arab dan Inggris juga beraksara jawa,
          latin, dan arab. Koleksi di Ruang Langka bersifat closed-Access dan
          hanya boleh dibaca ditempat.
        </p>
      </Section>

      <Section title="Ruang koleksi langka merupakan ruang layanan baca di tempat maka
          terdapat beberapa prasyarat yakni:">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Mematuhi peraturan dan tata tertib yang berlaku</li>
          <li>Pemustaka di larang membawa tas, makanan dan minuman (kecuali air putih) ke ruang koleksi</li>
          <li>Mengisi buku tamu di masing-masing ruang</li>
        </ul>
      </Section>

      <Section title="Fasilitas yang Tersedia">
        <p className="mb-4">
          Lima fasilitas utama yang dapat dimanfaatkan pengunjung selama berada di Ruang Langka.
        </p>
        <FacilityGallery />
      </Section>

      <Section title="Layanan Pendukung Lainnya">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Sarung tangan dan alat bantu baca untuk penanganan koleksi rapuh.</li>
          <li>Layanan alih media / digitalisasi koleksi atas permintaan.</li>
          <li>Katalog digital untuk pencarian koleksi secara mandiri.</li>
          <li>Pendampingan pustakawan Ruang Langka selama kunjungan.</li>
        </ul>
      </Section>
    </PanduanLayout>
  )
}
