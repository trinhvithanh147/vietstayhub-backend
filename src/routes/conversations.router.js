const express = require("express");
const protect = require("../middlewares/protect.middleware");
const conversationController = require("../controllers/conversations.controler");

const conversationRouter = express.Router();

conversationRouter.post(
  "/create-or-get",
  protect,
  conversationController.createOrGet,
);
conversationRouter.get(
  "/my",
  protect,
  conversationController.getMyConversations,
);
conversationRouter.get(
  "/:conversationId",
  protect,
  conversationController.getById,
);

module.exports = conversationRouter;
