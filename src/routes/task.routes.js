const { Router } = require('express');
const controller = require('../controllers/task.controller');
const validateTask = require('../middlewares/validateTask');

const router = Router();

// Özel rotalar :id rotasından ÖNCE tanımlanmalıdır
router.get('/search', controller.searchTasks);
router.get('/assignee/:name', controller.getTasksByAssignee);

router.get('/', controller.getTasks);
router.post('/', validateTask(), controller.createTask);

router.get('/:id', controller.getTask);
router.put('/:id', validateTask(), controller.replaceTask);
router.patch('/:id', validateTask({ partial: true }), controller.patchTask);
router.delete('/:id', controller.deleteTask);

module.exports = router;
