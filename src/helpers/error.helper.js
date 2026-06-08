const multer = require("multer");
const { responseError } = require("./response.helper.js");
const jwt = require("jsonwebtoken");
const handleError = (err, req, res, next) => {
  console.log(err);

  if (err instanceof jwt.JsonWebTokenError) {
    err.code = 401; //token không hợp lệ
  }
  if (err instanceof jwt.TokenExpiredError) {
    err.code = 403; //token hết hạn
  }
  if (err instanceof multer.MulterError) {
    err.code = 400;
  }
  if (err.code === 11000) {
    err.code = 400;
    err.message = "Email đã tồn tại";
  }
  const resData = responseError(err.message, err.code, err.stack);
  res.status(resData.code).json(resData);
};

class BadRequestException extends Error {
  // khởi tạo thuộc tính
  constructor(message = `BadRequestException`) {
    super(message);
    this.code = 400;
  }
}

class ForbiddenException extends Error {
  constructor(message = `ForbiddenException`) {
    super(message);
    this.code = 403;
  }
}
class UnauthorizedError extends Error {
  constructor(message = `Unauthorization`) {
    super(message);
    this.code = 401;
  }
}
class ConflictException extends Error {
  constructor(message = "Conflict") {
    super(message);
    this.name = "ConflictException";
    this.code = 409;
  }
}
module.exports = {
  handleError,
  BadRequestException,
  ForbiddenException,
  UnauthorizedError,
  ConflictException,
};
