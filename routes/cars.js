const router = require('express').Router();
const carController = require('../controllers/carController');

router.get('/', carController.index);
router.get('/create', carController.createView);
router.post('/create', carController.create);
router.get('/:id/update', carController.updateView);
router.post('/:id/update', carController.update);
router.post('/:id/delete', carController.remove);

module.exports = router;