const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;
  
  if (!err.isOperational) {
    statusCode = 500;
    message = 'Internal Server Error';
    console.error(err);
  } else {
    statusCode = statusCode || 500;
  }

  res.status(statusCode).json({
    error: {
      code: statusCode,
      message,
    }
  });
};

module.exports = errorHandler;
