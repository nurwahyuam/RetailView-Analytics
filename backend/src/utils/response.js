const successResponse = (res, data, message = "Berhasil", statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    statusCode,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
};

const errorResponse = (res, message = "Terjadi kesalahan", statusCode = 500, errors = null) => {
  const payload = {
    success: false,
    statusCode,
    message,
    timestamp: new Date().toISOString(),
  };
  if (errors) payload.errors = errors;
  return res.status(statusCode).json(payload);
};

const paginatedResponse = (res, data, pagination, message = "Berhasil") => {
  return res.status(200).json({
    success: true,
    statusCode: 200,
    message,
    data,
    pagination,
    timestamp: new Date().toISOString(),
  });
};

module.exports = {
  successResponse,
  errorResponse,
  paginatedResponse,
};