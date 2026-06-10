const { errorResponse } = require("../utils/response");

// Product
const validateProduct = (req, res, next) => {
  const { product_code, product_name, category, sub_category, brand, unit, cost_price, selling_price } = req.body;
  const errors = [];

  if (!product_code || String(product_code).trim() === "") errors.push("Kode Produk wajib diisi");
  if (!product_name || String(product_name).trim() === "") errors.push("Nama Produk wajib diisi");
  if (!category || String(category).trim() === "") errors.push("Kategori wajib diisi");
  if (!sub_category || String(sub_category).trim() === "") errors.push("Sub Kategori wajib diisi");
  if (!brand || String(brand).trim() === "") errors.push("Brand wajib diisi");
  if (!unit || String(unit).trim() === "") errors.push("Unit wajib diisi");
  if (!cost_price || String(cost_price).trim() === "") errors.push("Harga Modal wajib diisi");
  if (!selling_price || String(selling_price).trim() === "") errors.push("Harga Jual wajib diisi");

  if (errors.length > 0) {
    return errorResponse(res, "Validasi Gagal", 422, errors);
  }
  next();
};

// Customer
const validateCustomer = (req, res, next) => {
  const { customer_code, customer_name, city, province } = req.body;
  const errors = [];

  if (!customer_code || String(customer_code).trim() === "") errors.push("customer_code wajib diisi");
  if (!customer_name || String(customer_name).trim() === "") errors.push("customer_name wajib diisi");
  if (!city || String(city).trim() === "") errors.push("city wajib diisi");
  if (!province || String(province).trim() === "") errors.push("province wajib diisi");

  if (errors.length > 0) return errorResponse(res, "Validasi gagal", 422, errors);
  next();
};

// Store
const validateStore = (req, res, next) => {
  const { store_code, store_name, city, province, region } = req.body;
  const errors = [];

  if (!store_code || String(store_code).trim() === "") errors.push("store_code wajib diisi");
  if (!store_name || String(store_name).trim() === "") errors.push("store_name wajib diisi");
  if (!city || String(city).trim() === "") errors.push("city wajib diisi");
  if (!province || String(province).trim() === "") errors.push("province wajib diisi");
  if (!region || String(region).trim() === "") errors.push("region wajib diisi");

  if (errors.length > 0) return errorResponse(res, "Validasi gagal", 422, errors);
  next();
};

// Time
const validateTime = (req, res, next) => {
  const { full_date } = req.body;
  const errors = [];

  if (!full_date) {
    errors.push("full_date wajib diisi (format: YYYY-MM-DD)");
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(full_date)) {
    errors.push("full_date harus berformat YYYY-MM-DD");
  }

  if (errors.length > 0) return errorResponse(res, "Validasi gagal", 422, errors);
  next();
};

// Sales
const validateSales = (req, res, next) => {
  const { invoice_no, time_id, product_id, customer_id, store_id, quantity, unit_price } = req.body;
  const errors = [];

  if (!invoice_no || String(invoice_no).trim() === "") errors.push("invoice_no wajib diisi");
  if (!time_id || isNaN(Number(time_id))) errors.push("time_id harus berupa angka");
  if (!product_id || isNaN(Number(product_id))) errors.push("product_id harus berupa angka");
  if (!customer_id || isNaN(Number(customer_id))) errors.push("customer_id harus berupa angka");
  if (!store_id || isNaN(Number(store_id))) errors.push("store_id harus berupa angka");
  if (!quantity || isNaN(Number(quantity)) || Number(quantity) < 1) errors.push("quantity harus angka >= 1");
  if (!unit_price || isNaN(Number(unit_price)) || Number(unit_price) < 0) errors.push("unit_price harus angka >= 0");

  if (errors.length > 0) return errorResponse(res, "Validasi gagal", 422, errors);
  next();
};

module.exports = { validateProduct, validateCustomer, validateStore, validateTime, validateSales };
