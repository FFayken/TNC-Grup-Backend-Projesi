// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // Bozuk JSON gövdesi
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      message: 'Geçersiz JSON gövdesi.'
    });
  }

  const status = err.status || 500;
  if (status === 500) console.error(err);

  res.status(status).json({
    success: false,
    message: status === 500 ? 'Sunucu hatası.' : err.message
  });
}

module.exports = errorHandler;
