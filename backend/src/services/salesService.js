const { pool } = require("../config/db");
const { getPagination, buildMeta } = require("../utils/pagination");

const SELECT_JOIN = `
  SELECT
    fp.id_penjualan,
    dp.id_produk,
    dp.kode_produk,
    dp.nama_produk,
    dp.kategori,
    dc.id_pelanggan,
    dc.kode_pelanggan,
    dc.nama_pelanggan,
    dc.kota,
    dw.id_waktu,
    dw.tanggal,
    dw.bulan_nama,
    dw.tahun,
    fp.jumlah,
    fp.harga_satuan,
    fp.total_harga
  FROM fact_penjualan fp
  JOIN dim_produk    dp ON fp.id_produk    = dp.id_produk
  JOIN dim_pelanggan dc ON fp.id_pelanggan = dc.id_pelanggan
  JOIN dim_waktu     dw ON fp.id_waktu     = dw.id_waktu
`;

const getAll = async (query) => {
  const { page, limit, offset } = getPagination(query);
  const { id_produk, id_pelanggan, id_waktu, tahun, bulan } = query;

  let where = "WHERE 1=1";
  const params = [];

  if (id_produk) {
    where += " AND fp.id_produk = ?";
    params.push(id_produk);
  }
  if (id_pelanggan) {
    where += " AND fp.id_pelanggan = ?";
    params.push(id_pelanggan);
  }
  if (id_waktu) {
    where += " AND fp.id_waktu = ?";
    params.push(id_waktu);
  }
  if (tahun) {
    where += " AND dw.tahun = ?";
    params.push(tahun);
  }
  if (bulan) {
    where += " AND dw.bulan = ?";
    params.push(bulan);
  }

  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) AS total
     FROM fact_penjualan fp
     JOIN dim_waktu dw ON fp.id_waktu = dw.id_waktu
     ${where}`,
    params,
  );
  const [rows] = await pool.query(`${SELECT_JOIN} ${where} ORDER BY fp.id_penjualan DESC LIMIT ? OFFSET ?`, [...params, limit, offset]);
  return { rows, meta: buildMeta(total, page, limit) };
};

const getById = async (id) => {
  const [rows] = await pool.query(`${SELECT_JOIN} WHERE fp.id_penjualan = ?`, [id]);
  return rows[0] || null;
};

const create = async (body) => {
  const { id_produk, id_pelanggan, tanggal, jumlah, harga_satuan } = body;

  const [[produk]] = await pool.query("SELECT * FROM dim_produk WHERE id_produk = ?", [id_produk]);
  if (!produk) {
    throw new Error("Produk tidak ditemukan");
  }
  if (Number(produk.harga) !== Number(harga_satuan)) {
    throw new Error("Harga satuan tidak sesuai dengan harga produk");
  }

  let [[waktu]] = await pool.query("SELECT id_waktu FROM dim_waktu WHERE tanggal = ?", [tanggal]);

  if (!waktu) {
    const d = new Date(tanggal);
    const tahun = d.getFullYear();
    const bulan = d.getMonth() + 1;
    const bulan_nama = ["", "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"][bulan];
    const kuartal = Math.ceil(bulan / 3);

    const [inserted] = await pool.query("INSERT INTO dim_waktu (tanggal, tahun, bulan, bulan_nama, kuartal) VALUES (?, ?, ?, ?, ?)", [tanggal, tahun, bulan, bulan_nama, kuartal]);

    waktu = { id_waktu: inserted.insertId };
  }

  const qty = Number(jumlah);
  const harga = Number(harga_satuan);
  const total = parseFloat((qty * harga).toFixed(2));

  const [result] = await pool.query(
    `INSERT INTO fact_penjualan (id_produk, id_pelanggan, id_waktu, jumlah, harga_satuan, total_harga)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id_produk, id_pelanggan, waktu.id_waktu, qty, harga, total],
  );
  return getById(result.insertId);
};

const update = async (id, body) => {
  const { id_produk, id_pelanggan, tanggal, jumlah, harga_satuan } = body;

  const [[produk]] = await pool.query(
    "SELECT * FROM dim_produk WHERE id_produk = ?",
    [id_produk],
  );

  if (!produk) {
    throw new Error("Produk tidak ditemukan");
  }

  if (Number(produk.harga) !== Number(harga_satuan)) {
    throw new Error("Harga satuan tidak sesuai dengan harga produk");
  }

  let [[waktu]] = await pool.query(
    "SELECT id_waktu FROM dim_waktu WHERE tanggal = ?",
    [tanggal],
  );

  if (!waktu) {
    const d = new Date(tanggal);
    const tahun = d.getFullYear();
    const bulan = d.getMonth() + 1;

    const bulan_nama = [
      "",
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ][bulan];

    const kuartal = Math.ceil(bulan / 3);

    const [inserted] = await pool.query(
      `INSERT INTO dim_waktu
       (tanggal, tahun, bulan, bulan_nama, kuartal)
       VALUES (?, ?, ?, ?, ?)`,
      [tanggal, tahun, bulan, bulan_nama, kuartal],
    );

    waktu = {
      id_waktu: inserted.insertId,
    };
  }

  const qty = Number(jumlah);
  const harga = Number(harga_satuan);
  const total = parseFloat((qty * harga).toFixed(2));

  await pool.query(
    `UPDATE fact_penjualan
     SET id_produk=?, id_pelanggan=?, id_waktu=?, jumlah=?, harga_satuan=?, total_harga=?
     WHERE id_penjualan=?`,
    [id_produk, id_pelanggan, waktu.id_waktu, qty, harga, total, id],
  );

  return getById(id);
};

const remove = async (id) => {
  const [result] = await pool.query("DELETE FROM fact_penjualan WHERE id_penjualan = ?", [id]);
  return result.affectedRows;
};

module.exports = { getAll, getById, create, update, remove };
