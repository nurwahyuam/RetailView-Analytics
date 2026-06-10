const { pool } = require("../config/db");
const { getPagination, buildMeta } = require("../utils/pagination");

const getAll = async (query) => {
  const { page, limit, offset } = getPagination(query);
  const { search, city, province, segment, gender, is_active } = query;

  let where = "WHERE 1=1";
  const params = [];

  if (search) {
    where += " AND (customer_name LIKE ? OR customer_code LIKE ?)";
    params.push(`%${search}%`, `%${search}%`);
  }
  if (city) {
    where += " AND city = ?";
    params.push(city);
  }
  if (province) {
    where += " AND province = ?";
    params.push(province);
  }
  if (segment) {
    where += " AND segment = ?";
    params.push(segment);
  }
  if (gender) {
    where += " AND gender = ?";
    params.push(gender);
  }
  if (is_active !== undefined) {
    where += " AND is_active = ?";
    params.push(is_active);
  }

  const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total FROM dim_customer ${where}`, params);
  const [rows] = await pool.query(`SELECT * FROM dim_customer ${where} ORDER BY customer_id DESC LIMIT ? OFFSET ?`, [...params, limit, offset]);
  return { rows, meta: buildMeta(total, page, limit) };
};

const getById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM dim_customer WHERE customer_id = ?", [id]);
  return rows[0] || null;
};

const create = async (body) => {
  const { customer_code, customer_name, gender = "Lainnya", age_group = "26-35", city, province, segment = "Retail", email = null, phone = null, is_active = 1 } = body;
  const [result] = await pool.query(
    `INSERT INTO dim_customer (customer_code, customer_name, gender, age_group, city, province, segment, email, phone, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [customer_code, customer_name, gender, age_group, city, province, segment, email, phone, is_active],
  );
  return getById(result.insertId);
};

const update = async (id, body) => {
  const { customer_code, customer_name, gender, age_group, city, province, segment, email, phone, is_active } = body;
  await pool.query(
    `UPDATE dim_customer SET customer_code=?, customer_name=?, gender=?, age_group=?, city=?, province=?, segment=?, email=?, phone=?, is_active=?
     WHERE customer_id = ?`,
    [customer_code, customer_name, gender, age_group, city, province, segment, email, phone, is_active, id],
  );
  return getById(id);
};

const remove = async (id) => {
  const [result] = await pool.query("DELETE FROM dim_customer WHERE customer_id = ?", [id]);
  return result.affectedRows;
};

module.exports = { getAll, getById, create, update, remove };
