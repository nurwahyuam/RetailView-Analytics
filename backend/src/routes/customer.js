const router = require('express').Router();
const ctrl = require('../controllers/customerController')
const { validateCustomer } = require('../middleware/validator');

router.get('/',     ctrl.index);
router.get('/:id',  ctrl.show);
router.post('/',    validateCustomer, ctrl.store);
router.put('/:id',  validateCustomer, ctrl.update);
router.delete('/:id', ctrl.destroy);

module.exports = router;