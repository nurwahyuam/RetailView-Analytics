const router = require("express").Router();
const ctrl = require("../controllers/timeController");
const { validateTime } = require("../middleware/validator");

router.get("/", ctrl.index);
router.get("/:id", ctrl.show);
router.post("/", validateTime, ctrl.store);
router.put("/:id", validateTime, ctrl.update);
router.delete("/:id", ctrl.destroy);

module.exports = router;
