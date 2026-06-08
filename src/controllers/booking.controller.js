const { responseSuccess } = require("../helpers/response.helper");
const bookingService = require("../services/booking.service");

const bookingController = {
  getAll: async (req, res, next) => {
    try {
      const data = await bookingService.getAll();
      const response = responseSuccess(data, "Tạo booking thành công", 200);
      res.status(response.code).json(response);
    } catch (err) {
      next(err);
    }
  },
  getByUserId: async (req, res, next) => {
    const userId = req.params.userId;
    try {
      const data = await bookingService.getByUserId(userId);
      const response = responseSuccess(data, "Lấy Booking thành công", 200);
      res.status(response.code).json(response);
    } catch (err) {
      next(err);
    }
  },
  create: async (req, res, next) => {
    const newBooking = req.body;
    try {
      const data = await bookingService.create(newBooking);
      const response = responseSuccess(data, "Tạo booking thành công", 200);
      res.status(response.code).json(response);
    } catch (err) {
      next(err);
    }
  },
  update: async (req, res, next) => {
    const bookingId = req.params.bookingId;
    const payload = req.body;
    try {
      const data = await bookingService.update(bookingId, payload);
      const response = responseSuccess(
        data,
        "Cập nhật Booking thành công",
        200,
      );
      res.status(response.code).json(response);
    } catch (err) {
      next(err);
    }
  },
  createPayOSPayment: async (req, res, next) => {
    const bookingId = req.params.id;

    try {
      const data = await bookingService.createPayOSPayment(bookingId);

      const response = responseSuccess(
        data,
        "Tạo link thanh toán payOS thành công",
        200,
      );

      res.status(response.code).json(response);
    } catch (err) {
      next(err);
    }
  },

  payOSWebhook: async (req, res, next) => {
    try {
      await bookingService.handlePayOSWebhook(req.body);

      res.status(200).json({
        message: "Webhook received",
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        message: "Webhook không hợp lệ",
      });
    }
  },
  delete: async (req, res, next) => {
    const bookingId = req.params.bookingId;
    try {
      const data = await bookingService.delete(bookingId);
      const response = responseSuccess(data, "Xóa booking thành công", 200);
      res.status(response.code).json(response);
    } catch (err) {
      next(err);
    }
  },
  updateStatus: async (req, res, next) => {
    const bookingId = req.params.bookingId;
    const { status } = req.body;

    try {
      const data = await bookingService.updateStatus(bookingId, status);
      const response = responseSuccess(
        data,
        "Cập nhật trạng thái booking thành công",
        200,
      );
      res.status(response.code).json(response);
    } catch (err) {
      next(err);
    }
  },
};

module.exports = bookingController;
