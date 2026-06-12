const timeService = require("../services/timeService");
const { successResponse, errorResponse, paginatedResponse } = require("../utils/response");

const index = async (req, res, next) => {
  try {
    const { rows, meta } = await timeService.getAll(req.query);
    return paginatedResponse(res, rows, meta, "Data waktu berhasil diambil");
  } catch (err) {
    next(err);
  }
};

const show = async (req, res, next) => {
  try {
    const data = await timeService.getById(req.params.id);
    if (!data) return errorResponse(res, "Waktu tidak ditemukan", 404);
    return successResponse(res, data, "Detail waktu berhasil diambil");
  } catch (err) {
    next(err);
  }
};

const store = async (req, res, next) => {
  try {
    const data = await timeService.create(req.body);
    return successResponse(res, data, "Waktu berhasil ditambahkan", 201);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const existing = await timeService.getById(req.params.id);
    if (!existing) return errorResponse(res, "Waktu tidak ditemukan", 404);
    const data = await timeService.update(req.params.id, req.body);
    return successResponse(res, data, "Waktu berhasil diperbarui");
  } catch (err) {
    next(err);
  }
};

const destroy = async (req, res, next) => {
  try {
    const existing = await timeService.getById(req.params.id);
    if (!existing) return errorResponse(res, "Waktu tidak ditemukan", 404);
    await timeService.remove(req.params.id);
    return successResponse(res, null, "Waktu berhasil dihapus");
  } catch (err) {
    next(err);
  }
};

module.exports = { index, show, store, update, destroy };
