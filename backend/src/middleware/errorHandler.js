export function errorHandler(error, _req, res, _next) {
  const status = error.statusCode || 500;
  res.status(status).json({
    error: error.message || 'Internal Server Error'
  });
}
