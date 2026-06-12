const { pool } = require("../config/db");

// Query 1: Total penjualan per produk
const penjualanPerProduk = async (query = {}) => {
  const { kategori } = query;
  let where = 'WHERE 1=1';
  const params = [];
  if (kategori) { where += ' AND dp.kategori = ?'; params.push(kategori); }

  const [rows] = await pool.query(
    `SELECT
       dp.nama_produk,
       dp.kategori,
       SUM(fp.jumlah)      AS total_terjual,
       SUM(fp.total_harga) AS total_pendapatan
     FROM fact_penjualan fp
     JOIN dim_produk dp ON fp.id_produk = dp.id_produk
     ${where}
     GROUP BY dp.id_produk, dp.nama_produk, dp.kategori
     ORDER BY total_pendapatan DESC`,
    params
  );
  return rows;
};

// Query 2: Tren penjualan per bulan
const trendPerBulan = async (query = {}) => {
  const { tahun, kategori } = query;
  let where = 'WHERE 1=1';
  const params = [];
  if (tahun)    { where += ' AND dw.tahun = ?';      params.push(tahun);    }
  if (kategori) { where += ' AND dp.kategori = ?';   params.push(kategori); }

  const [rows] = await pool.query(
    `SELECT
       dw.bulan,
       dw.bulan_nama,
       SUM(fp.total_harga) AS total_pendapatan,
       COUNT(fp.id_penjualan) AS total_transaksi
     FROM fact_penjualan fp
     JOIN dim_waktu   dw ON fp.id_waktu   = dw.id_waktu
     JOIN dim_produk  dp ON fp.id_produk  = dp.id_produk
     ${where}
     GROUP BY dw.bulan, dw.bulan_nama
     ORDER BY dw.bulan ASC`,
    params
  );
  return rows;
};

// Query 3: Pelanggan dengan belanja tertinggi
const topPelanggan = async (query = {}) => {
  const { kategori, limit = 10 } = query;
  let where = 'WHERE 1=1';
  const params = [];
  if (kategori) { where += ' AND dp.kategori = ?'; params.push(kategori); }

  const [rows] = await pool.query(
    `SELECT
       dc.nama_pelanggan,
       dc.kota,
       SUM(fp.total_harga)      AS total_belanja,
       COUNT(fp.id_penjualan)   AS jumlah_transaksi
     FROM fact_penjualan fp
     JOIN dim_pelanggan dc ON fp.id_pelanggan = dc.id_pelanggan
     JOIN dim_produk    dp ON fp.id_produk    = dp.id_produk
     ${where}
     GROUP BY dc.id_pelanggan, dc.nama_pelanggan, dc.kota
     ORDER BY total_belanja DESC
     LIMIT ?`,
    [...params, parseInt(limit)]
  );
  return rows;
};

// Summary card untuk Dashboard
const getSummary = async (query = {}) => {
  const { kategori } = query;
  let where = 'WHERE 1=1';
  const params = [];
  if (kategori) { where += ' AND dp.kategori = ?'; params.push(kategori); }

  const [[row]] = await pool.query(
    `SELECT
       COUNT(fp.id_penjualan)      AS total_transaksi,
       SUM(fp.jumlah)              AS total_item_terjual,
       SUM(fp.total_harga)         AS total_pendapatan,
       COUNT(DISTINCT fp.id_produk)    AS total_produk_aktif,
       COUNT(DISTINCT fp.id_pelanggan) AS total_pelanggan_aktif
     FROM fact_penjualan fp
     JOIN dim_produk dp ON fp.id_produk = dp.id_produk
     ${where}`,
    params
  );
  return row;
};

// Daftar kategori untuk OLAP Slice dropdown
const getKategori = async () => {
  const [rows] = await pool.query(
    'SELECT DISTINCT kategori FROM dim_produk ORDER BY kategori ASC'
  );
  return rows.map(r => r.kategori);
};

module.exports = { penjualanPerProduk, trendPerBulan, topPelanggan, getSummary, getKategori };
