const { responseSuccess } = require("../helpers/response.helper");
const aiService = require("../services/ai.service");
const aiController = {
  suggestStay: async (req, res, next) => {
    try {
      const { message } = req.body;

      if (!message || !message.trim()) {
        return res.status(400).json({
          message: "Vui lòng nhập nội dung cần tư vấn",
        });
      }

      const data = await aiService.suggestStay(message);

      const response = responseSuccess(
        data,
        "AI gợi ý chỗ nghỉ thành công",
        200,
      );

      res.status(response.code).json(response);
    } catch (err) {
      next(err);
    }
  },
};

module.exports = aiController;
