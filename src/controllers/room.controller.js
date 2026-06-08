const { responseSuccess } = require("../helpers/response.helper");
const roomService = require("../services/room.service");

const roomController = {
  getAll: async (req, res, next) => {
    try {
      const data = await roomService.getAll();
      const response = responseSuccess(data, "Lấy room thành công", 200);
      res.status(response.code).json(response);
    } catch (err) {
      next(err);
    }
  },
  getByPropertyId: async (req, res, next) => {
    const propertyId = req.params.propertyId;
    try {
      const data = await roomService.getByPropertyId(propertyId);
      const response = responseSuccess(data, "Lấy room thành công", 200);
      res.status(response.code).json(response);
    } catch (err) {
      next(err);
    }
  },
  create: async (req, res, next) => {
    const newRoom = req.body;
    try {
      const data = await roomService.create(newRoom);
      const response = responseSuccess(data, "Tạo room thành công", 200);
      res.status(response.code).json(response);
    } catch (err) {
      next(err);
    }
  },
  update: async (req, res, next) => {
    const id = req.params.id;
    const body = req.body;
    try {
      const data = await roomService.update(id, body);
      const response = responseSuccess(data, "Cập nhật room thành công", 200);
      res.status(response.code).json(response);
    } catch (err) {
      next(err);
    }
  },
  delete: async (req, res, next) => {
    const id = req.params.id;
    try {
      const data = await roomService.delete(id);
      const response = responseSuccess(data, "Xóa room thành công", 200);
      res.status(response.code).json(response);
    } catch (err) {
      next(err);
    }
  },
};

module.exports = roomController;
