const OpenAI = require("openai");

const proPertiesModel = require("../models/properties.model");
const roomModel = require("../models/rooms.model");
const reviewModel = require("../models/reviews.model");
const { OPENAI_API_KEY } = require("../constants/app.constant");

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

const moneyFormatter = new Intl.NumberFormat("vi-VN");

const buildPropertySummary = async () => {
  const properties = await proPertiesModel.find().limit(20).lean();
  const rooms = await roomModel.find().lean();
  const reviews = await reviewModel.find({ is_visible: { $ne: false } }).lean();

  return properties.map((property) => {
    const propertyRooms = rooms.filter(
      (room) => String(room.property_id) === String(property._id),
    );

    const propertyReviews = reviews.filter(
      (review) => String(review.property_id) === String(property._id),
    );

    const avgRating =
      propertyReviews.length > 0
        ? (
            propertyReviews.reduce(
              (sum, item) => sum + Number(item.rating || 0),
              0,
            ) / propertyReviews.length
          ).toFixed(1)
        : "Chưa có đánh giá";

    const roomText = propertyRooms
      .map((room) => {
        return `- Phòng: ${room.name}, sức chứa ${room.capacity} khách, giá ${moneyFormatter.format(room.price || 0)} VND/đêm, còn ${room.quantity} phòng`;
      })
      .join("\n");

    return `
Khách sạn: ${property.title}
Thành phố: ${property.city}
Địa chỉ: ${property.address || "Chưa cập nhật"}
Giá cơ bản: ${moneyFormatter.format(property.base_price || 0)} VND
Đánh giá trung bình: ${avgRating}
Mô tả: ${property.description || "Không có mô tả"}
Phòng:
${roomText || "Chưa có phòng"}
`;
  });
};

const aiService = {
  suggestStay: async (message) => {
    const propertyContext = await buildPropertySummary();

    const prompt = `
Bạn là trợ lý AI cho website đặt phòng khách sạn.

Nhiệm vụ:
- Tư vấn chỗ nghỉ phù hợp dựa trên nhu cầu người dùng.
- Chỉ gợi ý dựa trên danh sách khách sạn/phòng được cung cấp.
- Trả lời bằng tiếng Việt.
- Trả lời rõ ràng, thân thiện, dễ hiểu.
- Nếu không đủ dữ liệu, hãy hỏi thêm thông tin như thành phố, ngày đi, số khách, ngân sách.

Danh sách chỗ nghỉ hiện có:
${propertyContext.join("\n---\n")}

Nhu cầu người dùng:
${message}
`;

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    return response.output_text;
  },
};

module.exports = aiService;
