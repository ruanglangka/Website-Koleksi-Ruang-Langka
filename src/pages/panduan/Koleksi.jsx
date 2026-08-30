import React from 'react'
import PanduanLayout, { Section } from './PanduanLayout.jsx'
import CriteriaList from '../../components/CriteriaList.jsx'
import ExampleGallery from '../../components/ExampleGallery.jsx'
import ClassificationList from '../../components/ClassificationList.jsx'

const CRITERIA = [
  {
    title: 'Usia Buku',
    points: [
      'Buku-buku yang berusia tua (lebih dari 50 tahun) cenderung dianggap langka, terutama jika sudah tidak diproduksi lagi.',
    ],
  },
  {
    title: 'Kelangkaan',
    points: [
      'Buku yang sudah tidak dicetak lagi atau sulit ditemukan di pasaran dianggap langka.',
      'Kelangkaan bisa disebabkan oleh berbagai faktor, seperti jumlah cetakan yang terbatas, topik yang sudah tidak relevan, atau buku tersebut hanya diterbitkan untuk kalangan terbatas.',
    ],
  },
  {
    title: 'Kondisi Buku',
    points: [
      'Kondisi buku sangat berpengaruh pada nilai kelangkaannya. Buku dengan kondisi baik atau bahkan sempurna akan memiliki nilai lebih tinggi.',
      'Kerusakan seperti sobek, halaman hilang, atau noda akan mengurangi nilai buku langka.',
    ],
  },
  {
    title: 'Nilai Sejarah dan Informasi',
    points: [
      'Buku-buku yang memiliki nilai sejarah, budaya, atau informasi penting tertentu dianggap langka.',
      'Buku yang pernah digunakan oleh tokoh penting atau menjadi saksi peristiwa bersejarah memiliki nilai koleksi yang tinggi.',
      'Beberapa buku langka juga memiliki nilai sejarah karena menggunakan bahasa atau aksara kuno yang sudah jarang digunakan.',
    ],
  },
  {
    title: 'Asal Usul',
    points: [
      'Asal usul buku juga dapat memengaruhi kelangkaannya. Buku dengan riwayat kepemilikan yang jelas, seperti pernah menjadi milik seorang kolektor terkenal, bisa memiliki nilai jual yang lebih tinggi.',
    ],
  },
  {
    title: 'Edisi dan Cetakan',
    points: [
      'Edisi pertama atau edisi terbatas suatu buku seringkali lebih langka dan bernilai.',
      'Perbedaan cetakan, seperti penggunaan kertas atau jenis ilustrasi tertentu, juga dapat menjadi ciri kelangkaan.',
    ],
  },
  {
    title: 'Ciri Fisik',
    points: [
      'Beberapa buku langka memiliki ciri fisik yang unik, seperti jenis kertas, desain sampul, atau jenis jilid yang khas.',
      'Buku-buku antik yang diterbitkan sebelum tahun 1900 seringkali memiliki ciri fisik yang berbeda dengan buku-buku modern.',
    ],
  },
]

export default function Koleksi() {
  return (
    <PanduanLayout eyebrow="Panduan Pengunjung" title="Koleksi Buku Langka">
      <Section title="Apa itu Buku Langka?">
        <p className="text-justify mb-4">
          Buku langka, atau sering disebut juga buku antik, adalah jenis buku yang sudah tidak
          dicetak lagi, jarang ditemukan di toko buku, dan biasanya memuat informasi bersejarah
          yang penting (Badan Perpustakaan dan Arsip Daerah Provinsi DIY, 2009, dalam Pratiwi,
          2017). Karena keunikannya, buku-buku ini masuk dalam kategori koleksi khusus.
        </p>
        <p className="text-justify mb-4">
          Karena nilainya yang tinggi dan isinya yang istimewa, koleksi seperti ini biasanya
          disimpan di tempat khusus yang aman, dengan pengaturan suhu dan kelembapan tertentu,
          serta aturan peminjaman atau akses yang berbeda dari buku-buku biasa (Kilmarx, 2020).
        </p>
      </Section>

      <Section title="Ciri Koleksi Langka">
        <CriteriaList items={CRITERIA} />
      </Section>

      <Section title="Klasifikasi Koleksi">
        <p className="mb-4">
          Koleksi Ruang Langka disusun berdasarkan Klasifikasi Persepuluhan Dewey (Dewey Decimal
          Classification/DDC), yang membagi seluruh bidang ilmu ke dalam 10 kelas utama bernomor
          000–900.
        </p>
        <ClassificationList />
      </Section>

      <Section title="Contoh Koleksi Langka">
        <p className="mb-4">
          Beberapa contoh kategori koleksi yang dapat ditemui di Ruang Langka.
        </p>
        <ExampleGallery />
      </Section>

      <section className="border-t border-navy-500/12 pt-4 dark:border-gilt-400/10">
        <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-ink-800/40 dark:text-parchment-100/40">
          Sumber
        </p>
        <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-ink-800/55 dark:text-parchment-100/55">
          <li>
            Kilmarx, B., Bubenik, C., Pieniazny, M., Philips, M., dan Vincent, H. (2020).
            Competency Guidelines for Rare Books and Special Collections Professionals.
            International Federation of Library Associations and Institutions (IFLA).
          </li>
          <li>
            Pratiwi, E. (2017). Upaya dan Strategi Mempromosikan Koleksi Buku Langka. Badan
            Perpustakaan dan Arsip Daerah DIY.
          </li>
        </ul>
      </section>
    </PanduanLayout>
  )
}
