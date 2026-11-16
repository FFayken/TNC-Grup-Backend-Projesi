const { Router } = require('express');
const controller = require('../controllers/report.controller');

const router = Router();

router.get('/completed', controller.completed);
router.get('/pending', controller.pending);
router.get('/summary', controller.summary);

module.exports = router;
