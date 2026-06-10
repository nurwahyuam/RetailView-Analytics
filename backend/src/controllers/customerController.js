const customerService = require('../services/customerService');


const { successResponse, errorResponse, paginatedResponse } = require('../utils/response');

const index = async (req, res, next) => {
  try {
    const { rows, meta } = await customerService.getAll(req.query);
    return paginatedResponse(res, rows, meta, 'Data customer berhasil diambil');
  } catch (err) { next(err); }
};

const show = async (req, res, next) => {
  try {
    const data = await customerService.getById(req.params.id);
    if (!data) return errorResponse(res, 'Customer tidak ditemukan', 404);
    return successResponse(res, data, 'Detail customer berhasil diambil');
  } catch (err) { next(err); }
};

const store = async (req, res, next) => {
  try {
    const data = await customerService.create(req.body);
    return successResponse(res, data, 'Customer berhasil ditambahkan', 201);
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const existing = await customerService.getById(req.params.id);
    if (!existing) return errorResponse(res, 'Customer tidak ditemukan', 404);
    const data = await customerService.update(req.params.id, req.body);
    return successResponse(res, data, 'Customer berhasil diperbarui');
  } catch (err) { next(err); }
};

const destroy = async (req, res, next) => {
  try {
    const existing = await customerService.getById(req.params.id);
    if (!existing) return errorResponse(res, 'Customer tidak ditemukan', 404);
    await customerService.remove(req.params.id);
    return successResponse(res, null, 'Customer berhasil dihapus');
  } catch (err) { next(err); }
};

module.exports = { index, show, store, update, destroy };