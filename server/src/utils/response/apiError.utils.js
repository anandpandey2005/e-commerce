class apiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    this.message = message;
    this.data = null;
    this.errors = errors;
    this.isOperational = true;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  static errorResponse(res, statusCode, message, errors = []) {
    const errorInstance = new apiError(statusCode, message, errors);

    return res.status(statusCode).json({
      success: errorInstance.success,
      message: errorInstance.message,
      errors: errorInstance.errors,
      statusCode: errorInstance.statusCode,
      timeStamp: new Date().toISOString(),
    });
  }
}

export { apiError };
