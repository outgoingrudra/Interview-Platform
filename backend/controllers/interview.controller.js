import Interview from "../models/Interview.js";
import InterviewSession from "../models/InterviewSession.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

import {
  streamVideoClient,
  streamChatClient,
} from "../configs/stream.js";

import redis from "../configs/redis.js";

const INTERVIEW_CACHE_TTL = 300;
const DASHBOARD_STATS_CACHE_TTL = 300;

const getInterviewCacheKey = (interviewId) =>
  `interview:details:${interviewId}`;

const getDashboardStatsCacheKey = (hostId) =>
  `dashboard:stats:${hostId}`;

const invalidateInterviewCache = async (interviewId) => {
  if (!interviewId) return;

  try {
    await redis.del(getInterviewCacheKey(interviewId));
  } catch (error) {
    console.error(
      "Failed to invalidate interview cache:",
      error,
    );
  }
};

const invalidateDashboardStatsCache = async (hostId) => {
  if (!hostId) return;

  try {
    await redis.del(getDashboardStatsCacheKey(hostId));
  } catch (error) {
    console.error(
      "Failed to invalidate dashboard stats cache:",
      error,
    );
  }
};

const invalidateInterviewRelatedCaches = async ({
  interviewId,
  hostId,
}) => {
  await Promise.all([
    invalidateInterviewCache(interviewId),
    invalidateDashboardStatsCache(hostId),
  ]);
};

export const createInterview = asyncHandler(
  async (req, res) => {
    const {
      title,
      durationMinutes,
      startsAt,
      questions,
      securitySettings,
    } = req.body;

    if (!title || !durationMinutes) {
      throw new ApiError(
        400,
        "Title and duration are required",
      );
    }

    if (startsAt) {
      const interviewDate = new Date(startsAt);
      const now = new Date();

      if (Number.isNaN(interviewDate.getTime())) {
        throw new ApiError(
          400,
          "Invalid interview schedule",
        );
      }

      if (interviewDate < now) {
        throw new ApiError(
          400,
          "Interview cannot be scheduled in the past",
        );
      }

      const oneYearLater = new Date();

      oneYearLater.setFullYear(
        oneYearLater.getFullYear() + 1,
      );

      if (interviewDate > oneYearLater) {
        throw new ApiError(
          400,
          "Interview can be scheduled at most 1 year in advance",
        );
      }
    }

    const interview = await Interview.create({
      title,
      host: req.user._id,
      durationMinutes,
      startsAt,
      questions: questions || [],
      securitySettings: securitySettings || {},
      status: startsAt ? "scheduled" : "draft",
    });

    await invalidateDashboardStatsCache(req.user._id);

    return res.status(201).json({
      success: true,
      message: "Interview created successfully",
      interview,
    });
  },
);

export const getMyInterviews = asyncHandler(
  async (req, res) => {
    const interviews = await Interview.find({
      host: req.user._id,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: interviews.length,
      interviews,
    });
  },
);

export const getInterviewById = asyncHandler(
  async (req, res) => {
    const interviewId = req.params.id;
    const cacheKey = getInterviewCacheKey(interviewId);

    let interview = null;

    try {
      interview = await redis.get(cacheKey);
    } catch (error) {
      console.error(
        "Failed to read interview from Redis:",
        error,
      );
    }

    if (!interview) {
      interview = await Interview.findById(interviewId)
        .populate("host", "name email imageUrl")
        .lean();

      if (!interview) {
        throw new ApiError(404, "Interview not found");
      }

      try {
        await redis.set(cacheKey, interview, {
          ex: INTERVIEW_CACHE_TTL,
        });
      } catch (error) {
        console.error(
          "Failed to cache interview in Redis:",
          error,
        );
      }
    }

    const hostId =
      interview?.host?._id ?? interview?.host;

    const isHost =
      String(hostId) === String(req.user?._id);

    if (isHost) {
      return res.status(200).json({
        success: true,
        isHost: true,
        interview,
      });
    }

    if (interview?.status !== "live") {
      throw new ApiError(
        403,
        "You cannot access this interview",
      );
    }

    const safeInterview = {
      ...interview,

      questions: (interview?.questions ?? []).map(
        (question) => ({
          _id: question?._id,
          question: question?.question,
          options: question?.options ?? [],
          marks: question?.marks ?? 1,
        }),
      ),
    };

    return res.status(200).json({
      success: true,
      isHost: false,
      interview: safeInterview,
    });
  },
);

export const updateInterview = asyncHandler(
  async (req, res) => {
    const interview = await Interview.findById(
      req.params.id,
    );

    if (!interview) {
      throw new ApiError(404, "Interview not found");
    }

    if (
      interview.host.toString() !==
      req.user._id.toString()
    ) {
      throw new ApiError(
        403,
        "Only the host can update this interview",
      );
    }

    const allowedFields = [
      "title",
      "durationMinutes",
      "startsAt",
      "questions",
      "securitySettings",
      "status",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        interview[field] = req.body[field];
      }
    });

    await interview.save();

    await invalidateInterviewRelatedCaches({
      interviewId: interview._id,
      hostId: interview.host,
    });

    return res.status(200).json({
      success: true,
      message: "Interview updated successfully",
      interview,
    });
  },
);

export const deleteInterview = asyncHandler(
  async (req, res) => {
    const interview = await Interview.findById(
      req.params.id,
    );

    if (!interview) {
      throw new ApiError(404, "Interview not found");
    }

    if (
      interview.host.toString() !==
      req.user._id.toString()
    ) {
      throw new ApiError(
        403,
        "Only the host can delete this interview",
      );
    }

    if (
      ["live", "completed", "cancelled"].includes(
        interview.status,
      )
    ) {
      throw new ApiError(
        400,
        "Only draft or scheduled interviews can be deleted",
      );
    }

    const interviewId = interview._id.toString();
    const hostId = interview.host.toString();

    await interview.deleteOne();

    await invalidateInterviewRelatedCaches({
      interviewId,
      hostId,
    });

    return res.status(200).json({
      success: true,
      message: "Interview deleted successfully",
    });
  },
);

export const startInterview = asyncHandler(
  async (req, res) => {
    const interview = await Interview.findById(
      req.params.id,
    );

    if (!interview) {
      throw new ApiError(404, "Interview not found");
    }

    if (
      interview.host.toString() !==
      req.user._id.toString()
    ) {
      throw new ApiError(
        403,
        "Only the host can start this interview",
      );
    }

    if (interview.status === "live") {
      throw new ApiError(
        400,
        "Interview is already live",
      );
    }

    if (interview.status === "completed") {
      throw new ApiError(
        400,
        "Completed interview cannot be restarted",
      );
    }

    if (interview.status === "cancelled") {
      throw new ApiError(
        400,
        "Cancelled interview cannot be started",
      );
    }

    const meetingId =
      interview.meetingId ||
      `interview-${interview._id.toString()}`;

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

    const videoCall = streamVideoClient.video.call(
      "default",
      meetingId,
    );

    await videoCall.getOrCreate({
      data: {
        created_by_id: streamUserId,

        members: [
          {
            user_id: streamUserId,
            role: "admin",
          },
        ],

        custom: {
          interviewId: interview._id.toString(),
          title: interview.title,
        },
      },
    });

    const chatChannel = streamChatClient.channel(
      "messaging",
      meetingId,
      {
        name: interview.title,
        created_by_id: streamUserId,
        members: [streamUserId],
        interviewId: interview._id.toString(),
      },
    );

    await chatChannel.create();

    interview.meetingId = meetingId;
    interview.status = "live";
    interview.startsAt = new Date();

    await interview.save();

    await invalidateInterviewRelatedCaches({
      interviewId: interview._id,
      hostId: interview.host,
    });

    return res.status(200).json({
      success: true,
      message: "Interview started successfully",
      meetingId,
      interview,
    });
  },
);

export const completeInterview = asyncHandler(
  async (req, res) => {
    const interview = await Interview.findById(
      req.params.id,
    );

    if (!interview) {
      throw new ApiError(404, "Interview not found");
    }

    if (
      interview.host?.toString() !==
      req.user?._id?.toString()
    ) {
      throw new ApiError(
        403,
        "Only the host can complete this interview",
      );
    }

    if (interview.status === "completed") {
      throw new ApiError(
        400,
        "Interview is already completed",
      );
    }

    if (interview.status !== "live") {
      throw new ApiError(
        400,
        "Only a live interview can be completed",
      );
    }

    const completedAt = new Date();

    if (interview.meetingId) {
      try {
        const videoCall = streamVideoClient.video.call(
          "default",
          interview.meetingId,
        );

        await videoCall.end();
      } catch (error) {
        console.error(
          "Failed to end Stream video call:",
          error?.message || error,
        );
      }

      try {
        const chatChannel = streamChatClient.channel(
          "messaging",
          interview.meetingId,
        );

        await chatChannel.update({
          frozen: true,
        });
      } catch (error) {
        console.error(
          "Failed to freeze Stream chat:",
          error?.message || error,
        );
      }
    }

    interview.status = "completed";
    interview.endsAt = completedAt;

    await interview.save();

    await InterviewSession.updateMany(
      {
        interview: interview._id,
        status: "active",
      },
      {
        $set: {
          status: "completed",
          submittedAt: completedAt,
        },
      },
    );

    await invalidateInterviewRelatedCaches({
      interviewId: interview._id,
      hostId: interview.host,
    });

    return res.status(200).json({
      success: true,
      message: "Interview completed successfully",
      interview,
    });
  },
);

export const cancelInterview = asyncHandler(
  async (req, res) => {
    const interview = await Interview.findById(
      req.params.id,
    );

    if (!interview) {
      throw new ApiError(404, "Interview not found");
    }

    if (
      interview.host.toString() !==
      req.user._id.toString()
    ) {
      throw new ApiError(
        403,
        "Only the host can cancel this interview",
      );
    }

    if (interview.status === "cancelled") {
      throw new ApiError(
        400,
        "Interview is already cancelled",
      );
    }

    if (interview.status === "completed") {
      throw new ApiError(
        400,
        "Completed interview cannot be cancelled",
      );
    }

    if (interview.status === "live") {
      throw new ApiError(
        400,
        "Complete the live interview instead of cancelling it",
      );
    }

    interview.status = "cancelled";
    interview.endsAt = new Date();

    await interview.save();

    await invalidateInterviewRelatedCaches({
      interviewId: interview._id,
      hostId: interview.host,
    });

    return res.status(200).json({
      success: true,
      message: "Interview cancelled successfully",
      interview,
    });
  },
);

export const getDashboardStats = asyncHandler(
  async (req, res) => {
    const hostId = req.user._id.toString();

    const cacheKey =
      getDashboardStatsCacheKey(hostId);

    let stats = null;

    try {
      stats = await redis.get(cacheKey);
    } catch (error) {
      console.error(
        "Failed to read dashboard stats from Redis:",
        error,
      );
    }

    if (!stats) {
      const interviews = await Interview.find({
        host: req.user._id,
      })
        .select("status")
        .lean();

      stats = {
        total: interviews.length,
        draft: 0,
        scheduled: 0,
        live: 0,
        completed: 0,
        cancelled: 0,
      };

      interviews.forEach((interview) => {
        if (stats[interview.status] !== undefined) {
          stats[interview.status] += 1;
        }
      });

      try {
        await redis.set(cacheKey, stats, {
          ex: DASHBOARD_STATS_CACHE_TTL,
        });
      } catch (error) {
        console.error(
          "Failed to cache dashboard stats in Redis:",
          error,
        );
      }
    }

    return res.status(200).json({
      success: true,
      stats,
    });
  },
);