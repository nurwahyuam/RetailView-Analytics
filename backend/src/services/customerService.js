const { pool } = require("../config/db");
const { getPagination, buildMeta } = require("../utils/pagination");

const getAll = async (query) => {
  const { page, limit, offset } = getPagination(query);
  const { search, kota, jenis_kelamin } = query;

  let where = "WHERE 1=1";
  const params = [];

  if (search) {
    where += " AND (nama_pelanggan LIKE ? OR kode_pelanggan LIKE ?)";
    params.push(`%${search}%`, `%${search}%`);
  }
  if (kota) {
    where += " AND kota = ?";
    params.push(kota);
  }
  if (jenis_kelamin) {
    where += " AND jenis_kelamin = ?";
    params.push(jenis_kelamin);
  }

  const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total FROM dim_pelanggan ${where}`, params);
  const [rows] = await pool.query(`SELECT * FROM dim_pelanggan ${where} ORDER BY id_pelanggan DESC LIMIT ? OFFSET ?`, [...params, limit, offset]);
  return { rows, meta: buildMeta(total, page, limit) };
};

const getById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM dim_pelanggan WHERE id_pelanggan = ?", [id]);
  return rows[0] || null;
};

const create = async (body) => {
  const { kode_pelanggan, nama_pelanggan, jenis_kelamin = "L", kota } = body;
  const [result] = await pool.query("INSERT INTO dim_pelanggan (kode_pelanggan, nama_pelanggan, jenis_kelamin, kota) VALUES (?, ?, ?, ?)", [kode_pelanggan, nama_pelanggan, jenis_kelamin, kota]);
  return getById(result.insertId);
};

const update = async (id, body) => {
  const { kode_pelanggan, nama_pelanggan, jenis_kelamin, kota } = body;
  await pool.query("UPDATE dim_pelanggan SET kode_pelanggan=?, nama_pelanggan=?, jenis_kelamin=?, kota=? WHERE id_pelanggan=?", [kode_pelanggan, nama_pelanggan, jenis_kelamin, kota, id]);
  return getById(id);
};

const remove = async (id) => {
  const [result] = await pool.query("DELETE FROM dim_pelanggan WHERE id_pelanggan = ?", [id]);
  return result.affectedRows;
};

module.exports = { getAll, getById, create, update, remove };
