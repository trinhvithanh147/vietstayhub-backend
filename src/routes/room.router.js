const express = require("express");

const roomController = require("../controllers/room.controller");
const roomRouter = express.Router();

roomRouter.get("/getAll", roomController.getAll);
roomRouter.get("/:propertyId", roomController.getByPropertyId);
roomRouter.post("/create", roomController.create);
roomRouter.put("/update/:id", roomController.update);
roomRouter.delete("/delete/:id", roomController.delete);

module.exports = roomRouter;
