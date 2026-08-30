/**
 * ============================================================================
 * Code.gs — Backend API untuk Katalog Ruang Langka
 * ============================================================================
 * Script ini dijalankan di Google Apps Script dan berfungsi sebagai API
 * gratis yang membaca data langsung dari Google Spreadsheet.
 *
 * CARA PAKAI:
 * 1. Buka Google Spreadsheet yang berisi data buku (13.253 baris).
 * 2. Pastikan letak baris header sesuai dengan HEADER_ROW di bawah (di
 *    spreadsheet-mu, baris 1 kosong dan header ada di baris 2).
 * 3. Buka menu Extensions > Apps Script pada spreadsheet tersebut.
 * 4. Hapus isi default, lalu tempel seluruh isi file ini.
 * 5. Klik Deploy > New deployment (atau edit deployment yang sudah ada > New version).
 *      - Pilih tipe: "Web app"
 *      - Execute as: Me
 *      - Who has access: Anyone
 * 6. Salin URL Web App yang berakhiran /exec (BUKAN /dev — /dev tidak mendukung CORS).
 * 7. Tempelkan URL tersebut sebagai VITE_API_URL pada file .env di project React.
 *
 * CATATAN PENTING:
 * - Setiap kali admin mengubah/menambah baris di Spreadsheet, API ini otomatis
 *   membaca data terbaru — TIDAK PERLU deploy ulang (hanya menunggu cache
 *   maksimal 5 menit, lihat CACHE_SECONDS).
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
// NO | NOMOR PANGGIL | DATA BIBLIOGRAFIS | STATUS DI RAK | AKSARA | NOMOR
//
// PENTING: key di kiri harus SAMA PERSIS (setelah di-trim & lowercase) dengan
// teks header asli di baris HEADER_ROW pada spreadsheet. Kalau tidak match
// persis, kolom itu TIDAK ter-mapping (gagal diam-diam) dan field-nya jadi
// kosong di hasil API.
const COLUMN_MAP = {
  'no': 'no',                          // nomor urut baris, tidak dipakai sebagai id
  'nomor panggil': 'lokasiRak',
  'data bibliografis': 'judul',
  'status di rak': 'kondisi',
  'aksara': 'aksara',
  'nomor induk': 'nomorInduk'          // dikonfirmasi lewat action=debug: header aslinya "NOMOR INDUK"
};

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
      case 'debug':
        result = handleDebug();
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

/**
 * Aksi debug sementara — buka /exec?action=debug di browser untuk lihat
 * bagaimana script ini benar-benar membaca spreadsheet-mu (nama file, nama
 * sheet, jumlah baris, dan hasil pemetaan header). Berguna kalau total selalu
 * 0 padahal data sudah ada. Boleh dihapus kalau sudah tidak dibutuhkan.
 */
function handleDebug() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) return { error: 'Sheet tidak ditemukan', spreadsheetName: ss.getName() };

  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  const rawHeaders = sheet.getRange(HEADER_ROW, 1, 1, lastCol).getValues()[0]
    .map((h) => String(h).trim().toLowerCase());
  const mappedHeaders = rawHeaders.map((h) => COLUMN_MAP[h] || h);
  const sampleRow = lastRow > HEADER_ROW
    ? sheet.getRange(HEADER_ROW + 1, 1, 1, lastCol).getValues()[0]
    : [];

  return {
    spreadsheetName: ss.getName(),
    sheetName: sheet.getName(),
    lastRow,
    lastCol,
    rawHeaders,
    mappedHeaders,
    sampleRow,
  };
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

  // Ambil header dari HEADER_ROW (bukan selalu baris 1), lalu terjemahkan lewat COLUMN_MAP
  const rawHeaders = values[HEADER_ROW - 1].map((h) => String(h).trim().toLowerCase());
  const headers = rawHeaders.map((h) => COLUMN_MAP[h] || h);

  const rows = [];
  for (let i = HEADER_ROW; i < values.length; i++) {
    const row = values[i];
    const obj = {};
    headers.forEach((h, idx) => {
      let val = row[idx] !== undefined && row[idx] !== null ? row[idx] : '';
      // Buang newline/spasi tersembunyi di awal-akhir teks (mis. dari Alt+Enter
      // di sel spreadsheet, atau indentasi manual). Kalau tidak dibuang, sorting
      // jadi rusak karena karakter newline/spasi punya nilai lebih kecil dari
      // huruf, jadi selalu "menang" duluan meski tidak kelihatan di tampilan.
      if (typeof val === 'string') val = val.trim().replace(/\s+/g, ' ');
      obj[h] = val;
    });
    if (!obj.judul) continue;

    if (!obj.id) obj.id = String(i); // fallback id = nomor baris data
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
    if (chunks.length === 1) {
      cache.put('rl_all_rows', json, CACHE_SECONDS);
    }
  } catch (e) {
    // Jika gagal cache (dataset sangat besar), lanjut tanpa cache.
  }

  return rows;
}

/**
 * Sebagian judul di spreadsheet ternyata memakai huruf YUNANI yang mirip
 * huruf Latin (mis. "Κ" Kappa Yunani, bukan "K" Latin biasa) — kemungkinan
 * sisa dari copy-paste dokumen lama. Secara visual identik, tapi secara
 * Unicode beda kode, sehingga sorting jadi kacau (huruf Yunani dikelompokkan
 * terpisah dari huruf Latin). Fungsi ini menerjemahkan huruf Yunani yang
 * mirip itu ke Latin HANYA untuk keperluan perbandingan/sorting — teks judul
 * asli yang ditampilkan ke user tidak diubah sama sekali.
 */
function normalizeForSort(str) {
  const GREEK_TO_LATIN = {
    'Α': 'A', 'Β': 'B', 'Ε': 'E', 'Ζ': 'Z', 'Η': 'H', 'Ι': 'I', 'Κ': 'K',
    'Μ': 'M', 'Ν': 'N', 'Ο': 'O', 'Ρ': 'P', 'Τ': 'T', 'Υ': 'Y', 'Χ': 'X',
    'α': 'a', 'β': 'b', 'ε': 'e', 'ζ': 'z', 'η': 'h', 'ι': 'i', 'κ': 'k',
    'μ': 'm', 'ν': 'n', 'ο': 'o', 'ρ': 'p', 'τ': 't', 'υ': 'y', 'χ': 'x',
  };
  return String(str).replace(/[ΑΒΕΖΗΙΚΜΝΟΡΤΥΧαβεζηικμνορτυχ]/g, (ch) => GREEK_TO_LATIN[ch] || ch);
}

function handleList(params) {
  const rows = getAllRows();

  const search = String(params.search || '').toLowerCase().trim();
  const searchField = String(params.searchField || 'semua').trim();
  const kategori = String(params.kategori || '').trim();
  const sortBy = String(params.sortBy || 'judul');
  const sortDir = String(params.sortDir || 'asc');
  const page = Math.max(1, parseInt(params.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(params.limit, 10) || 20));

  let filtered = rows;
  if (search) {
    filtered = filtered.filter((r) => {
      if (searchField && searchField !== 'semua') {
        // Cari cuma di 1 field tertentu (mis. hanya "lokasiRak" atau "aksara")
        const val = String(r[searchField] !== undefined ? r[searchField] : '').toLowerCase();
        return val.indexOf(search) !== -1;
      }
      // "Semua Field": cari di semua kolom teks sekaligus
      return Object.keys(r).some((key) => {
        const val = String(r[key] !== undefined ? r[key] : '').toLowerCase();
        return val.indexOf(search) !== -1;
      });
    });
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
      cmp = normalizeForSort(String(av)).localeCompare(normalizeForSort(String(bv)), 'id', { numeric: true });
    }
    return sortDir === 'desc' ? -cmp : cmp;
  });

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const items = filtered.slice(start, start + limit);

  return {
    items,
    total,
    page,
    totalPages,
    // --- DEBUG SEMENTARA, hapus setelah sorting terbukti benar ---
    _debugSortBy: sortBy,
    _debugSortDir: sortDir,
    _debugFirstJudul: items.length ? items[0].judul : null,
    _debugLastJudul: items.length ? items[items.length - 1].judul : null,
  };
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
 * Semua request tulis masuk lewat doPost(e), dikirim sebagai JSON di dalam
 * e.postData.contents (bukan lewat parameter URL seperti doGet), dan WAJIB
 * menyertakan idToken Google yang diverifikasi ulang di sini sebelum
 * Spreadsheet disentuh sama sekali.
 *
 * Catatan CORS: Apps Script Web App otomatis mengizinkan cross-origin untuk
 * "simple request" (Content-Type text/plain, tanpa header custom). Karena itu
 * front-end mengirim POST dengan Content-Type text/plain lalu isi body-nya
 * di-parse manual sebagai JSON di bawah ini — supaya tidak kena preflight
 * OPTIONS yang tidak ditangani Apps Script.
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

/**
 * Memverifikasi idToken Google ke server Google sendiri (bukan cuma dibaca
 * mentah-mentah) — memastikan token itu asli dan belum kedaluwarsa, serta
 * memang diterbitkan untuk aplikasi kita (cocok dengan GOOGLE_CLIENT_ID).
 */
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
  return data; // berisi email, name, picture, exp, dll — sudah diverifikasi asli oleh Google
}

function isEmailWhitelisted(email) {
  const list = getScriptProp('ADMIN_EMAILS')
    .split(',')
    .map(function (s) { return s.trim().toLowerCase(); })
    .filter(Boolean);
  return list.indexOf(String(email).toLowerCase()) !== -1;
}

/** Melempar error kalau token tidak valid ATAU emailnya tidak ada di whitelist. */
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

/** Sesuaikan pembacaan header agar mengambil dari HEADER_ROW, lalu dipetakan lewat COLUMN_MAP. */
function getHeaders(sheet) {
  const rawHeaders = sheet
    .getRange(HEADER_ROW, 1, 1, sheet.getLastColumn())
    .getValues()[0]
    .map(function (h) { return String(h).trim().toLowerCase(); });
  return rawHeaders.map(function (h) { return COLUMN_MAP[h] || h; });
}

/** Hapus cache supaya perubahan langsung terlihat di request GET berikutnya. */
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
  // ID baru dibuat dari timestamp supaya selalu unik dan stabil walau ada
  // baris lain yang dihapus/ditambah setelahnya.
  const newId = String(Date.now());

  const row = headers.map(function (h) {
    if (h === 'id') return newId;
    return book[h] !== undefined ? book[h] : '';
  });
  sheet.appendRow(row);
  invalidateCache();
  return { item: Object.assign({ id: hasIdCol ? newId : newId }, book) };
}

/**
 * Mencari nomor baris di sheet berdasarkan id. Kalau kolom "id" ada di
 * header, dicocokkan langsung. Kalau tidak ada / kosong, fallback ke asumsi
 * id = nomor urut baris data setelah HEADER_ROW.
 */
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
  // fallback posisional
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