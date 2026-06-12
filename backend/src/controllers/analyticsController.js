const analyticsService = require("../services/analyticsService");
const { successResponse, errorResponse, paginatedResponse } = require("../utils/response");

const summary = async (req, res, next) => {
  try {
    const data = await analyticsService.getSummary(req.query);
    return successResponse(res, data, "Summary dashboard");
  } catch (e) {
    next(e);
  }
};
const perProduk = async (req, res, next) => {
  try {
    const data = await analyticsService.penjualanPerProduk(req.query);
    return successResponse(res, data, "Penjualan per produk");
  } catch (e) {
    next(e);
  }
};
const trendBulan = async (req, res, next) => {
  try {
    const data = await analyticsService.trendPerBulan(req.query);
    return successResponse(res, data, "Tren penjualan per bulan");
  } catch (e) {
    next(e);
  }
};
const topPelanggan = async (req, res, next) => {
  try {
    const data = await analyticsService.topPelanggan(req.query);
    return successResponse(res, data, "Top pelanggan belanja tertinggi");
  } catch (e) {
    next(e);
  }
};
const kategoriList = async (req, res, next) => {
  try {
    const data = await analyticsService.getKategori();
    return successResponse(res, data, "Daftar kategori produk");
  } catch (e) {
    next(e);
  }
};

module.exports = { summary, perProduk, trendBulan, topPelanggan, kategoriList };
