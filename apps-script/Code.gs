/**
 * ============================================================================
 * Code.gs — Backend API untuk Katalog Ruang Langka
 * ============================================================================
 * Script ini dijalankan di Google Apps Script dan berfungsi sebagai API
 * gratis yang membaca data langsung dari Google Spreadsheet.
 *
 * CARA PAKAI:
 * 1. Buka Google Spreadsheet yang berisi data buku (13.253 baris).
 * 2. Pastikan baris pertama (header) berisi nama kolom persis seperti berikut
 *    (urutan bebas, tapi NAMA harus sama persis, tidak case-sensitive):
 *      id | judul | penulis | kategori | tahun | bahasa | lokasiRak | kondisi | deskripsi | sampul
 *    Kolom "id" boleh dikosongkan, karena akan otomatis diisi nomor baris
 *    jika kosong.
 * 3. Buka menu Extensions > Apps Script pada spreadsheet tersebut.
 * 4. Hapus isi default, lalu tempel seluruh isi file ini.
 * 5. Klik Deploy > New deployment.
 *      - Pilih tipe: "Web app"
 *      - Execute as: Me
 *      - Who has access: Anyone
 * 6. Salin URL Web App yang muncul (contoh: https://script.google.com/macros/s/AKfycb.../exec)
 * 7. Tempelkan URL tersebut sebagai VITE_API_URL pada file .env di project React.
 *
 * CATATAN PENTING:
 * - Setiap kali admin mengubah/menambah baris di Spreadsheet, API ini otomatis
 *   membaca data terbaru — TIDAK PERLU deploy ulang.
 * - Deploy ulang HANYA diperlukan jika kamu mengubah ISI SCRIPT ini sendiri.
 * - Nama SHEET yang dibaca diatur di SHEET_NAME di bawah — sesuaikan bila perlu.
 * ============================================================================
 */

const SHEET_NAME = 'Data Buku'; // ganti sesuai nama tab/sheet di spreadsheet-mu
const CACHE_SECONDS = 300; // cache 5 menit supaya respons lebih cepat & hemat kuota

function doGet(e) {
  try {
    const params = (e && e.parameter) || {};
    const action = params.action || 'list';

    let result;
    switch (action) {
      case 'list':
        result = handleList(params);
        break;
      case 'detail':
        result = handleDetail(params);
        break;
      case 'categories':
        result = handleCategories();
        break;
      case 'featured':
        result = handleFeatured();
        break;
      default:
        result = { error: 'Aksi tidak dikenali: ' + action };
    }

    return jsonOutput(result);
  } catch (err) {
    return jsonOutput({ error: String(err && err.message ? err.message : err) });
  }
}

function jsonOutput(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

/** Mengambil seluruh data dari sheet, dengan cache singkat agar hemat kuota. */
function getAllRows() {
  const cache = CacheService.getScriptCache();
  const cached = cache.get('rl_all_rows');
  if (cached) {
    return JSON.parse(cached);
  }

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) {
    throw new Error('Sheet dengan nama "' + SHEET_NAME + '" tidak ditemukan.');
  }

  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];

  const headers = values[0].map((h) => String(h).trim().toLowerCase());
  const rows = [];

  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    // Lewati baris yang judulnya benar-benar kosong
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h] = row[idx] !== undefined && row[idx] !== null ? row[idx] : '';
    });
    if (!obj.judul) continue;

    if (!obj.id) obj.id = String(i); // fallback id = nomor baris data (mulai dari 1)
    obj.id = String(obj.id);
    if (obj.tahun instanceof Date) {
      obj.tahun = obj.tahun.getFullYear();
    }
    rows.push(obj);
  }

  // Simpan ke cache. Batas ukuran cache Apps Script adalah 100KB per key,
  // jadi untuk dataset besar kita pecah per potongan (chunk).
  try {
    const json = JSON.stringify(rows);
    const chunkSize = 90000; // karakter, aman di bawah batas 100KB
    const chunks = [];
    for (let i = 0; i < json.length; i += chunkSize) {
      chunks.push(json.slice(i, i + chunkSize));
    }
    cache.put('rl_all_rows_count', String(chunks.length), CACHE_SECONDS);
    chunks.forEach((chunk, idx) => cache.put('rl_all_rows_' + idx, chunk, CACHE_SECONDS));
    // simpan versi tunggal hanya jika muat (dataset kecil), agar getAllRows cepat pada run berikutnya
    if (chunks.length === 1) {
      cache.put('rl_all_rows', json, CACHE_SECONDS);
    }
  } catch (e) {
    // Jika gagal cache (dataset sangat besar), lanjut tanpa cache.
  }

  return rows;
}

function handleList(params) {
  const rows = getAllRows();

  const search = String(params.search || '').toLowerCase().trim();
  // Field yang dipilih user di dropdown "Cari berdasarkan" (ala OPAC):
  // semua | judul | penulis | kategori | tahun | lokasiRak | id
  const searchField = String(params.searchField || 'semua').trim();
  const kategori = String(params.kategori || '').trim();
  const sortBy = String(params.sortBy || 'judul');
  const sortDir = String(params.sortDir || 'asc');
  const page = Math.max(1, parseInt(params.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(params.limit, 10) || 20));

  // Field yang boleh dicari secara spesifik. Tambahkan nama kolom lain di
  // sini (mis. "penerbit", "isbn") jika kolom tsb sudah ada di Spreadsheet.
  const SEARCHABLE_FIELDS = ['judul', 'penulis', 'kategori', 'tahun', 'lokasiRak', 'id'];

  let filtered = rows;
  if (search) {
    if (searchField && searchField !== 'semua' && SEARCHABLE_FIELDS.indexOf(searchField) !== -1) {
      filtered = filtered.filter((r) => {
        const value = String(r[searchField] || '').toLowerCase();
        return value.indexOf(search) !== -1;
      });
    } else {
      filtered = filtered.filter((r) => {
        return SEARCHABLE_FIELDS.some((field) => {
          const value = String(r[field] || '').toLowerCase();
          return value.indexOf(search) !== -1;
        });
      });
    }
  }
  if (kategori) {
    filtered = filtered.filter((r) => String(r.kategori || '') === kategori);
  }

  filtered = filtered.slice().sort((a, b) => {
    const av = a[sortBy] !== undefined ? a[sortBy] : '';
    const bv = b[sortBy] !== undefined ? b[sortBy] : '';
    let cmp;
    if (typeof av === 'number' && typeof bv === 'number') {
      cmp = av - bv;
    } else {
      cmp = String(av).localeCompare(String(bv), 'id', { numeric: true });
    }
    return sortDir === 'desc' ? -cmp : cmp;
  });

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const items = filtered.slice(start, start + limit);

  return { items, total, page, totalPages };
}

function handleDetail(params) {
  const id = String(params.id || '');
  const rows = getAllRows();
  const item = rows.find((r) => String(r.id) === id) || null;
  return { item };
}

function handleCategories() {
  const rows = getAllRows();
  const set = {};
  rows.forEach((r) => {
    if (r.kategori) set[String(r.kategori)] = true;
  });
  return { categories: Object.keys(set).sort() };
}

function handleFeatured() {
  const rows = getAllRows();
  // Ambil 3 item pertama sebagai "unggulan". Bisa diganti dengan kolom
  // khusus di spreadsheet (misal kolom "unggulan" = TRUE) bila diinginkan.
  return { items: rows.slice(0, 3) };
}
