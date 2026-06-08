const express = require("express");
const aiController = require("../controllers/ai.controller");

const aiRouter = express.Router();

aiRouter.post("/suggest-stay", aiController.suggestStay);

module.exports = aiRouter;
