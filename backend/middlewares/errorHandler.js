const errorHandler = (err, req, res, next) => {
  console.error(err);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";

  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid resource ID";
  }

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((error) => error.message)
      .join(", ");
  }

  if (err.code === 11000) {
    statusCode = 409;

    const duplicateField =
      Object.keys(err.keyValue || {})[0] || "field";

    message = `${duplicateField} already exists`;
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

export default errorHandler;