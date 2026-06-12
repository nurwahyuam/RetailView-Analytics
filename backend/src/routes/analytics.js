const router = require("express").Router();
const ctrl = require("../controllers/analyticsController");

router.get("/summary", ctrl.summary);
router.get("/per-product", ctrl.perProduk);
router.get("/trend-month", ctrl.trendBulan);
router.get("/top-customers", ctrl.topPelanggan);
router.get("/categories", ctrl.kategoriList);

module.exports = router;
