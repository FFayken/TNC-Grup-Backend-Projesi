const express = require('express');

const logger = require('./middlewares/logger');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');
const taskRoutes = require('./routes/task.routes');
const reportRoutes = require('./routes/report.routes');

const app = express();

// Gövde (body) JSON olarak okunur
app.use(express.json());

// Temel middleware: her isteği kayıt altına alır
app.use(logger);

// Sağlık kontrolü / karşılama
app.get('/', (req, res) => {
  res.json({
    name: 'TaskFlow API',
    version: '1.0.0',
    endpoints: {
      tasks: '/tasks',
      reports: '/reports/summary'
    }
  });
});

app.use('/tasks', taskRoutes);
app.use('/reports', reportRoutes);

// Eşleşmeyen rotalar ve hata yönetimi
app.use(notFound);
app.use(errorHandler);

module.exports = app;
