const { responseSuccess } = require("../helpers/response.helper");
const messageService = require("../services/messages.service");

const messageController = {
  getByConversation: async (req, res, next) => {
    try {
      const data = await messageService.getByConversation(
        req.params.conversationId,
        req.user.userId,
      );

      const response = responseSuccess(data, "Lấy tin nhắn thành công", 200);

      res.status(response.code).json(response);
    } catch (err) {
      next(err);
    }
  },
};

module.exports = messageController;
