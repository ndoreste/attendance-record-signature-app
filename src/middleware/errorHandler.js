export function notFoundHandler(req, res) {
  res.status(404).json({ success: false, message: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(error, _req, res, _next) {
  const statusCode = error.statusCode || (error.name === 'ValidationError' ? 400 : 500);
  const message = error.name === 'ValidationError'
    ? Object.values(error.errors).map((err) => err.message).join(', ')
    : error.message || 'Error interno del servidor';
  res.status(statusCode).json({ success: false, message });
}
