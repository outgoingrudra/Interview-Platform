import InterviewSession from "../models/InterviewSession.js";
import SecurityEvent from "../models/SecurityEvents.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const recordSecurityEvent = asyncHandler(async (req, res) => {
  const { type, severity, message, metadata } = req.body;

  const session = await InterviewSession.findById(
    req.params.sessionId,
  ).populate("interview");

  if (!session) {
    throw new ApiError(404, "Interview session not found");
  }

  if (session.candidate.toString() !== req.user._id.toString()) {
    throw new ApiError(
      403,
      "You cannot report events for this session",
    );
  }

  if (session.status !== "active") {
    throw new ApiError(
      400,
      "Security events cannot be reported for a closed session",
    );
  }

  if (session.expiresAt && new Date() > session.expiresAt) {
    session.status = "expired";
    await session.save();

    throw new ApiError(400, "Interview session has expired");
  }

  const allowedTypes = [
    "tab_switch",
    "copy_attempt",
    "paste_attempt",
    "fullscreen_exit",
    "face_not_detected",
    "multiple_faces",
    "camera_disconnected",
    "suspicious_gesture",
     "looking_away",
  ];
  

  if (!allowedTypes.includes(type)) {
    throw new ApiError(400, "Invalid security event type");
  }

  const allowedSeverities = ["low", "medium", "high"];

  if (severity && !allowedSeverities.includes(severity)) {
    throw new ApiError(400, "Invalid security event severity");
  }

  const duplicateWindow = new Date(Date.now() - 3000);

  const recentDuplicate = await SecurityEvent.findOne({
    session: session._id,
    type,
    createdAt: {
      $gte: duplicateWindow,
    },
  });

  if (recentDuplicate) {
    return res.status(200).json({
      success: true,
      message: "Duplicate security event ignored",
      warningCount: session.warningCount,
      warningLimit:
        session.interview.securitySettings?.warningLimit || 3,
      countedAsWarning: false,
      terminated: false,
    });
  }

  const reportOnlyTypes = ["suspicious_gesture"];

  const countedAsWarning = !reportOnlyTypes.includes(type);

  const securityEvent = await SecurityEvent.create({
    session: session._id,
    type,
    severity: severity || "low",
    message: message || "",
    metadata: metadata || {},
  });

  if (countedAsWarning) {
    session.warningCount += 1;
  }

  const warningLimit =
    session.interview.securitySettings?.warningLimit || 3;

  let terminated = false;

  if (
    countedAsWarning &&
    session.warningCount >= warningLimit
  ) {
    session.status = "terminated";
    session.terminationReason =
      type === "camera_disconnected"
        ? "Camera disconnected during the interview"
        : "Security warning limit exceeded";

    session.submittedAt = new Date();
    terminated = true;
  }

  await session.save();

  res.status(201).json({
    success: true,
    message: terminated
      ? "Session terminated due to security violations"
      : countedAsWarning
        ? "Security warning recorded"
        : "Security event recorded for review",
    securityEvent,
    warningCount: session.warningCount,
    warningLimit,
    countedAsWarning,
    terminated,
  });
});