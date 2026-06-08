const express = require("express");
const userController = require("../controllers/users.controller");

const protect = require("../middlewares/protect.middleware");
const uploadLocalMiddleware = require("../middlewares/uploadLocal.middleware");
const uploadCloud = require("../middlewares/uploadCloud.middleware");
const userRouter = express.Router();

userRouter.get("/getAll", userController.getAll);
userRouter.get("/getById/:id", userController.getById);
userRouter.delete("/delete/:id", userController.delete);
userRouter.patch("/update/:id", userController.update);
userRouter.post("/create", userController.create);
userRouter.post("/login", userController.login);
userRouter.post("/refresh-token", userController.refreshAccessToken);
userRouter.post("/logout", userController.logout);
userRouter.post("/request-password-reset", userController.requestPasswordReset);
userRouter.post("/verify-reset-code", userController.verifyPasswordResetCode);
userRouter.post("/reset-password", userController.resetPasswordWithCode);
userRouter.patch("/change-password", protect, userController.changePassword);
userRouter.patch(
  "/avatar/local",
  protect,
  uploadLocalMiddleware.single("avatar"),
  userController.uploadLocal,
);
userRouter.patch(
  "/avatar/cloud",
  protect,
  uploadCloud.single("avatar"),
  userController.uploadCloud,
);
userRouter.patch(
  "/avatar/cloud/:id",
  protect,
  uploadCloud.single("avatar"),
  userController.uploadCloud,
);
module.exports = userRouter;
