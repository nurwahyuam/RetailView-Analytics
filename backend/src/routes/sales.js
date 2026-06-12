const router = require('express').Router();
const ctrl = require('../controllers/salesController')
const { validateSales } = require('../middleware/validator');

router.get('/',     ctrl.index);
router.get('/:id',  ctrl.show);
router.post('/',    validateSales, ctrl.store);
router.put('/:id',  validateSales, ctrl.update);
router.delete('/:id', ctrl.destroy);

module.exports = router;