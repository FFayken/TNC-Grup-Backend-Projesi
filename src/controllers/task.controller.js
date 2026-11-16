const taskService = require('../services/task.service');

function parseId(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ success: false, message: 'Geçersiz görev id değeri.' });
    return null;
  }
  return id;
}

// GET /tasks
function getTasks(req, res) {
  const result = taskService.list(req.query);
  res.json({ success: true, count: result.data.length, ...result });
}

// GET /tasks/search?keyword=...
function searchTasks(req, res) {
  const { keyword } = req.query;
  if (!keyword || !keyword.trim()) {
    return res.status(400).json({ success: false, message: 'keyword parametresi zorunludur.' });
  }
  const data = taskService.search(keyword.trim());
  res.json({ success: true, count: data.length, data });
}

// GET /tasks/assignee/:name
function getTasksByAssignee(req, res) {
  const result = taskService.list({ ...req.query, assignee: req.params.name });
  res.json({ success: true, count: result.data.length, ...result });
}

// GET /tasks/:id
function getTask(req, res) {
  const id = parseId(req, res);
  if (id === null) return;
  const task = taskService.getById(id);
  if (!task) return res.status(404).json({ success: false, message: `${id} numaralı görev bulunamadı.` });
  res.json({ success: true, data: task });
}

// POST /tasks
function createTask(req, res) {
  const task = taskService.create(req.body);
  res.status(201).json({ success: true, message: 'Görev oluşturuldu.', data: task });
}

// PUT /tasks/:id  (tam güncelleme)
function replaceTask(req, res) {
  const id = parseId(req, res);
  if (id === null) return;
  const task = taskService.update(id, req.body, { replace: true });
  if (!task) return res.status(404).json({ success: false, message: `${id} numaralı görev bulunamadı.` });
  res.json({ success: true, message: 'Görev güncellendi.', data: task });
}

// PATCH /tasks/:id  (kısmi güncelleme, örn. sadece status)
function patchTask(req, res) {
  const id = parseId(req, res);
  if (id === null) return;
  const task = taskService.update(id, req.body, { replace: false });
  if (!task) return res.status(404).json({ success: false, message: `${id} numaralı görev bulunamadı.` });
  res.json({ success: true, message: 'Görev güncellendi.', data: task });
}

// DELETE /tasks/:id
function deleteTask(req, res) {
  const id = parseId(req, res);
  if (id === null) return;
  const task = taskService.remove(id);
  if (!task) return res.status(404).json({ success: false, message: `${id} numaralı görev bulunamadı.` });
  res.json({ success: true, message: 'Görev silindi.', data: task });
}

module.exports = {
  getTasks,
  searchTasks,
  getTasksByAssignee,
  getTask,
  createTask,
  replaceTask,
  patchTask,
  deleteTask
};
