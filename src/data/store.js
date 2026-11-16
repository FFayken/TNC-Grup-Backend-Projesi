const fs = require('fs');
const path = require('path');

/**
 * Basit JSON dosya deposu.
 * Veriler src/data/tasks.json dosyasında tutulur; dosya yoksa
 * seed-tasks.json içeriğiyle oluşturulur. Sunucu yeniden başlasa da
 * veriler kaybolmaz.
 */
const DATA_FILE = process.env.TASKFLOW_DATA_FILE || path.join(__dirname, 'tasks.json');
const SEED_FILE = path.join(__dirname, 'seed-tasks.json');

function ensureFile() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.copyFileSync(SEED_FILE, DATA_FILE);
  }
}

function readTasks() {
  ensureFile();
  const raw = fs.readFileSync(DATA_FILE, 'utf8');
  return JSON.parse(raw);
}

function writeTasks(tasks) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2), 'utf8');
}

function resetToSeed() {
  fs.copyFileSync(SEED_FILE, DATA_FILE);
}

module.exports = { readTasks, writeTasks, resetToSeed, DATA_FILE };
