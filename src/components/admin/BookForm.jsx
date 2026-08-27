import React, { useEffect, useState } from 'react'

const EMPTY = {
  judul: '',
  penulis: '',
  kategori: '',
  tahun: '',
  bahasa: '',
  lokasiRak: '',
  kondisi: '',
  deskripsi: '',
  sampul: '',
}

const FIELDS = [
  { key: 'judul', label: 'Judul', required: true },
  { key: 'penulis', label: 'Penulis / Penyalin' },
  { key: 'kategori', label: 'Kategori' },
  { key: 'tahun', label: 'Tahun' },
  { key: 'bahasa', label: 'Bahasa' },
  { key: 'lokasiRak', label: 'Lokasi Rak' },
  { key: 'kondisi', label: 'Kondisi Fisik' },
  { key: 'sampul', label: 'URL Sampul (opsional)' },
]

export default function BookForm({ initialBook, onSubmit, onCancel, saving }) {
  const [form, setForm] = useState(EMPTY)

  useEffect(() => {
    setForm(initialBook ? { ...EMPTY, ...initialBook } : EMPTY)
  }, [initialBook])

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.judul.trim()) return
    onSubmit(form)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-navy-500/10 bg-navy-50 p-5 shadow-card dark:border-obsidian-border dark:bg-obsidian-card dark:shadow-card-dark sm:p-6"
    >
      <h3 className="font-display text-lg font-semibold text-ink-900 dark:text-parchment-100">
        {initialBook ? 'Ubah Koleksi' : 'Tambah Koleksi Baru'}
      </h3>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {FIELDS.map((f) => (
          <div key={f.key}>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-ink-800/60 dark:text-parchment-100/60">
              {f.label} {f.required && <span className="text-red-500">*</span>}
            </label>
            <input
              value={form[f.key] ?? ''}
              onChange={(e) => update(f.key, e.target.value)}
              required={f.required}
              className="w-full rounded-lg border border-navy-500/15 bg-parchment-50 px-3 py-2 text-sm text-ink-900 focus:border-navy-500 dark:border-gilt-400/15 dark:bg-ink-900 dark:text-parchment-100"
            />
          </div>
        ))}
      </div>

      <div className="mt-4">
        <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-ink-800/60 dark:text-parchment-100/60">
          Deskripsi / Sinopsis
        </label>
        <textarea
          value={form.deskripsi ?? ''}
          onChange={(e) => update('deskripsi', e.target.value)}
          rows={4}
          className="w-full rounded-lg border border-navy-500/15 bg-parchment-50 px-3 py-2 text-sm text-ink-900 focus:border-navy-500 dark:border-gilt-400/15 dark:bg-ink-900 dark:text-parchment-100"
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-navy-500 px-5 py-2.5 text-sm font-semibold text-parchment-50 transition-colors hover:bg-navy-600 disabled:opacity-50 dark:bg-gilt-400 dark:text-ink-900 dark:hover:bg-gilt-300"
        >
          {saving ? 'Menyimpan…' : initialBook ? 'Simpan Perubahan' : 'Tambah Koleksi'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="rounded-lg border border-navy-500/25 px-5 py-2.5 text-sm font-semibold text-navy-600 transition-colors hover:bg-navy-500/5 dark:border-gilt-400/25 dark:text-gilt-300 dark:hover:bg-gilt-400/10"
        >
          Batal
        </button>
      </div>
    </form>
  )
}
