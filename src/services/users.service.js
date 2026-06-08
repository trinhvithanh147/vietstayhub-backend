const {
  ConflictException,
  BadRequestException,
  UnauthorizedError,
} = require("../helpers/error.helper");
const usersModel = require("../models/users.model");

const bcrypt = require("bcrypt");
const crypto = require("crypto");
const cloudinary = require("../config/cloudinary.config");
const streamifier = require("streamifier");
const { sendPasswordResetCodeEmail } = require("../config/mailer.config");
const { SECRET } = require("../constants/app.constant");
const {
  generateAuthTokens,
  generateAccessToken,
  verifyRefreshToken,
} = require("../utils/token.util");

const RESET_CODE_EXPIRES_IN_MINUTES = 10;

const escapeRegExp = (value) => {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const findUserByEmailForReset = (email) => {
  return usersModel.findOne({
    email: new RegExp(`^${escapeRegExp(email)}$`, "i"),
  });
};

const buildResetCodeHash = (email, code) => {
  return crypto
    .createHash("sha256")
    .update(`${email}:${code}:${SECRET}`)
    .digest("hex");
};

const createResetCode = () => {
  return String(Math.floor(100000 + Math.random() * 900000));
};

const clearResetPasswordData = (user) => {
  user.reset_password = {
    code_hash: "",
    expires_at: null,
    requested_at: null,
  };
};

const getCookieValue = (cookieHeader, cookieName) => {
  if (!cookieHeader) return "";

  const cookies = cookieHeader.split(";").map((item) => item.trim());
  const targetCookie = cookies.find((item) =>
    item.startsWith(`${cookieName}=`),
  );

  if (!targetCookie) return "";

  return decodeURIComponent(targetCookie.slice(cookieName.length + 1));
};

const sanitizeUser = (userDoc) => {
  if (!userDoc) return userDoc;

  const user = userDoc.toObject ? userDoc.toObject() : { ...userDoc };
  delete user.password;

  return user;
};

const userService = {
  getAll: async () => {
    const users = await usersModel.find();
    if (users.length === 0) {
      throw new BadRequestException("Khong co user nao");
    }
    return users.map((user) => sanitizeUser(user));
  },
  getById: async (id) => {
    const user = await usersModel.findById(id);
    if (!user) {
      throw new BadRequestException("Khong tim thay user nay");
    }
    return sanitizeUser(user);
  },
  delete: async (id) => {
    const result = await usersModel.findByIdAndDelete(id);
    if (!result) {
      throw new BadRequestException("Khong tim thay user nay de xoa");
    }
    return result;
  },
  update: async (id, data) => {
    const user = await usersModel.findById(id);
    if (!user) {
      throw new BadRequestException("Khong tim thay user nay");
    }

    const {
      full_name,
      phone_number = "",
      gender = "",
      home_address = "",
      role,
      password,
      avatar,
    } = data;

    user.full_name = full_name ?? user.full_name;
    user.phone_number = phone_number;
    user.gender = gender;
    user.home_address = home_address;
    if (role && ["admin", "user"].includes(role)) {
      user.role = role;
    }
    if (password?.trim()) {
      if (String(password).trim().length < 6) {
        throw new BadRequestException("Mat khau phai co it nhat 6 ky tu");
      }

      user.password = await bcrypt.hash(String(password).trim(), 10);
    }
    if (avatar) {
      user.avatar = avatar;
    }

    await user.save();
    return sanitizeUser(user);
  },
  create: async (data) => {
    const {
      email,
      password,
      full_name,
      phone_number = "",
      gender = "",
      home_address = "",
      role = "user",
      avatar = {
        url: "",
        public_id: "",
      },
    } = data;

    const existing = await usersModel.findOne({ email: email });
    if (existing) {
      throw new ConflictException("Email da ton tai");
    }
    const hasedPassword = await bcrypt.hash(password, 10);
    const safeRole = ["admin", "user"].includes(role) ? role : "user";

    const user = await usersModel.create({
      email,
      password: hasedPassword,
      full_name,
      phone_number,
      gender,
      home_address,
      avatar,
      role: safeRole,
    });
    return sanitizeUser(user);
  },

  login: async (data) => {
    const { email, password } = data;
    if (!email || !password) {
      throw new BadRequestException("Thieu email hoac mat khau");
    }
    const user = await usersModel.findOne({ email: email });
    if (!user) {
      throw new UnauthorizedError("Email khong ton tai");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedError("Sai mat khau");
    }
    const { accessToken, refreshToken } = generateAuthTokens(user);
    return {
      accessToken,
      refreshToken,
      user: sanitizeUser(user),
    };
  },
  refreshAccessToken: async (req) => {
    const refreshToken = getCookieValue(req.headers.cookie, "refreshToken");

    if (!refreshToken) {
      throw new UnauthorizedError("Khong tim thay refresh token");
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (error) {
      throw new UnauthorizedError("Refresh token khong hop le hoac da het han");
    }

    const user = await usersModel.findById(decoded.userId);
    if (!user) {
      throw new UnauthorizedError("Nguoi dung khong ton tai");
    }

    return {
      accessToken: generateAccessToken(user),
      user: sanitizeUser(user),
    };
  },
  logout: async () => {
    return {
      loggedOut: true,
    };
  },
  requestPasswordReset: async (email) => {
    if (!email?.trim()) {
      throw new BadRequestException("Vui lòng nhập email");
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await findUserByEmailForReset(normalizedEmail);

    if (!user) {
      return {
        email: normalizedEmail,
        expires_in_minutes: RESET_CODE_EXPIRES_IN_MINUTES,
      };
    }

    const code = createResetCode();
    const expiresAt = new Date(
      Date.now() + RESET_CODE_EXPIRES_IN_MINUTES * 60 * 1000,
    );

    user.reset_password = {
      code_hash: buildResetCodeHash(normalizedEmail, code),
      expires_at: expiresAt,
      requested_at: new Date(),
    };
    await user.save();

    await sendPasswordResetCodeEmail({
      to: normalizedEmail,
      code,
    });

    return {
      email: normalizedEmail,
      expires_in_minutes: RESET_CODE_EXPIRES_IN_MINUTES,
    };
  },
  verifyPasswordResetCode: async ({ email, code }) => {
    if (!email?.trim() || !code?.trim()) {
      throw new BadRequestException("Thiếu email hoặc mã xác thực");
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedCode = code.trim();
    const user = await findUserByEmailForReset(normalizedEmail);

    if (!user || !user.reset_password?.code_hash) {
      throw new BadRequestException("Mã xác thực không hợp lệ hoặc đã hết hạn");
    }

    if (
      !user.reset_password.expires_at ||
      new Date(user.reset_password.expires_at).getTime() < Date.now()
    ) {
      clearResetPasswordData(user);
      await user.save();
      throw new BadRequestException("Mã xác thực đã hết hạn");
    }

    const incomingHash = buildResetCodeHash(normalizedEmail, normalizedCode);
    if (incomingHash !== user.reset_password.code_hash) {
      throw new BadRequestException("Mã xác thực không đúng");
    }

    return {
      email: normalizedEmail,
      verified: true,
    };
  },
  resetPasswordWithCode: async ({ email, code, newPassword }) => {
    if (!email?.trim() || !code?.trim() || !newPassword) {
      throw new BadRequestException(
        "Thiếu email, mã xác thực hoặc mật khẩu mới",
      );
    }

    if (String(newPassword).length < 6) {
      throw new BadRequestException("Mật khẩu mới phải có ít nhất 6 ký tự");
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedCode = code.trim();
    const user = await findUserByEmailForReset(normalizedEmail);

    if (!user || !user.reset_password?.code_hash) {
      throw new BadRequestException("Mã xác thực không hợp lệ hoặc đã hết hạn");
    }
    if (
      !user.reset_password.expires_at ||
      new Date(user.reset_password.expires_at).getTime() < Date.now()
    ) {
      clearResetPasswordData(user);
      await user.save();
      throw new BadRequestException("Mã xác thực đã hết hạn");
    }

    const incomingHash = buildResetCodeHash(normalizedEmail, normalizedCode);
    if (incomingHash !== user.reset_password.code_hash) {
      throw new BadRequestException("Mã xác thực không đúng");
    }

    user.password = await bcrypt.hash(newPassword, 10);
    clearResetPasswordData(user);
    await user.save();

    return {
      email: normalizedEmail,
    };
  },
  changePassword: async (userId, data) => {
    const { oldPassword, newPassword, confirmPassword } = data;

    if (!oldPassword || !newPassword || !confirmPassword) {
      throw new BadRequestException("Vui lòng nhập đầy đủ thông tin mật khẩu.");
    }

    if (newPassword !== confirmPassword) {
      throw new BadRequestException("Mật khẩu xác nhận không khớp.");
    }

    if (newPassword.length < 6) {
      throw new BadRequestException("Mật khẩu mới phải có ít nhất 6 ký tự.");
    }

    const user = await usersModel.findById(userId);

    if (!user) {
      throw new BadRequestException("Không tìm thấy người dùng.");
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      throw new BadRequestException("Mật khẩu hiện tại không chính xác.");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    return {
      message: "Đổi mật khẩu thành công.",
    };
  },
  uploadLocal: async (req) => {
    const file = req.file;
    if (!file) {
      throw new BadRequestException("Vui long gui hinh anh bang key avatar");
    }

    const userId = req.user?.userId;
    if (!userId) {
      throw new UnauthorizedError("Token khong hop le");
    }
    const user = await usersModel.findById(userId);
    if (!user) {
      throw new BadRequestException("Khong tim thay user");
    }

    user.avatar = { url: `/images/${file.filename}`, public_id: "" };
    await user.save();

    return { filename: file.filename, imgUrl: `/images/${file.filename}` };
  },

  uploadCloud: async (req) => {
    const file = req.file;
    if (!file) {
      throw new BadRequestException(
        "Vui long gui hinh anh bang key avatar (form-data)",
      );
    }

    const userId = req.params?.id || req.user?.userId;
    if (!userId) {
      throw new UnauthorizedError("Token khong hop le");
    }

    const user = await usersModel.findById(userId);
    if (!user) {
      throw new BadRequestException("Khong tim thay user");
    }

    if (user.avatar?.public_id) {
      await cloudinary.uploader.destroy(user.avatar.public_id);
    }

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "avatars", resource_type: "image" },
        (error, uploaded) => {
          if (error) return reject(error);
          resolve(uploaded);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });

    user.avatar = {
      url: result.secure_url,
      public_id: result.public_id,
    };
    await user.save();

    return {
      avatar: user.avatar,
    };
  },
};

module.exports = userService;
