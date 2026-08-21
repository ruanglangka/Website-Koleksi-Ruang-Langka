# Koleksi Ruang Langka

Katalog digital untuk koleksi Ruang Langka — Balai Layanan Perpustakaan Pemda DIY.
Dibangun dengan **React + Vite + Tailwind CSS**, dengan data (±13.253 koleksi buku)
diambil langsung dari **Google Spreadsheet** melalui **Google Apps Script** yang
berfungsi sebagai API gratis.

```
Excel  →  Google Spreadsheet  →  Google Apps Script (API)  →  React Website  →  GitHub Pages
```

Admin cukup mengedit data di Google Spreadsheet — website akan otomatis menampilkan
data terbaru tanpa perlu mengubah kode atau deploy ulang website.

---

## 1. Struktur Project

```
ruang-langka/
├── apps-script/
│   └── Code.gs              ← kode backend (API), ditempel ke Google Apps Script
├── public/
│   └── book-icon.svg
├── src/
│   ├── api/booksApi.js      ← koneksi ke Apps Script
│   ├── components/          ← Navbar, Footer, BookCard, Pagination, dll
│   ├── context/ThemeContext.jsx  ← sleep mode (day/night)
│   ├── data/sampleBooks.js  ← data contoh (dipakai jika API belum diatur)
│   ├── pages/
│   │   ├── Dashboard.jsx    ← Home
│   │   ├── Katalog.jsx      ← Search Page
│   │   ├── BookDetail.jsx   ← Detail buku
│   │   └── panduan/         ← Fasilitas, Koleksi, Layanan & Tata Tertib
│   ├── App.jsx
│   └── main.jsx
├── .github/workflows/deploy.yml  ← auto-deploy ke GitHub Pages
├── .env.example
└── vite.config.js
```

---

## 2. Langkah 1 — Pindahkan Data Excel ke Google Spreadsheet

1. Buka [Google Sheets](https://sheets.google.com), buat spreadsheet baru.
2. Import file Excel: **File → Import → Upload**, pilih file `.xlsx` kamu,
   lalu pilih "Insert new sheet(s)" atau "Replace spreadsheet".
3. Ganti nama tab/sheet menjadi **`Data Buku`** (atau sesuaikan `SHEET_NAME`
   di `apps-script/Code.gs`).
4. Pastikan **baris pertama (header)** berisi nama kolom berikut (urutan bebas,
   tidak case-sensitive):

   | id | judul | penulis | kategori | tahun | bahasa | lokasiRak | kondisi | deskripsi | sampul |
   |----|-------|---------|----------|-------|--------|-----------|---------|-----------|--------|

   - `id` boleh dikosongkan (akan otomatis diisi nomor baris).
   - `sampul` diisi URL gambar sampul buku (opsional, boleh dikosongkan).
   - Kolom lain bebas ditambah — kolom tambahan tidak akan mengganggu, hanya
     tidak ditampilkan kecuali kamu menambahkannya juga di `BookDetail.jsx`.

5. Baris 2 dan seterusnya diisi data ke-13.253 koleksi buku.

> 💡 Karena datanya besar (13rb+ baris), pastikan tidak ada baris kosong di
> tengah data — baris kosong akan otomatis dilewati oleh API, tapi lebih rapi
> jika data rapat dari baris 2 sampai baris terakhir.

---

## 3. Langkah 2 — Deploy Google Apps Script sebagai API

1. Di Google Spreadsheet tadi, buka menu **Extensions → Apps Script**.
2. Hapus kode default di `Code.gs`, lalu **salin-tempel** seluruh isi file
   [`apps-script/Code.gs`](./apps-script/Code.gs) dari project ini.
3. Klik **Deploy → New deployment**.
   - Klik ikon gear ⚙ di samping "Select type" → pilih **Web app**.
   - **Execute as**: Me (akun kamu)
   - **Who has access**: Anyone
4. Klik **Deploy**, lalu izinkan (authorize) akses saat diminta.
5. Salin **Web app URL** yang muncul, formatnya seperti:
   ```
   https://script.google.com/macros/s/AKfycbxxxxxxxxxxxxxxxxxxxxxxxx/exec
   ```
6. Coba buka URL tersebut di browser + tambahkan `?action=list&page=1&limit=5`
   untuk memastikan API mengembalikan data JSON.

**Update data selanjutnya:** setiap kali admin mengubah/menambah data di
spreadsheet, API akan otomatis membaca versi terbaru (dengan cache 5 menit).
**Deploy ulang hanya diperlukan jika isi `Code.gs` sendiri diubah** — gunakan
**Deploy → Manage deployments → Edit (ikon pensil) → Deploy** untuk update
tanpa mengganti URL.

---

## 4. Langkah 3 — Jalankan Website Secara Lokal

```bash
# 1. install dependencies
npm install

# 2. siapkan file environment
cp .env.example .env
# lalu edit .env, isi VITE_API_URL dengan Web App URL dari langkah 3

# 3. jalankan development server
npm run dev
```

Jika `VITE_API_URL` belum diisi, website tetap bisa dijalankan menggunakan
data contoh (mock, 13.253 baris dummy) dari `src/data/sampleBooks.js`, supaya
tampilan bisa langsung dicoba.

---

## 5. Langkah 4 — Simpan ke GitHub

```bash
git init
git add .
git commit -m "Initial commit: Koleksi Ruang Langka"
git branch -M main
git remote add origin https://github.com/<username>/<nama-repo>.git
git push -u origin main
```

---

## 6. Langkah 5 — Deploy ke GitHub Pages

### Opsi A — Otomatis via GitHub Actions (disarankan)

Repo ini sudah menyertakan `.github/workflows/deploy.yml` yang otomatis
build & deploy setiap kali ada push ke branch `main`.

1. Buka repo di GitHub → **Settings → Pages**.
   - Source: pilih **GitHub Actions**.
2. Buka **Settings → Secrets and variables → Actions → New repository secret**.
   - Name: `VITE_API_URL`
   - Value: Web App URL dari Apps Script (langkah 3).
3. Edit `vite.config.js`, ganti `base: '/REPO_NAME/'` sesuai nama repo GitHub kamu.
   (Jika repo bernama `<username>.github.io`, gunakan `base: '/'`.)
4. Edit `package.json`, ganti `homepage` sesuai URL GitHub Pages kamu.
5. Push perubahan ke `main` — GitHub Actions akan otomatis build & publish.
6. Website akan tersedia di:
   `https://<username>.github.io/<nama-repo>/`

### Opsi B — Manual via `gh-pages`

```bash
npm install
npm run deploy
```

Ini akan build project dan mem-push folder `dist/` ke branch `gh-pages`.
Lalu di **Settings → Pages**, pilih Source: branch `gh-pages`.

---

## 7. Menghubungkan ke Google Spreadsheet (Ringkasan)

| Langkah | Tempat |
|---|---|
| 1. Data buku disimpan & dikelola | Google Spreadsheet |
| 2. Apps Script membaca data & menyediakan endpoint JSON | Google Apps Script (Web App) |
| 3. React fetch data dari endpoint tersebut | `src/api/booksApi.js` (`VITE_API_URL`) |
| 4. Admin update data | Cukup edit langsung di Spreadsheet — otomatis muncul di website (cache 5 menit) |

---

## 8. Fitur

- **Dashboard** — hero, ranking 3 kategori koleksi (Manuskrip, Novel, Aksara) dengan
  animasi buku interaktif saat diklik, koleksi pilihan, dan kartu menuju panduan.
- **Katalog (Search Page)** — pencarian judul/penulis (debounced), filter kategori,
  sorting, mode tampilan grid/daftar, dan **pagination** untuk menavigasi 13.253 data
  tanpa membebani browser (data diambil per halaman dari server).
- **Detail Buku** — halaman lengkap untuk tiap koleksi (URL: `/#/buku/:id`).
- **Panduan** — 3 sub-halaman (Fasilitas, Koleksi, Layanan & Tata Tertib) dengan
  dropdown navigasi di navbar.
- **Sleep Mode (Day/Night)** — toggle tema terang/gelap, tersimpan di `localStorage`.
- **Footer** — tautan sosial media, kontak, dan info Grahatama Pustaka, RBM, JLC.

---

## 9. Sesuaikan Konten

- Tautan sosial media & alamat: `src/components/Footer.jsx`
- Teks panduan: `src/pages/panduan/*.jsx`
- Warna & font tema: `tailwind.config.js`
- Struktur kolom data buku: sesuaikan `FIELD_LABELS` di `src/pages/BookDetail.jsx`
  dan header kolom di Google Spreadsheet + `apps-script/Code.gs`.

---

## 10. Teknologi

- React 18 + Vite 5
- React Router (HashRouter — kompatibel dengan GitHub Pages)
- Tailwind CSS 3
- Google Apps Script (backend/API)
- Google Sheets (database)
- GitHub Actions + GitHub Pages (hosting gratis)
