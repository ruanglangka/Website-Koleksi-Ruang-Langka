import React from 'react'

export const CLASSIFICATIONS = [
  {
    code: '000',
    title: 'Ilmu Pengetahuan Umum',
    desc: 'Meliputi: Komputer, informasi, ensiklopedia, jurnalistik, dan karya umum.',
    examples: ['070 (Jurnalistik)', '004 (Ilmu Komputer)'],
  },
  {
    code: '100',
    title: 'Filsafat dan Psikologi',
    desc: 'Meliputi: Logika, etika, psikologi, dan metafisika.',
    examples: ['150 (Psikologi)', '170 (Etika)'],
  },
  {
    code: '200',
    title: 'Agama',
    desc: 'Meliputi: Semua agama, teologi, dan mitologi.',
    examples: ['210 (Filsafat Agama)', '297 (Islam)'],
  },
  {
    code: '300',
    title: 'Ilmu Sosial',
    desc: 'Meliputi: Sosiologi, politik, ekonomi, hukum, pendidikan, dan administrasi.',
    examples: ['320 (Ilmu Politik)', '370 (Pendidikan)'],
  },
  {
    code: '400',
    title: 'Bahasa',
    desc: 'Meliputi: Linguistik, tata bahasa, dan kamus berbagai bahasa.',
    examples: ['420 (Bahasa Inggris)', '499 (Bahasa Indonesia)'],
  },
  {
    code: '500',
    title: 'Ilmu Pengetahuan Alam dan Matematika',
    desc: 'Meliputi: Matematika, fisika, kimia, biologi, dan astronomi.',
    examples: ['510 (Matematika)', '570 (Biologi)'],
  },
  {
    code: '600',
    title: 'Teknologi (Ilmu Terapan)',
    desc: 'Meliputi: Kedokteran, teknik, pertanian, dan manajemen.',
    examples: ['610 (Kedokteran)', '650 (Manajemen)'],
  },
  {
    code: '700',
    title: 'Seni dan Rekreasi',
    desc: 'Meliputi: Seni rupa, musik, teater, olahraga, dan hobi.',
    examples: ['720 (Arsitektur)', '790 (Olahraga)'],
  },
  {
    code: '800',
    title: 'Kesusastraan',
    desc: 'Meliputi: Puisi, drama, novel, dan karya sastra lainnya.',
    examples: ['820 (Sastra Inggris)', '899 (Sastra Indonesia)'],
  },
  {
    code: '900',
    title: 'Geografi, Sejarah, dan Biografi',
    desc: 'Meliputi: Sejarah, geografi, perjalanan, dan biografi.',
    examples: ['910 (Geografi)', '920 (Biografi)'],
  },
]

export default function ClassificationList({ items = CLASSIFICATIONS }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {items.map((c) => (
        <div
          key={c.code}
          className="flex gap-3 rounded-lg border border-navy-500/15 bg-parchment-50 p-3.5 shadow-sm transition-shadow hover:shadow-book dark:border-gilt-400/15 dark:bg-ink-800"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gilt-400/50 font-display text-sm font-semibold text-gilt-500 dark:border-gilt-300/50 dark:text-gilt-300">
            {c.code}
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-display text-sm font-semibold text-ink-900 dark:text-parchment-100">
              {c.title}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-ink-800/80 dark:text-parchment-100/80">
              {c.desc}
            </p>
            <p className="mt-2 flex flex-wrap gap-1.5">
              {c.examples.map((ex) => (
                <span
                  key={ex}
                  className="rounded-full bg-navy-50 px-2 py-0.5 text-[11px] font-medium text-navy-600 dark:bg-ink-900 dark:text-gilt-300"
                >
                  {ex}
                </span>
              ))}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
