const express = require("express");
const protect = require("../middlewares/protect.middleware");
const messageController = require("../controllers/messages.controller");

const messageRouter = express.Router();

messageRouter.get(
  "/:conversationId",
  protect,
  messageController.getByConversation,
);

module.exports = messageRouter;
