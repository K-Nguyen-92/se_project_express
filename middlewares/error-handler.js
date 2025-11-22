function errorHandler(err, req, res, next) {
  console.error(err);
  const { status = 500, message } = err;
  res.status(status).send({
    message: status === 500 ? "An error occurred on the server" : message,
  });
}

module.exports = errorHandler;
