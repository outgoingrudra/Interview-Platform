import express from "express";
import {
  getStreamToken,
  getInterviewRoom,
} from "../controllers/stream.controller.js";
import protectRoute from "../middlewares/protectRoute.js";
import attachUser from "../middlewares/attachUser.js";

const router = express.Router();

router.get("/token", protectRoute, attachUser, getStreamToken);

router.get("/room/:interviewId", protectRoute, attachUser, getInterviewRoom);

export default router;
