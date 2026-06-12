const { pool } = require("../config/db");
const { getPagination, buildMeta } = require("../utils/pagination");

const BULAN_NAMA = ["", "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

const getAll = async (query) => {
  const { page, limit, offset } = getPagination(query);
  const { tahun, bulan } = query;

  let where = "WHERE 1=1";
  const params = [];

  if (tahun) {
    where += " AND tahun = ?";
    params.push(tahun);
  }
  if (bulan) {
    where += " AND bulan = ?";
    params.push(bulan);
  }

  const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total FROM dim_waktu ${where}`, params);
  const [rows] = await pool.query(`SELECT * FROM dim_waktu ${where} ORDER BY id_waktu DESC LIMIT ? OFFSET ?`, [...params, limit, offset]);
  return { rows, meta: buildMeta(total, page, limit) };
};

const getById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM dim_waktu WHERE id_waktu = ?", [id]);
  return rows[0] || null;
};

const create = async (body) => {
  const { tanggal } = body;
  const d = new Date(tanggal);
  const tahun = d.getFullYear();
  const bulan = d.getMonth() + 1;
  const bulan_nama = BULAN_NAMA[bulan];
  const kuartal = Math.ceil(bulan / 3);

  const [result] = await pool.query("INSERT INTO dim_waktu (tanggal, tahun, bulan, bulan_nama, kuartal) VALUES (?, ?, ?, ?, ?)", [tanggal, tahun, bulan, bulan_nama, kuartal]);
  return getById(result.insertId);
};

const update = async (id, body) => {
  const { tanggal } = body;
  const d = new Date(tanggal);
  const tahun = d.getFullYear();
  const bulan = d.getMonth() + 1;
  const bulan_nama = BULAN_NAMA[bulan];
  const kuartal = Math.ceil(bulan / 3);

  await pool.query("UPDATE dim_waktu SET tanggal=?, tahun=?, bulan=?, bulan_nama=?, kuartal=? WHERE id_waktu=?", [tanggal, tahun, bulan, bulan_nama, kuartal, id]);
  return getById(id);
};

const remove = async (id) => {
  const [result] = await pool.query("DELETE FROM dim_waktu WHERE id_waktu = ?", [id]);
  return result.affectedRows;
};

module.exports = { getAll, getById, create, update, remove };
