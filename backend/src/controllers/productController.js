const productService = require("../services/productService");
const { successResponse, errorResponse, paginatedResponse } = require("../utils/response");

const index = async (req, res, next) => {
  try {
    const { rows, meta } = await productService.getAll(req.query);
    return paginatedResponse(res, rows, meta, "Data produk berhasil diambil");
  } catch (err) {
    next(err);
  }
};

const show = async (req, res, next) => {
  try {
    const data = await productService.getById(req.params.id);
    if (!data) return errorResponse(res, "Produk tidak ditemukan", 404);
    return successResponse(res, data, "Detail produk berhasil diambil");
  } catch (err) {
    next(err);
  }
};

const store = async (req, res, next) => {
  try {
    const data = await productService.create(req.body);
    return successResponse(res, data, "Produk berhasil ditambahkan", 201);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const existing = await productService.getById(req.params.id);
    if (!existing) return errorResponse(res, "Produk tidak ditemukan", 404);
    const data = await productService.update(req.params.id, req.body);
    return successResponse(res, data, "Produk berhasil diperbarui");
  } catch (err) {
    next(err);
  }
};

const destroy = async (req, res, next) => {
  try {
    const existing = await productService.getById(req.params.id);
    if (!existing) return errorResponse(res, "Produk tidak ditemukan", 404);
    await productService.remove(req.params.id);
    return successResponse(res, null, "Produk berhasil dihapus");
  } catch (err) {
    next(err);
  }
};

module.exports = { index, show, store, update, destroy };
