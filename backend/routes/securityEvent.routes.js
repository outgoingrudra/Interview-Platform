import express from "express";
import { recordSecurityEvent } from "../controllers/securityEvent.controller.js";
import protectRoute from "../middlewares/protectRoute.js";
import attachUser from "../middlewares/attachUser.js";

const router = express.Router();

router.post(
  "/:sessionId",
  protectRoute,
  attachUser,
  recordSecurityEvent,
);

export default router;