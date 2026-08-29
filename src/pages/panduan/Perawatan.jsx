import React from 'react'
import PanduanLayout, { Section } from './PanduanLayout.jsx'
import PhotoPlaceholder from '../../components/PhotoPlaceholder.jsx'
import alatPerawatan from '../../../public/assets/alatPerawatan.png'
import kegiatan1 from '../../../public/assets/perawatan/perawatan1.png'
import kegiatan2 from '../../../public/assets/perawatan/perawatan2.png'
import kegiatan3 from '../../../public/assets/perawatan/perawatan3.png'
import kegiatan4 from '../../../public/assets/perawatan/perawatan4.png'

const ALAT = [
  'Dry gel / silica gel',
  'Kapur barus (kamper)',
  'Akar wangi',
  'Sapu pembersih rak',
  'Kuas pembersih koleksi',
]

export default function Perawatan() {
  return (
    <PanduanLayout eyebrow="Panduan Pengunjung" title="Perawatan Koleksi Langka">
      <Section title="Mengapa Koleksi Langka Perlu Dirawat">
        <p>
          Dikarenakan koleksi langka kebanyakan adalah koleksi yang memiliki usia lebih dari 50
          tahun dan juga status kelangkaan koleksi menjadi perhatian yang utama, koleksi langka
          memerlukan perawatan tersendiri, yaitu perawatan harian dan perawatan periodik.
        </p>
      </Section>

      <Section title="Jenis Perawatan">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-navy-500/15 bg-parchment-50 p-4 dark:border-gilt-400/15 dark:bg-ink-800">
            <p className="font-display text-sm font-semibold text-ink-900 dark:text-parchment-100">
              Perawatan Harian
            </p>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-ink-800/80 dark:text-parchment-100/80">
              <li>Menjaga kadar suhu ruangan di antara 18–24°C untuk menjaga kelembapan.</li>
              <li>Pemberian dry gel/silica gel untuk menyerap kelembapan berlebih.</li>
              <li>Pemberian kamper dan akar wangi yang bertujuan sebagai anti serangga.</li>
            </ul>
          </div>

          <div className="rounded-lg border border-navy-500/15 bg-parchment-50 p-4 dark:border-gilt-400/15 dark:bg-ink-800">
            <p className="font-display text-sm font-semibold text-ink-900 dark:text-parchment-100">
              Perawatan Periodik{' '}
              <span className="font-body text-xs font-normal text-ink-800/50 dark:text-parchment-100/50">
                (6 bulan sekali)
              </span>
            </p>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-ink-800/80 dark:text-parchment-100/80">
              <li>Fumigasi koleksi untuk mencegah serangan serangga dan jamur.</li>
              <li>Pembersihan menyeluruh terhadap koleksi dan ruang penyimpanan.</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section title="Alat Perawatan">
        <div className="max-w-xs">
          <PhotoPlaceholder aspect="aspect-[4/3]" label="Alat Perawatan" image={alatPerawatan} alt="Alat Perawatan" />
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {ALAT.map((a) => (
            <span
              key={a}
              className="rounded-full bg-gilt-400/15 px-2.5 py-1 text-xs text-gilt-500 dark:text-gilt-300"
            >
              {a}
            </span>
          ))}
        </div>
      </Section>

      <Section title="Kegiatan Perawatan">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <PhotoPlaceholder aspect="aspect-[3/4]" image={kegiatan1} alt="Kegiatan Perawatan 1" />
          <PhotoPlaceholder aspect="aspect-[3/4]" image={kegiatan2} alt="Kegiatan Perawatan 2" />
          <PhotoPlaceholder aspect="aspect-[3/4]" image={kegiatan3} alt="Kegiatan Perawatan 3" />
          <PhotoPlaceholder aspect="aspect-[3/4]" image={kegiatan4} alt="Kegiatan Perawatan 4" />
        </div>
      </Section>
    </PanduanLayout>
  )
}
