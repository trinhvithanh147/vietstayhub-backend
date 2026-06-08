const { responseSuccess } = require("../helpers/response.helper");
const conversationService = require("../services/conversations.service");

const conversationController = {
  getById: async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const { conversationId } = req.params;

      const data = await conversationService.getById(conversationId, userId);

      const response = responseSuccess(
        data,
        "Lấy cuộc trò chuyện thành công",
        200,
      );

      res.status(response.code).json(response);
    } catch (err) {
      next(err);
    }
  },
  createOrGet: async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const { property_id } = req.body;

      const data = await conversationService.createOrGet(userId, property_id);

      const response = responseSuccess(
        data,
        "Tạo cuộc trò chuyện thành công",
        200,
      );

      res.status(response.code).json(response);
    } catch (err) {
      next(err);
    }
  },

  getMyConversations: async (req, res, next) => {
    try {
      const userId = req.user.userId;

      const data = await conversationService.getMyConversations(userId);

      const response = responseSuccess(
        data,
        "Lấy danh sách cuộc trò chuyện thành công",
        200,
      );

      res.status(response.code).json(response);
    } catch (err) {
      next(err);
    }
  },
};

module.exports = conversationController;
