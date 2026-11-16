const { STATUSES, PRIORITIES } = require('../models/task.model');

/**
 * Validation middleware (isteğe bağlı ileri seviye pratik 02)
 * title, description, priority, assignee (ve status) alanlarını doğrular.
 * Hata varsa 400 Bad Request ve açıklayıcı mesaj döner.
 *
 * @param {{ partial?: boolean }} options partial=true ise (PATCH) alanlar zorunlu değildir.
 */
function validateTask({ partial = false } = {}) {
  return (req, res, next) => {
    const body = req.body || {};
    const errors = [];

    const isMissing = (v) => v === undefined || v === null || (typeof v === 'string' && v.trim() === '');

    // title
    if (!partial || body.title !== undefined) {
      if (isMissing(body.title)) errors.push('title alanı zorunludur.');
      else if (typeof body.title !== 'string') errors.push('title metin olmalıdır.');
      else if (body.title.trim().length < 3 || body.title.trim().length > 100)
        errors.push('title 3-100 karakter arasında olmalıdır.');
    }

    // description (opsiyonel ama verilirse metin ve en fazla 500 karakter)
    if (body.description !== undefined && body.description !== null) {
      if (typeof body.description !== 'string') errors.push('description metin olmalıdır.');
      else if (body.description.length > 500) errors.push('description en fazla 500 karakter olabilir.');
    }

    // priority
    if (!partial || body.priority !== undefined) {
      if (isMissing(body.priority)) errors.push('priority alanı zorunludur.');
      else if (!PRIORITIES.includes(body.priority))
        errors.push(`priority şu değerlerden biri olmalıdır: ${PRIORITIES.join(', ')}.`);
    }

    // assignee
    if (!partial || body.assignee !== undefined) {
      if (isMissing(body.assignee)) errors.push('assignee alanı zorunludur.');
      else if (typeof body.assignee !== 'string') errors.push('assignee metin olmalıdır.');
    }

    // status (opsiyonel, verilirse geçerli olmalı)
    if (body.status !== undefined && !STATUSES.includes(body.status)) {
      errors.push(`status şu değerlerden biri olmalıdır: ${STATUSES.join(', ')}.`);
    }

    // dueDate (opsiyonel, verilirse geçerli tarih olmalı)
    if (body.dueDate !== undefined && body.dueDate !== null && Number.isNaN(Date.parse(body.dueDate))) {
      errors.push('dueDate geçerli bir tarih olmalıdır (örn. 2026-12-31).');
    }

    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: 'Doğrulama hatası.', errors });
    }

    next();
  };
}

module.exports = validateTask;
