const router = require('express').Router();
const carImportController = require('../controllers/carImportController');

router.get('/', carImportController.index);
router.get('/create', carImportController.createView);
router.post('/create', carImportController.create);
router.get('/update', carImportController.updateView);
router.post('/update', carImportController.update);
router.post('/delete', carImportController.remove);

module.exports = router;