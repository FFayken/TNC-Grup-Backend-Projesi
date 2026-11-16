const { readTasks, writeTasks } = require('../data/store');
const { createTask } = require('../models/task.model');

const UPDATABLE_FIELDS = ['title', 'description', 'status', 'priority', 'assignee', 'project', 'dueDate'];
const SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'dueDate', 'priority', 'title', 'id'];
const PRIORITY_ORDER = { low: 1, medium: 2, high: 3 };

function nextId(tasks) {
  return tasks.reduce((max, t) => Math.max(max, t.id), 0) + 1;
}

/**
 * Görevleri filtreler, sıralar ve sayfalar.
 * query: { status, priority, assignee, project, sort, page, limit }
 * sort: "createdAt" (artan) veya "-createdAt" (azalan)
 */
function list(query = {}) {
  let tasks = readTasks();

  if (query.status) tasks = tasks.filter((t) => t.status === query.status);
  if (query.priority) tasks = tasks.filter((t) => t.priority === query.priority);
  if (query.assignee) tasks = tasks.filter((t) => t.assignee === String(query.assignee).toLowerCase());
  if (query.project) tasks = tasks.filter((t) => t.project.toLowerCase() === String(query.project).toLowerCase());

  if (query.sort) {
    const desc = query.sort.startsWith('-');
    const field = desc ? query.sort.slice(1) : query.sort;
    if (SORTABLE_FIELDS.includes(field)) {
      tasks = [...tasks].sort((a, b) => {
        let va = a[field];
        let vb = b[field];
        if (field === 'priority') {
          va = PRIORITY_ORDER[va];
          vb = PRIORITY_ORDER[vb];
        }
        if (va === null || va === undefined) return 1;
        if (vb === null || vb === undefined) return -1;
        if (va < vb) return desc ? 1 : -1;
        if (va > vb) return desc ? -1 : 1;
        return 0;
      });
    }
  }

  const total = tasks.length;

  // Sayfalama yalnızca page veya limit verildiğinde uygulanır
  if (query.page || query.limit) {
    const page = Math.max(parseInt(query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(query.limit, 10) || 10, 1), 100);
    const start = (page - 1) * limit;
    return {
      data: tasks.slice(start, start + limit),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    };
  }

  return { data: tasks, total };
}

function search(keyword = '') {
  const kw = String(keyword).toLocaleLowerCase('tr');
  return readTasks().filter(
    (t) =>
      t.title.toLocaleLowerCase('tr').includes(kw) ||
      t.description.toLocaleLowerCase('tr').includes(kw) ||
      t.project.toLocaleLowerCase('tr').includes(kw)
  );
}

function getById(id) {
  return readTasks().find((t) => t.id === id) || null;
}

function create(data) {
  const tasks = readTasks();
  const task = createTask(nextId(tasks), data);
  tasks.push(task);
  writeTasks(tasks);
  return task;
}

/**
 * Görevi günceller. replace=true ise (PUT) gönderilmeyen opsiyonel
 * alanlar varsayılana döner; false ise (PATCH) yalnızca gelen alanlar değişir.
 */
function update(id, data, { replace = false } = {}) {
  const tasks = readTasks();
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return null;

  const current = tasks[index];
  let updated;

  if (replace) {
    const fresh = createTask(id, { ...data, status: data.status || current.status });
    updated = { ...fresh, createdAt: current.createdAt };
  } else {
    updated = { ...current };
    for (const field of UPDATABLE_FIELDS) {
      if (data[field] !== undefined) {
        updated[field] = typeof data[field] === 'string' ? data[field].trim() : data[field];
      }
    }
    if (data.assignee !== undefined) updated.assignee = updated.assignee.toLowerCase();
  }

  updated.updatedAt = new Date().toISOString();
  tasks[index] = updated;
  writeTasks(tasks);
  return updated;
}

function remove(id) {
  const tasks = readTasks();
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return null;
  const [deleted] = tasks.splice(index, 1);
  writeTasks(tasks);
  return deleted;
}

module.exports = { list, search, getById, create, update, remove };
