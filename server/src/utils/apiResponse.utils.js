class apiResponse {
  constructor(statusCode, message = "Success", data) {
      this.statusCode = statusCode;
      this.success = true;
      this.message = message;
      this.data = data;
    this.timeStamp = new Date().toISOString();
  }

  static success(res, statusCode, message, data) {
    return res
      .status(statusCode)
      .json(new apiResponse(statusCode, data, message));
  }
}

export { apiResponse };
