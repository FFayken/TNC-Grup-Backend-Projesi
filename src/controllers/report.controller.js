const { readTasks } = require('../data/store');
const { STATUSES, PRIORITIES } = require('../models/task.model');

function countBy(tasks, key, keys) {
  const result = {};
  if (keys) keys.forEach((k) => (result[k] = 0));
  tasks.forEach((t) => {
    result[t[key]] = (result[t[key]] || 0) + 1;
  });
  return result;
}

// GET /reports/completed
function completed(req, res) {
  const tasks = readTasks().filter((t) => t.status === 'completed');
  res.json({ success: true, completedCount: tasks.length, data: tasks });
}

// GET /reports/pending  (todo + in-progress)
function pending(req, res) {
  const tasks = readTasks().filter((t) => t.status !== 'completed');
  res.json({ success: true, pendingCount: tasks.length, data: tasks });
}

// GET /reports/summary
function summary(req, res) {
  const tasks = readTasks();
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === 'completed').length;
  const today = new Date().toISOString().slice(0, 10);
  const overdue = tasks.filter((t) => t.status !== 'completed' && t.dueDate && t.dueDate < today).length;

  res.json({
    success: true,
    data: {
      totalTasks: total,
      completedTasks: done,
      pendingTasks: total - done,
      overdueTasks: overdue,
      completionRate: total === 0 ? 0 : Math.round((done / total) * 100),
      byStatus: countBy(tasks, 'status', STATUSES),
      byPriority: countBy(tasks, 'priority', PRIORITIES),
      byAssignee: countBy(tasks, 'assignee'),
      byProject: countBy(tasks, 'project')
    }
  });
}

module.exports = { completed, pending, summary };
