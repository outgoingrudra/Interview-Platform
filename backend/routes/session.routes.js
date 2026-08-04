import express from "express";
import {
  joinInterview,
  submitInterview,
  getSessionById,
  getInterviewSessions,
  getCandidateResult,
  expireSession,
  getMySessions,
} from "../controllers/session.controller.js";
import protectRoute from "../middlewares/protectRoute.js";
import attachUser from "../middlewares/attachUser.js";

const router = express.Router();

router.post("/join/:interviewId", protectRoute, attachUser, joinInterview);

router.post("/:sessionId/submit", protectRoute, attachUser, submitInterview);

router.patch("/:sessionId/expire", protectRoute, attachUser, expireSession);

router.get(
  "/interview/:interviewId",
  protectRoute,
  attachUser,
  getInterviewSessions,
);

router.get("/result/:sessionId", protectRoute, attachUser, getCandidateResult);
router.get("/my-sessions", protectRoute,attachUser,  getMySessions);
router.get("/:sessionId", protectRoute, attachUser, getSessionById);

export default router;
