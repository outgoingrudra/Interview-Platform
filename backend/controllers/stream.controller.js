import {
  streamVideoClient,
  streamChatClient,
} from "../configs/stream.js";
import Interview from "../models/Interview.js";
import InterviewSession from "../models/InterviewSession.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getStreamToken = asyncHandler(async (req, res) => {
  const streamUserId = req.user._id.toString();

  const streamUser = {
    id: streamUserId,
    name: req.user.name,
    image: req.user.imageUrl || "",
    role: "user",
  };

  await Promise.all([
    streamVideoClient.upsertUsers([streamUser]),
    streamChatClient.upsertUsers([streamUser]),
  ]);

  const videoToken = streamVideoClient.generateUserToken({
    user_id: streamUserId,
  });

  const chatToken = streamChatClient.createToken(streamUserId);

  res.status(200).json({
    success: true,
    apiKey: process.env.STREAM_API_KEY,
    user: streamUser,
    videoToken,
    chatToken,
  });
});


export const getInterviewRoom = asyncHandler(async (req, res) => {
  const interview = await Interview.findById(req.params.interviewId);

  if (!interview) {
    throw new ApiError(404, "Interview not found");
  }

  if (interview.status !== "live") {
    throw new ApiError(400, "Interview is not live");
  }

  if (!interview.meetingId) {
    throw new ApiError(400, "Interview room has not been created");
  }

  const isHost =
    interview.host.toString() === req.user._id.toString();

  const session = await InterviewSession.findOne({
    interview: interview._id,
    candidate: req.user._id,
    status: "active",
  });

  if (!isHost && !session) {
    throw new ApiError(403, "You cannot access this interview room");
  }

  if (session && new Date() > session.expiresAt) {
    session.status = "expired";
    await session.save();

    throw new ApiError(400, "Your interview session has expired");
  }

  res.status(200).json({
    success: true,
    room: {
      meetingId: interview.meetingId,
      callType: "default",
      channelType: "messaging",
      isHost,
    },
  });
});
