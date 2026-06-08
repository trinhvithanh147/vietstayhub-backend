const express = require("express");

const reviewController = require("../controllers/review.controller");
const reviewRouter = express.Router();

reviewRouter.get("/getAll", reviewController.getAll);
reviewRouter.post("/create", reviewController.create);
reviewRouter.put("/update/:id", reviewController.update);
reviewRouter.patch("/visibility/:id", reviewController.updateVisibility);
reviewRouter.delete("/delete/:id", reviewController.delete);

module.exports = reviewRouter;
