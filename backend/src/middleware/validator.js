const { errorResponse } = require("../utils/response");

// Product
const validateProduct = (req, res, next) => {
  const { kode_produk, nama_produk, kategori, harga } = req.body;
  const errors = [];
  if (!kode_produk || String(kode_produk).trim() === "") errors.push("kode_produk wajib diisi");
  if (!nama_produk || String(nama_produk).trim() === "") errors.push("nama_produk wajib diisi");
  if (!kategori || String(kategori).trim() === "") errors.push("kategori wajib diisi");
  if (harga === undefined || isNaN(Number(harga))) errors.push("harga harus berupa angka");
  if (errors.length) return errorResponse(res, "Validasi gagal", 422, errors);
  next();
};

// Customer
const validateCustomer = (req, res, next) => {
  const { kode_pelanggan, nama_pelanggan, kota } = req.body;
  const errors = [];
  if (!kode_pelanggan || String(kode_pelanggan).trim() === "") errors.push("kode_pelanggan wajib diisi");
  if (!nama_pelanggan || String(nama_pelanggan).trim() === "") errors.push("nama_pelanggan wajib diisi");
  if (!kota || String(kota).trim() === "") errors.push("kota wajib diisi");
  if (errors.length) return errorResponse(res, "Validasi gagal", 422, errors);
  next();
};

// Time
const validateTime = (req, res, next) => {
  const { tanggal } = req.body;
  const errors = [];
  if (!tanggal) {
    errors.push("tanggal wajib diisi (format: YYYY-MM-DD)");
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(tanggal)) {
    errors.push("tanggal harus berformat YYYY-MM-DD");
  }
  if (errors.length) return errorResponse(res, "Validasi gagal", 422, errors);
  next();
};

// Sales
const validateSales = (req, res, next) => {
  const { id_produk, id_pelanggan, tanggal, jumlah, harga_satuan } = req.body;
  const errors = [];
  if (!id_produk || isNaN(Number(id_produk))) errors.push("id_produk harus berupa angka");
  if (!id_pelanggan || isNaN(Number(id_pelanggan))) errors.push("id_pelanggan harus berupa angka");
  if (!tanggal) errors.push("tanggal wajib diisi (format: YYYY-MM-DD)");
  else if (!/^\d{4}-\d{2}-\d{2}$/.test(tanggal)) errors.push("tanggal harus berformat YYYY-MM-DD");
  if (!jumlah || isNaN(Number(jumlah)) || Number(jumlah) < 1) errors.push("jumlah harus angka >= 1");
  if (!harga_satuan || isNaN(Number(harga_satuan))) errors.push("harga_satuan harus berupa angka");
  if (errors.length) return errorResponse(res, "Validasi gagal", 422, errors);
  next();
};

module.exports = { validateProduct, validateCustomer, validateTime, validateSales };
