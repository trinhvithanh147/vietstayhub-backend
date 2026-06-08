const { BadRequestException } = require("../helpers/error.helper");
const conversationModel = require("../models/conversation.model");
const propertiesModel = require("../models/properties.model");

const conversationService = {
  createOrGet: async (userId, propertyId) => {
    const property = await propertiesModel.findById(propertyId);

    if (!property) {
      throw new BadRequestException("Không tìm thấy chỗ nghỉ.");
    }

    const hostId = property.user_id;

    if (String(hostId) === String(userId)) {
      throw new BadRequestException(
        "Bạn không thể tự nhắn tin cho chính mình.",
      );
    }

    let conversation = await conversationModel
      .findOne({
        property_id: propertyId,
        user_id: userId,
        host_id: hostId,
      })
      .populate("property_id", "title slug city main_image_url")
      .populate("user_id", "full_name email avatar")
      .populate("host_id", "full_name email avatar");

    if (!conversation) {
      conversation = await conversationModel.create({
        property_id: propertyId,
        user_id: userId,
        host_id: hostId,
      });

      conversation = await conversationModel
        .findById(conversation._id)
        .populate("property_id", "title slug city main_image_url")
        .populate("user_id", "full_name email avatar")
        .populate("host_id", "full_name email avatar");
    }

    return conversation;
  },
  getById: async (conversationId, userId) => {
    const conversation = await conversationModel
      .findById(conversationId)
      .populate("property_id", "title slug city main_image_url")
      .populate("user_id", "full_name email avatar")
      .populate("host_id", "full_name email avatar");

    if (!conversation) {
      throw new BadRequestException("Không tìm thấy cuộc trò chuyện.");
    }

    const isUserInConversation =
      String(conversation.user_id._id) === String(userId) ||
      String(conversation.host_id._id) === String(userId);

    if (!isUserInConversation) {
      throw new BadRequestException(
        "Bạn không có quyền xem cuộc trò chuyện này.",
      );
    }

    return conversation;
  },
  getMyConversations: async (userId) => {
    return await conversationModel
      .find({
        $or: [
          {
            user_id: userId,
            last_message: { $nin: ["", null] },
            last_message_at: { $ne: null },
          },
          {
            host_id: userId,
            last_message: { $nin: ["", null] },
            last_message_at: { $ne: null },
          },
        ],
      })
      .populate("property_id", "title slug city main_image_url")
      .populate("user_id", "full_name email avatar")
      .populate("host_id", "full_name email avatar")
      .sort({ last_message_at: -1 });
  },
};

module.exports = conversationService;
