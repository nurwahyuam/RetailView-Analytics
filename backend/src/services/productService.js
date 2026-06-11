const { pool } = require("../config/db");
const { getPagination, buildMeta } = require("../utils/pagination");

const getAll = async (query) => {
  const { page, limit, offset } = getPagination(query);
  const { search, kategori } = query;

  let where = "WHERE 1=1";
  const params = [];

  if (search) {
    where += " AND (nama_produk LIKE ? OR kode_produk LIKE ?)";
    params.push(`%${search}%`, `%${search}%`);
  }
  if (kategori) {
    where += " AND kategori = ?";
    params.push(kategori);
  }

  const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total FROM dim_produk ${where}`, params);
  const [rows] = await pool.query(`SELECT * FROM dim_produk ${where} ORDER BY id_produk DESC LIMIT ? OFFSET ?`, [...params, limit, offset]);
  return { rows, meta: buildMeta(total, page, limit) };
};

const getById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM dim_produk WHERE id_produk = ?", [id]);
  return rows[0] || null;
};

const create = async (body) => {
  const { kode_produk, nama_produk, kategori, harga } = body;
  const [result] = await pool.query("INSERT INTO dim_produk (kode_produk, nama_produk, kategori, harga) VALUES (?, ?, ?, ?)", [kode_produk, nama_produk, kategori, harga]);
  return getById(result.insertId);
};

const update = async (id, body) => {
  const { kode_produk, nama_produk, kategori, harga } = body;
  await pool.query("UPDATE dim_produk SET kode_produk=?, nama_produk=?, kategori=?, harga=? WHERE id_produk=?", [kode_produk, nama_produk, kategori, harga, id]);
  return getById(id);
};

const remove = async (id) => {
  const [result] = await pool.query("DELETE FROM dim_produk WHERE id_produk = ?", [id]);
  return result.affectedRows;
};

module.exports = { getAll, getById, create, update, remove };
