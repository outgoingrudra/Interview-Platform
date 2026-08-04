import express from "express";
import {
  createInterview,
  getMyInterviews,
  getInterviewById,
  updateInterview,
  deleteInterview,
  startInterview,
  completeInterview,
  cancelInterview,
  getDashboardStats,
} from "../controllers/interview.controller.js";
import protectRoute from "../middlewares/protectRoute.js";
import attachUser from "../middlewares/attachUser.js";

const router = express.Router();

router.post("/", protectRoute, attachUser, createInterview);
router.get("/my-interviews", protectRoute, attachUser, getMyInterviews);
router.get("/dashboard/stats", protectRoute, attachUser, getDashboardStats);
router.get("/:id", protectRoute, attachUser, getInterviewById);
router.patch("/:id/start", protectRoute, attachUser, startInterview);
router.patch("/:id/complete", protectRoute, attachUser, completeInterview);
router.patch("/:id/cancel", protectRoute, attachUser, cancelInterview);
router.patch("/:id", protectRoute, attachUser, updateInterview);
router.delete("/:id", protectRoute, attachUser, deleteInterview);
export default router;
