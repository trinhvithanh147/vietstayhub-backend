const { responseSuccess } = require("../helpers/response.helper");
const propertiesService = require("../services/properties.service");

const propertiesController = {
  getAll: async (req, res, next) => {
    try {
      const data = await propertiesService.getAll();
      const response = responseSuccess(data, "Tạo Properties thành công", 200);
      res.status(response.code).json(response);
    } catch (err) {
      next(err);
    }
  },
  getCity: async (req, res, next) => {
    try {
      const { city } = req.params;

      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const data = await propertiesService.getCity(city, page, limit);

      return res.status(200).json({
        message: "Get properties by city successfully",
        metaData: data,
      });
    } catch (error) {
      next(error);
    }
  },
  getBySlug: async (req, res, next) => {
    const city = req.params.city;
    const slug = req.params.slug;
    try {
      const data = await propertiesService.getBySlug(slug, city);
      const response = responseSuccess(data, "Tạo Properties thành công", 200);
      res.status(response.code).json(response);
    } catch (err) {
      next(err);
    }
  },
  create: async (req, res, next) => {
    const newProperties = req.body;
    try {
      const data = await propertiesService.create(newProperties);
      const response = responseSuccess(data, "Tạo Properties thành công", 200);
      res.status(response.code).json(response);
    } catch (err) {
      next(err);
    }
  },
  update: async (req, res, next) => {
    const id = req.params.id;
    const body = req.body;
    try {
      const data = await propertiesService.update(id, body);
      const response = responseSuccess(
        data,
        "Cập nhật Properties thành công",
        200,
      );
      res.status(response.code).json(response);
    } catch (err) {
      next(err);
    }
  },
  delete: async (req, res, next) => {
    const id = req.params.id;
    try {
      const data = await propertiesService.delete(id);
      const response = responseSuccess(data, "Xóa Properties thành công", 200);
      res.status(response.code).json(response);
    } catch (err) {
      next(err);
    }
  },
  uploadMainImageLocal: async (req, res, next) => {
    const id = req.params.id;
    try {
      const data = await propertiesService.uploadMainImageLocal(id, req.file);
      const response = responseSuccess(
        data,
        "Upload main image local thành công",
        200,
      );
      res.status(response.code).json(response);
    } catch (err) {
      next(err);
    }
  },
  uploadMainImageCloud: async (req, res, next) => {
    const id = req.params.id;
    try {
      const data = await propertiesService.uploadMainImageCloud(id, req.file);
      const response = responseSuccess(
        data,
        "Upload main image cloud thành công",
        200,
      );
      res.status(response.code).json(response);
    } catch (err) {
      next(err);
    }
  },
  uploadGalleryCloud: async (req, res, next) => {
    const id = req.params.id;
    try {
      const data = await propertiesService.uploadGalleryCloud(id, req.files);
      const response = responseSuccess(
        data,
        "Upload gallery cloud thành công",
        200,
      );
      res.status(response.code).json(response);
    } catch (err) {
      next(err);
    }
  },
};
module.exports = propertiesController;
