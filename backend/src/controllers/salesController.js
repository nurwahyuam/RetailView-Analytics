const salesService = require("../services/salesService");
const { successResponse, errorResponse, paginatedResponse } = require("../utils/response");

const index = async (req, res, next) => {
  try {
    const { rows, meta } = await salesService.getAll(req.query);
    return paginatedResponse(res, rows, meta, "Data penjualan berhasil diambil");
  } catch (err) {
    next(err);
  }
};

const show = async (req, res, next) => {
  try {
    const data = await salesService.getById(req.params.id);
    if (!data) return errorResponse(res, "Data penjualan tidak ditemukan", 404);
    return successResponse(res, data, "Detail penjualan berhasil diambil");
  } catch (err) {
    next(err);
  }
};

const store = async (req, res, next) => {
  try {
    const data = await salesService.create(req.body);
    return successResponse(res, data, "Penjualan berhasil ditambahkan", 201);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const existing = await salesService.getById(req.params.id);
    if (!existing) return errorResponse(res, "Data penjualan tidak ditemukan", 404);
    const data = await salesService.update(req.params.id, req.body);
    return successResponse(res, data, "Penjualan berhasil diperbarui");
  } catch (err) {
    next(err);
  }
};

const destroy = async (req, res, next) => {
  try {
    const existing = await salesService.getById(req.params.id);
    if (!existing) return errorResponse(res, "Data penjualan tidak ditemukan", 404);
    await salesService.remove(req.params.id);
    return successResponse(res, null, "Penjualan berhasil dihapus");
  } catch (err) {
    next(err);
  }
};

module.exports = { index, show, store, update, destroy };
