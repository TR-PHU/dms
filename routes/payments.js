const router = require('express').Router();
const paymentController = require('../controllers/paymentController');

router.get('/', paymentController.index);
router.get('/create', paymentController.createView);
router.post('/create', paymentController.create);
router.get('/:id/update', paymentController.updateView);
router.post('/:id/update', paymentController.update);
router.post('/:id/delete', paymentController.remove);

module.exports = router;