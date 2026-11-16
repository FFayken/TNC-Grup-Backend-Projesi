/**
 * Görev (Task) veri modeli
 *
 * {
 *   id:          number   - otomatik artan benzersiz kimlik
 *   title:       string   - görev başlığı (zorunlu)
 *   description: string   - açıklama
 *   status:      'todo' | 'in-progress' | 'completed'
 *   priority:    'low' | 'medium' | 'high'
 *   assignee:    string   - görevin atandığı çalışan (zorunlu)
 *   project:     string   - görevin ait olduğu proje
 *   dueDate:     string   - teslim tarihi (YYYY-MM-DD) veya null
 *   createdAt:   string   - ISO tarih
 *   updatedAt:   string   - ISO tarih
 * }
 */

const STATUSES = ['todo', 'in-progress', 'completed'];
const PRIORITIES = ['low', 'medium', 'high'];

function createTask(id, data) {
  const now = new Date().toISOString();
  return {
    id,
    title: data.title.trim(),
    description: data.description ? String(data.description).trim() : '',
    status: data.status || 'todo',
    priority: data.priority,
    assignee: data.assignee.trim().toLowerCase(),
    project: data.project ? String(data.project).trim() : 'Genel',
    dueDate: data.dueDate || null,
    createdAt: now,
    updatedAt: now
  };
}

module.exports = { STATUSES, PRIORITIES, createTask };
