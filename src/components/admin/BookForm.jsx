import React, { useEffect, useState } from 'react'

const EMPTY = {
  judul: '',
  lokasiRak: '',
  kondisi: 'Tersedia',
  aksara: '',
  nomorInduk: '',
}

// Pilihan status untuk field "Status di Rak". Tambahkan opsi baru di sini
// kalau suatu saat butuh status lain (mis. "Dipinjam", "Hilang").
const KONDISI_OPTIONS = ['Tersedia', 'Sedang Restorasi']

const FIELDS = [
  { key: 'judul', label: 'Data Bibliografis (Judul)', required: true },
  { key: 'lokasiRak', label: 'Nomor Panggil' },
  { key: 'aksara', label: 'Aksara' },
  { key: 'nomorInduk', label: 'Nomor Induk' },
  { key: 'kondisi', label: 'Status di Rak', type: 'select', options: KONDISI_OPTIONS },
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

  const inputClass =
    'w-full rounded-lg border border-navy-500/15 bg-parchment-50 px-3 py-2 text-sm text-ink-900 focus:border-navy-500 dark:border-gilt-400/15 dark:bg-ink-900 dark:text-parchment-100'

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

            {f.type === 'select' ? (
              <select
                value={form[f.key] || f.options[0]}
                onChange={(e) => update(f.key, e.target.value)}
                required={f.required}
                className={inputClass}
              >
                {f.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : (
              <input
                value={form[f.key] ?? ''}
                onChange={(e) => update(f.key, e.target.value)}
                required={f.required}
                className={inputClass}
              />
            )}
          </div>
        ))}
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