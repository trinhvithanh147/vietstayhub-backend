const { BadRequestException } = require("../helpers/error.helper");
const conversationModel = require("../models/conversation.model");
const messageModel = require("../models/message.model");

const messageService = {
  getByConversation: async (conversationId, userId) => {
    const conversation = await conversationModel.findById(conversationId);

    if (!conversation) {
      throw new BadRequestException("Không tìm thấy cuộc trò chuyện.");
    }

    const isUserInConversation =
      String(conversation.user_id) === String(userId) ||
      String(conversation.host_id) === String(userId);

    if (!isUserInConversation) {
      throw new BadRequestException(
        "Bạn không có quyền xem cuộc trò chuyện này.",
      );
    }

    return await messageModel
      .find({
        conversation_id: conversationId,
      })
      .populate("sender_id", "full_name email avatar")
      .populate("receiver_id", "full_name email avatar")
      .sort({ createdAt: 1 });
  },
};

module.exports = messageService;
