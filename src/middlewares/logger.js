const fs = require('fs');
const path = require('path');

const LOG_DIR = path.join(__dirname, '..', '..', 'logs');
const LOG_FILE = path.join(LOG_DIR, 'requests.log');

if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

/**
 * Logger middleware
 * Her isteğin method, endpoint ve zaman damgasını konsola ve
 * logs/requests.log dosyasına yazar. Yanıt bittiğinde durum kodu
 * ve süre de eklenir.
 */
function logger(req, res, next) {
  const start = Date.now();
  const timestamp = new Date().toISOString();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const line = `[${timestamp}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration} ms)`;
    console.log(line);
    fs.appendFile(LOG_FILE, line + '\n', (err) => {
      if (err) console.error('Log dosyasına yazılamadı:', err.message);
    });
  });

  next();
}

module.exports = logger;
