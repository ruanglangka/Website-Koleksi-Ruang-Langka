/**
 * ============================================================================
 * Code.gs — Backend API untuk Katalog Ruang Langka
 * ============================================================================
 * Script ini dijalankan di Google Apps Script dan berfungsi sebagai API
 * gratis yang membaca data langsung dari Google Spreadsheet.
 *
 * CARA PAKAI:
 * 1. Buka Google Spreadsheet yang berisi data buku (13.253 baris).
 * 2. Pastikan letak baris header sesuai dengan HEADER_ROW di bawah.
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

const SHEET_NAME = 'Sheet1'; // ganti sesuai nama tab/sheet di spreadsheet-mu
const CACHE_SECONDS = 300; // cache 5 menit supaya respons lebih cepat & hemat kuota

// Baris ke berapa header berada di spreadsheet kamu (bukan baris 1, tapi baris 2)
const HEADER_ROW = 2;

// Pemetaan: nama kolom ASLI di spreadsheet (huruf besar/kecil bebas)
// -> nama internal yang dipakai kode di bawah.
// Sesuai kolom di spreadsheet "Katalog Baru Ruang Koleksi Langka":
// NO | NOMOR PANGGIL | DATA BIBLIOGRAFIS | STATUS DI RAK | AKSARA | NOMOR INDUK
const COLUMN_MAP = {
  'no': 'no',                          // nomor urut baris, tidak dipakai sebagai id
  'nomor panggil': 'lokasiRak',
  'data bibliografis': 'judul',
  'status di rak': 'kondisi',
  'aksara': 'aksara',
  'nomor induk': 'nomorInduk'
};

// Field yang boleh dipakai untuk pencarian & sorting (harus salah satu nilai
// di COLUMN_MAP di atas). Dipakai oleh handleList() di bawah.
const SEARCHABLE_FIELDS = ['judul', 'lokasiRak', 'aksara', 'nomorInduk'];

// ============================================================================
// KONFIGURASI ADMIN
// Diisi lewat menu Project Settings > Script Properties di editor Apps Script
// (BUKAN ditulis langsung di kode ini), supaya tidak ikut ter-commit ke GitHub:
//   GOOGLE_CLIENT_ID -> Client ID OAuth dari Google Cloud Console
//   ADMIN_EMAILS     -> daftar email admin dipisah koma, mis: "a@gmail.com,b@gmail.com"
// ============================================================================

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
  if (values.length < HEADER_ROW + 1) return [];

  // Ambil header dari HEADER_ROW, lalu terjemahkan lewat COLUMN_MAP
  const rawHeaders = values[HEADER_ROW - 1].map((h) => String(h).trim().toLowerCase());
  const headers = rawHeaders.map((h) => COLUMN_MAP[h] || h);

  const rows = [];
  for (let i = HEADER_ROW; i < values.length; i++) {
    const row = values[i];
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h] = row[idx] !== undefined && row[idx] !== null ? row[idx] : '';
    });
    if (!obj.judul) continue;

    if (!obj.id) obj.id = String(i);
    obj.id = String(obj.id);
    if (obj.tahun instanceof Date) {
      obj.tahun = obj.tahun.getFullYear();
    }
    rows.push(obj);
  }

  try {
    const json = JSON.stringify(rows);
    const chunkSize = 90000;
    const chunks = [];
    for (let i = 0; i < json.length; i += chunkSize) {
      chunks.push(json.slice(i, i + chunkSize));
    }
    cache.put('rl_all_rows_count', String(chunks.length), CACHE_SECONDS);
    chunks.forEach((chunk, idx) => cache.put('rl_all_rows_' + idx, chunk, CACHE_SECONDS));
    if (chunks.length === 1) {
      cache.put('rl_all_rows', json, CACHE_SECONDS);
    }
  } catch (e) {}

  return rows;
}

function handleList(params) {
  const rows = getAllRows();

  const search = String(params.search || '').toLowerCase().trim();
  const searchField = String(params.searchField || 'semua');
  const sortBy = String(params.sortBy || 'judul');
  const sortDir = String(params.sortDir || 'asc');
  const page = Math.max(1, parseInt(params.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(params.limit, 10) || 20));

  let filtered = rows;
  if (search) {
    if (searchField !== 'semua' && SEARCHABLE_FIELDS.indexOf(searchField) !== -1) {
      // Cari hanya di satu kolom yang dipilih user (Judul / Nomor Panggil / Aksara / Nomor Induk)
      filtered = filtered.filter((r) => {
        const value = String(r[searchField] || '').toLowerCase();
        return value.indexOf(search) !== -1;
      });
    } else {
      // 'semua': cari di seluruh kolom yang bisa dicari
      filtered = filtered.filter((r) => {
        return SEARCHABLE_FIELDS.some((f) => String(r[f] || '').toLowerCase().indexOf(search) !== -1);
      });
    }
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
  return { items: rows.slice(0, 3) };
}

/**
 * ============================================================================
 * BAGIAN ADMIN — aksi TULIS (tambah/ubah/hapus koleksi)
 * ============================================================================
 */

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const action = body.action;

    let result;
    switch (action) {
      case 'whoami': {
        const claims = requireAdmin(body.idToken);
        result = { authorized: true, email: claims.email, name: claims.name, picture: claims.picture };
        break;
      }
      case 'create': {
        requireAdmin(body.idToken);
        result = handleCreate(body.book);
        break;
      }
      case 'update': {
        requireAdmin(body.idToken);
        result = handleUpdate(body.id, body.book);
        break;
      }
      case 'delete': {
        requireAdmin(body.idToken);
        result = handleDelete(body.id);
        break;
      }
      default:
        result = { error: 'Aksi tidak dikenali: ' + action };
    }
    return jsonOutput(result);
  } catch (err) {
    return jsonOutput({ error: String(err && err.message ? err.message : err) });
  }
}

function getScriptProp(key) {
  return PropertiesService.getScriptProperties().getProperty(key) || '';
}

function verifyGoogleIdToken(idToken) {
  if (!idToken) return null;
  const res = UrlFetchApp.fetch(
    'https://oauth2.googleapis.com/tokeninfo?id_token=' + encodeURIComponent(idToken),
    { muteHttpExceptions: true }
  );
  if (res.getResponseCode() !== 200) return null;
  const data = JSON.parse(res.getContentText());
  const clientId = getScriptProp('GOOGLE_CLIENT_ID');
  if (clientId && data.aud !== clientId) return null;
  return data;
}

function isEmailWhitelisted(email) {
  const list = getScriptProp('ADMIN_EMAILS')
    .split(',')
    .map(function (s) { return s.trim().toLowerCase(); })
    .filter(Boolean);
  return list.indexOf(String(email).toLowerCase()) !== -1;
}

function requireAdmin(idToken) {
  const claims = verifyGoogleIdToken(idToken);
  if (!claims || !claims.email) {
    throw new Error('Token Google tidak valid atau kedaluwarsa. Silakan login ulang.');
  }
  if (!isEmailWhitelisted(claims.email)) {
    throw new Error('Email ' + claims.email + ' tidak terdaftar sebagai admin.');
  }
  return claims;
}

function getSheet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error('Sheet dengan nama "' + SHEET_NAME + '" tidak ditemukan.');
  return sheet;
}

function getHeaders(sheet) {
  // Sesuaikan pembacaan header agar mengambil dari HEADER_ROW (baris 2) lalu dipetakan
  const rawHeaders = sheet
    .getRange(HEADER_ROW, 1, 1, sheet.getLastColumn())
    .getValues()[0]
    .map(function (h) { return String(h).trim().toLowerCase(); });
  return rawHeaders.map(function (h) { return COLUMN_MAP[h] || h; });
}

function invalidateCache() {
  const cache = CacheService.getScriptCache();
  cache.remove('rl_all_rows');
  const countStr = cache.get('rl_all_rows_count');
  if (countStr) {
    const count = parseInt(countStr, 10);
    for (let i = 0; i < count; i++) cache.remove('rl_all_rows_' + i);
    cache.remove('rl_all_rows_count');
  }
}

function handleCreate(book) {
  if (!book || !book.judul) throw new Error('Judul buku wajib diisi.');
  const sheet = getSheet();
  const headers = getHeaders(sheet);
  const hasIdCol = headers.indexOf('id') !== -1;
  const newId = String(Date.now());

  const row = headers.map(function (h) {
    if (h === 'id') return newId;
    return book[h] !== undefined ? book[h] : '';
  });
  sheet.appendRow(row);
  invalidateCache();
  return { item: Object.assign({ id: hasIdCol ? newId : newId }, book) };
}

function findRowById(sheet, headers, id) {
  const idCol = headers.indexOf('id');
  const lastRow = sheet.getLastRow();
  const startRow = HEADER_ROW + 1; // Data dimulai setelah HEADER_ROW
  
  if (idCol !== -1 && lastRow >= startRow) {
    const ids = sheet.getRange(startRow, idCol + 1, lastRow - startRow + 1, 1).getValues();
    for (let i = 0; i < ids.length; i++) {
      if (ids[i][0] !== '' && String(ids[i][0]) === String(id)) return i + startRow;
    }
  }
  
  const rowNum = parseInt(id, 10) + 1;
  return rowNum >= startRow && rowNum <= lastRow ? rowNum : -1;
}

function handleUpdate(id, book) {
  if (!id) throw new Error('ID buku wajib diisi.');
  const sheet = getSheet();
  const headers = getHeaders(sheet);
  const rowNum = findRowById(sheet, headers, id);
  if (rowNum === -1) throw new Error('Buku dengan id "' + id + '" tidak ditemukan.');

  const row = headers.map(function (h) {
    if (h === 'id') return id;
    return book[h] !== undefined ? book[h] : '';
  });
  sheet.getRange(rowNum, 1, 1, headers.length).setValues([row]);
  invalidateCache();
  return { item: Object.assign({ id: String(id) }, book) };
}

function handleDelete(id) {
  if (!id) throw new Error('ID buku wajib diisi.');
  const sheet = getSheet();
  const headers = getHeaders(sheet);
  const rowNum = findRowById(sheet, headers, id);
  if (rowNum === -1) throw new Error('Buku dengan id "' + id + '" tidak ditemukan.');
  sheet.deleteRow(rowNum);
  invalidateCache();
  return { deleted: true, id: String(id) };
}