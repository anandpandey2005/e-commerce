class apiResponse {
  constructor(statusCode, data, message) {
    this.statusCode = statusCode;
    this.success = true;
    this.message = message;
    this.data = data;
    this.timeStamp = new Date().toISOString();
  }

  static success(res, statusCode, data = null, message = "success") {
    return res
      .status(statusCode)
      .json(new apiResponse(statusCode, data, message));
  }
}

export { apiResponse };
