const jwt = require("jsonwebtoken");
const { SECRET } = require("../constants/app.constant");
const usersModel = require("../models/users.model");
const { UnauthorizedError } = require("../helpers/error.helper");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const accessToken = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!accessToken) {
      throw new UnauthorizedError("Vui lòng cung cấp token để tiếp tục");
    }

    const decoded = jwt.verify(accessToken, SECRET);

    const user = await usersModel.findById(decoded.userId);
    if (!user) {
      throw new UnauthorizedError("User không tồn tại hoặc token không hợp lệ");
    }

    req.user = {
      userId: user._id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = protect;
