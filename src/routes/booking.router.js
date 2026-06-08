const express = require("express");

const bookingController = require("../controllers/booking.controller");
const bookingRouter = express.Router();

bookingRouter.get("/getAll", bookingController.getAll);
bookingRouter.get("/user/:userId", bookingController.getByUserId);
bookingRouter.post("/create", bookingController.create);
bookingRouter.put("/update/:bookingId", bookingController.update);
bookingRouter.delete("/delete/:bookingId", bookingController.delete);
bookingRouter.patch("/:bookingId/status", bookingController.updateStatus);
bookingRouter.post("/payos/create/:id", bookingController.createPayOSPayment);
bookingRouter.post("/payos/webhook", bookingController.payOSWebhook);
module.exports = bookingRouter;
