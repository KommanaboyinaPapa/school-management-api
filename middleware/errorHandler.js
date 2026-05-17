/**
 * Centralized Express error handler.
 * Keep responses consistent and beginner-friendly.
 */
function errorHandler(err, req, res, next) {
  const statusCode = Number(err.statusCode) || 500;

  // Log full error for debugging (don’t expose stack traces to clients).
  // eslint-disable-next-line no-console
  console.error(err);

  return res.status(statusCode).json({
    error: err.publicError || 'Internal server error',
    message: err.publicMessage || err.message || 'Something went wrong'
  });
}

module.exports = { errorHandler };
