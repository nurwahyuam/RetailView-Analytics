const { errorResponse } = require('../utils/response');

const notFoundHandler = (req, res) => {
  return errorResponse(
    res,
    `Endpoint [${req.method}] ${req.originalUrl} tidak ditemukan`,
    404
  );
};

const globalErrorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error('🔥 Error:', err.stack || err.message);

  // MySQL duplicate entry
  if (err.code === 'ER_DUP_ENTRY') {
    return errorResponse(res, 'Data duplikat: nilai sudah ada di database', 409);
  }

  // MySQL foreign key constraint
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return errorResponse(res, 'Referensi ID tidak ditemukan di tabel relasi', 400);
  }

  // MySQL cannot delete parent row
  if (err.code === 'ER_ROW_IS_REFERENCED_2') {
    return errorResponse(res, 'Data tidak bisa dihapus karena masih digunakan di tabel lain', 409);
  }

  const statusCode = err.statusCode || 500;
  const message    = err.message    || 'Internal Server Error';

  return errorResponse(res, message, statusCode);
};

module.exports = { notFoundHandler, globalErrorHandler };
