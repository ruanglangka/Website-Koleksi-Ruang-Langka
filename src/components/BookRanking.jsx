import React, { useState } from 'react'

/**
 * Design language: a rare-manuscripts reading room.
 * — Three bindings (indigo manuscript leather, oxblood cloth, verdigris ledger)
 *   stand on a shelf, each stamped with a wax-seal rank medallion.
 * — Opening a book slides out a library catalogue card instead of a generic
 *   "detail panel" — the structural device matches the subject.
 */

// `sampul`: isi dengan URL/path foto sampul asli jika sudah ada
// (mis. import lokal `import manuskripCover from './assets/manuskrip.jpg'`
// lalu pakai `sampul: manuskripCover`, atau URL biasa). Kosongkan / null
// untuk item yang belum difoto — akan otomatis pakai jilid ilustrasi.
const RANKING = [
  {
    rank: 1,
    numeral: 'I',
    kategori: 'Manuskrip',
    materi: 'Lontar & Dluwang',
    keterangan:
      'Naskah tulisan tangan tertua dalam koleksi, ditulis di atas lontar dan dluwang.',
    ink: '#1C2942',
    inkDeep: '#0F1830',
    label: 'Cat. No. 001',
    sampul: './assets/manuskrip.jpeg'
  },
  {
    rank: 2,
    numeral: 'II',
    kategori: 'Novel',
    materi: 'Cetak Sampul Kain',
    keterangan:
      'Karya sastra cetak lawas yang menjadi saksi perkembangan bahasa dan budaya baca.',
    ink: '#6B2732',
    inkDeep: '#4A1A22',
    label: 'Cat. No. 014',
    sampul: null,
  },
  {
    rank: 3,
    numeral: 'III',
    kategori: 'Aksara',
    materi: 'Jawa, Pegon & Daerah',
    keterangan:
      'Koleksi bertuliskan aksara Jawa, Pegon, dan aksara daerah lain yang langka.',
    ink: '#33513E',
    inkDeep: '#20362A',
    label: 'Cat. No. 027',
    sampul: null,
  },
]

function SealBadge({ numeral, ink }) {
  return (
    <div className="seal-badge" style={{ '--seal-ink': ink }}>
      <span className="seal-numeral">{numeral}</span>
    </div>
  )
}

function BookSpine({ item, isOpen, onToggle, podiumIndex }) {
  return (
    <div
      className={`book-slot flex w-full max-w-[210px] flex-col items-center ${
        podiumIndex === 0 ? 'order-1 sm:order-2' : podiumIndex === 1 ? 'order-2 sm:order-1' : 'order-3 sm:order-3'
      }`}
      style={{
        '--lift':
          item.rank === 1 ? '-34px' : item.rank === 2 ? '10px' : '52px',
      }}
    >
      <div className="podium-riser">
        <SealBadge numeral={item.numeral} ink={item.ink} />

        <button
          onClick={onToggle}
          aria-pressed={isOpen}
          aria-label={`${item.kategori}, peringkat ${item.rank}. ${isOpen ? 'Tutup' : 'Buka'} rincian.`}
          className={`spine relative w-full ${isOpen ? 'is-open' : ''}`}
          style={{
            aspectRatio: '3 / 4.4',
            '--spine-ink': item.ink,
            '--spine-ink-deep': item.inkDeep,
          }}
        >
          {item.sampul ? (
            <>
              <img
                src={item.sampul}
                alt={`Sampul asli koleksi ${item.kategori}`}
                className="spine-photo"
              />
              <span className="spine-scrim" aria-hidden="true" />
            </>
          ) : (
            <>
              <span className="spine-band spine-band--top" aria-hidden="true" />
              <span className="spine-band spine-band--bottom" aria-hidden="true" />
            </>
          )}
          <span className="spine-pages" aria-hidden="true" />

          <span
            className={`relative z-10 flex h-full flex-col px-3 py-6 ${
              item.sampul ? 'justify-end gap-1' : 'justify-between'
            }`}
          >
            <span className="font-display text-[11px] uppercase tracking-[0.22em] text-[color:var(--gilt)]">
              {item.materi}
            </span>
            <span className="font-display text-2xl italic leading-tight text-parchment-title">
              {item.kategori}
            </span>
            <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-parchment-title/60">
              {isOpen ? 'Tutup' : 'Buka Rincian'}
            </span>
          </span>
        </button>
      </div>

      {/* Catalogue card — unfurls like an index card pulled from the shelf */}
      <div className={`catalog-card ${isOpen ? 'is-open' : ''}`} style={{ '--card-ink': item.ink }}>
        <div className="catalog-card__inner">
          <div className="mb-2 flex items-center justify-between border-b border-dashed border-[color:var(--card-ink)]/25 pb-2">
            <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[color:var(--card-ink)]/60">
              {item.label}
            </span>
            <span className="font-display text-lg italic text-[color:var(--card-ink)]">
              #{item.rank}
            </span>
          </div>
          <p className="font-serif text-[13.5px] leading-relaxed text-ink-body">
            {item.keterangan}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function BookRanking() {
  const [openRank, setOpenRank] = useState(null)

  return (
    <div className="archive-wrap">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,500;0,600;1,500;1,600&family=Source+Serif+4:opsz,wght@8..60,400;8..60,500&family=IBM+Plex+Sans:wght@400;500;600&display=swap');

        .archive-wrap {
          --gilt: #C7992E;
          font-family: 'IBM Plex Sans', sans-serif;
          position: relative;
          background:
            radial-gradient(circle at 20% 15%, rgba(199,153,46,0.10), transparent 45%),
            radial-gradient(circle at 82% 78%, rgba(199,153,46,0.08), transparent 45%),
            #F1E6C8;
          padding: 3.5rem 1.5rem 2.5rem;
          border-radius: 4px;
          overflow: hidden;
        }
        .archive-wrap::before {
          content: '';
          position: absolute;
          inset: 0;
          opacity: 0.05;
          pointer-events: none;
          background-image:
            radial-gradient(circle at 0 0, transparent 9px, #1C2942 10px, transparent 11px),
            radial-gradient(circle at 24px 24px, transparent 9px, #1C2942 10px, transparent 11px);
          background-size: 24px 24px;
        }

        .font-display { font-family: 'Fraunces', serif; }
        .font-serif { font-family: 'Source Serif 4', serif; }
        .font-sans { font-family: 'IBM Plex Sans', sans-serif; }
        .text-parchment-title { color: #F3E9D2; }
        .text-ink-body { color: #241a10; }

        .archive-header {
          position: relative;
          text-align: center;
          margin-bottom: 3.25rem;
        }
        .archive-eyebrow {
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 11px;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: var(--gilt);
          font-weight: 600;
        }
        .archive-title {
          font-family: 'Fraunces', serif;
          font-style: italic;
          font-weight: 600;
          font-size: clamp(1.75rem, 4vw, 2.5rem);
          color: #1C2942;
          margin-top: 0.5rem;
        }
        .archive-rule {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          margin-top: 1rem;
        }
        .archive-rule span {
          height: 1px;
          width: 56px;
          background: linear-gradient(90deg, transparent, var(--gilt), transparent);
        }
        .archive-rule i {
          width: 6px;
          height: 6px;
          background: var(--gilt);
          transform: rotate(45deg);
          display: inline-block;
        }

        .podium-grid {
          position: relative;
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
          align-items: end;
        }
        @media (min-width: 640px) {
          .podium-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 1.25rem;
          }
        }

        .shelf {
          position: relative;
          height: 18px;
          margin-top: 1.5rem;
          border-radius: 2px;
          background: linear-gradient(180deg, #8a6a3c 0%, #6b4f2a 55%, #5a4222 100%);
          box-shadow: 0 10px 18px -8px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.15);
        }
        .shelf::after {
          content: '';
          position: absolute;
          inset: 0 0 auto 0;
          height: 3px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent);
        }

        .book-slot { animation: rise 0.6s cubic-bezier(0.2,0.8,0.2,1) both; }
        .book-slot:nth-child(1) { animation-delay: 0.05s; }
        .book-slot:nth-child(2) { animation-delay: 0.16s; }
        .book-slot:nth-child(3) { animation-delay: 0.27s; }
        @keyframes rise {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .book-slot { animation: none; }
        }

        .podium-riser {
          display: flex;
          flex-direction: column;
          align-items: center;
          transform: translateY(var(--lift));
        }
        @media (max-width: 639px) {
          .podium-riser { transform: none; }
        }

        .seal-badge {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          margin-bottom: -22px;
          z-index: 20;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at 32% 28%, #F3DA8B, var(--gilt) 55%, #9c7620 100%);
          border: 2px solid #8a6a1d;
          box-shadow: 0 3px 8px rgba(0,0,0,0.35), inset 0 1px 1px rgba(255,255,255,0.6);
        }
        .seal-numeral {
          font-family: 'Fraunces', serif;
          font-style: italic;
          font-weight: 600;
          font-size: 15px;
          color: var(--seal-ink);
        }

        .spine {
          border-radius: 3px 8px 8px 3px;
          background: linear-gradient(115deg, var(--spine-ink) 0%, var(--spine-ink-deep) 100%);
          box-shadow: 5px 8px 0 -2px rgba(0,0,0,0.12), 6px 10px 16px rgba(20,15,5,0.35);
          cursor: pointer;
          transition: transform 0.35s ease, box-shadow 0.35s ease;
          outline-offset: 3px;
          overflow: hidden;
          border: 2px solid rgba(199,153,46,0.55);
        }
        .spine-photo {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .spine-scrim {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,0.55) 72%, rgba(0,0,0,0.78) 100%);
        }
        .spine:hover {
          transform: translateY(-6px) rotate(-1deg);
          box-shadow: 8px 14px 0 -2px rgba(0,0,0,0.14), 10px 18px 22px rgba(20,15,5,0.4);
        }
        .spine.is-open {
          transform: translateY(-4px) rotate(-1.5deg);
        }
        .spine:focus-visible {
          outline: 2px solid var(--gilt);
        }
        .spine-pages {
          position: absolute;
          top: 3px; bottom: 3px; right: 0;
          width: 5px;
          background: repeating-linear-gradient(180deg, #F3E9D2 0 2px, #DDCBA0 2px 3px);
          box-shadow: -1px 0 3px rgba(0,0,0,0.25);
        }
        .spine-band {
          position: absolute;
          left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, transparent, var(--gilt) 20%, var(--gilt) 80%, transparent);
          opacity: 0.75;
        }
        .spine-band--top { top: 16%; }
        .spine-band--bottom { bottom: 16%; }

        .catalog-card {
          width: 100%;
          max-width: 210px;
          margin-top: 0.85rem;
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.4s ease;
        }
        .catalog-card.is-open { grid-template-rows: 1fr; }
        .catalog-card__inner {
          overflow: hidden;
          background: #FBF4E2;
          border: 1px solid rgba(28,20,10,0.12);
          border-top: 3px solid var(--card-ink);
          border-radius: 2px;
          box-shadow: 0 6px 14px rgba(20,15,5,0.18);
          padding: 0.85rem 0.95rem;
        }
      `}</style>

      <div className="archive-header">
        <h2 className="archive-title"> Koleksi Naskah Langka</h2>
        <div className="archive-rule">
          <span />
          <i />
          <span />
        </div>
      </div>

      <div className="podium-grid">
        {RANKING.map((item, i) => (
          <BookSpine
            key={item.rank}
            item={item}
            podiumIndex={i}
            isOpen={openRank === item.rank}
            onToggle={() => setOpenRank((cur) => (cur === item.rank ? null : item.rank))}
          />
        ))}
      </div>

      <div className="shelf hidden sm:block" />
    </div>
  )
}