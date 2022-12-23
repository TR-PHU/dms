const router = require('express').Router();
const paymentDetailController = require('../controllers/paymentDetailController');

router.get('/', paymentDetailController.index);
router.get('/create', paymentDetailController.createView);
router.post('/create', paymentDetailController.create);
router.get('/update', paymentDetailController.updateView);
router.post('/update', paymentDetailController.update);
router.post('/delete', paymentDetailController.remove);

module.exports = router;