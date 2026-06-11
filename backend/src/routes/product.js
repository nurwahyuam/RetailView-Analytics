const router = require('express').Router();
const ctrl = require('../controllers/productController')
const { validateProduct } = require('../middleware/validator');

router.get('/',     ctrl.index);
router.get('/:id',  ctrl.show);
router.post('/',    validateProduct, ctrl.store);
router.put('/:id',  validateProduct, ctrl.update);
router.delete('/:id', ctrl.destroy);

module.exports = router;