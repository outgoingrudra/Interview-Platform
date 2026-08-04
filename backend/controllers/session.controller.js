import Interview from "../models/Interview.js";
import InterviewSession from "../models/InterviewSession.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import CandidateAnswer from "../models/CandidateAnswer.js";
import SecurityEvent from "../models/SecurityEvents.js";
import { streamVideoClient, streamChatClient } from "../configs/stream.js";

export const joinInterview = asyncHandler(async (req, res) => {
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

  let session = await InterviewSession.findOne({
    interview: interview._id,
    candidate: req.user._id,
  });

  if (session && session.status !== "active") {
    throw new ApiError(400, "This interview session is already closed");
  }

  if (session && new Date() > session.expiresAt) {
    session.status = "expired";
    await session.save();

    throw new ApiError(400, "This interview session has expired");
  }

  if (!session) {
    const startedAt = new Date();

    const expiresAt = new Date(
      startedAt.getTime() +
        interview.durationMinutes * 60 * 1000,
    );

    session = await InterviewSession.create({
      interview: interview._id,
      candidate: req.user._id,
      startedAt,
      expiresAt,
      status: "active",
    });
  }

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
    interview.meetingId,
  );

  await videoCall.updateCallMembers({
    update_members: [
      {
        user_id: streamUserId,
        role: "user",
      },
    ],
  });

  const chatChannel = streamChatClient.channel(
    "messaging",
    interview.meetingId,
  );

  await chatChannel.addMembers([streamUserId]);

  const safeInterview = interview.toObject();

  safeInterview.questions = safeInterview.questions.map(
    (question) => ({
      _id: question._id,
      question: question.question,
      options: question.options,
      marks: question.marks,
    }),
  );

  res.status(200).json({
    success: true,
    message: "Interview session started",
    meetingId: interview.meetingId,
    session,
    interview: safeInterview,
  });
});

export const submitInterview = asyncHandler(async (req, res) => {
  const { answers } = req.body;

  const session = await InterviewSession.findById(
    req.params.sessionId,
  ).populate("interview");

  if (!session) {
    throw new ApiError(404, "Session not found");
  }

  if (session.candidate.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You cannot submit this session");
  }

  if (session.status === "submitted") {
    throw new ApiError(400, "Interview has already been submitted");
  }

  if (session.status === "terminated") {
    throw new ApiError(400, "This interview session was terminated");
  }

  if (session.status === "completed") {
    throw new ApiError(400, "This interview session is already closed");
  }

  if (session.status === "expired") {
    throw new ApiError(400, "This interview session has expired");
  }

  if (session.status !== "active") {
    throw new ApiError(400, "This session is not active");
  }

  if (new Date() > session.expiresAt) {
    session.status = "expired";
    await session.save();

    throw new ApiError(400, "Interview session has expired");
  }

  if (!Array.isArray(answers)) {
    throw new ApiError(400, "Answers must be an array");
  }
  const questionIds = answers.map((answer) => answer.questionId?.toString());

  if (questionIds.some((id) => !id)) {
    throw new ApiError(400, "Every answer must contain a questionId");
  }

  const uniqueQuestionIds = new Set(questionIds);

  if (uniqueQuestionIds.size !== questionIds.length) {
    throw new ApiError(
      400,
      "The same question cannot be answered multiple times",
    );
  }

  const existingSubmission = await CandidateAnswer.findOne({
    session: session._id,
  });

  if (existingSubmission) {
    throw new ApiError(400, "Interview has already been submitted");
  }

  let totalMarks = 0;

  const evaluatedAnswers = answers.map((answer) => {
    const question = session.interview.questions.id(answer.questionId);

    if (!question) {
      throw new ApiError(400, "Invalid question ID");
    }

    if (
      !Number.isInteger(answer.selectedOption) ||
      answer.selectedOption < 0 ||
      answer.selectedOption >= question.options.length
    ) {
      throw new ApiError(
        400,
        `Invalid selected option for question ${question._id}`,
      );
    }

    const isCorrect = answer.selectedOption === question.correctOption;

    const marksAwarded = isCorrect ? question.marks : 0;

    totalMarks += marksAwarded;

    return {
      questionId: question._id,
      selectedOption: answer.selectedOption,
      isCorrect,
      marksAwarded,
    };
  });

  const submission = await CandidateAnswer.create({
    session: session._id,
    answers: evaluatedAnswers,
    totalMarks,
  });

  session.status = "submitted";
  session.submittedAt = new Date();

  await session.save();

  res.status(201).json({
    success: true,
    message: "Interview submitted successfully",
    submission,
  });
});

export const getSessionById = asyncHandler(async (req, res) => {
  const session = await InterviewSession.findById(
    req.params.sessionId,
  )
    .populate("candidate", "name email imageUrl")
    .populate("interview");

  if (!session) {
    throw new ApiError(404, "Interview session not found");
  }

  if (!session.interview) {
    throw new ApiError(404, "Associated interview not found");
  }

  const isCandidate =
    session.candidate._id.toString() === req.user._id.toString();

  const isHost =
    session.interview.host.toString() === req.user._id.toString();

  if (!isCandidate && !isHost) {
    throw new ApiError(
      403,
      "You cannot access this interview session",
    );
  }

  if (isHost) {
    return res.status(200).json({
      success: true,
      session,
    });
  }

  const safeSession = session.toObject();

  safeSession.interview.questions =
    safeSession.interview.questions.map((question) => ({
      _id: question._id,
      question: question.question,
      options: question.options,
      marks: question.marks,
    }));

  res.status(200).json({
    success: true,
    session: safeSession,
  });
});


export const getInterviewSessions = asyncHandler(async (req, res) => {
  const interview = await Interview.findById(
    req.params.interviewId,
  );

  if (!interview) {
    throw new ApiError(404, "Interview not found");
  }

  if (interview.host.toString() !== req.user._id.toString()) {
    throw new ApiError(
      403,
      "Only the host can view interview sessions",
    );
  }

  const sessions = await InterviewSession.find({
    interview: interview._id,
  })
    .populate("candidate", "name email imageUrl")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: sessions.length,
    sessions,
  });
});

export const getCandidateResult = asyncHandler(async (req, res) => {
  const session = await InterviewSession.findById(
    req.params?.sessionId,
  )
    .populate("candidate", "name email imageUrl")
    .populate("interview", "title host status");

  if (!session) {
    throw new ApiError(404, "Interview session not found");
  }

  if (!session?.interview) {
    throw new ApiError(404, "Associated interview not found");
  }

  const isCandidate =
    session?.candidate?._id?.toString() ===
    req.user?._id?.toString();

  const isHost =
    session?.interview?.host?.toString() ===
    req.user?._id?.toString();

  if (!isCandidate && !isHost) {
    throw new ApiError(
      403,
      "You cannot access this interview result",
    );
  }

  if (
    isCandidate &&
    !["submitted", "completed"].includes(session?.status)
  ) {
    throw new ApiError(
      400,
      "Your interview result is not available yet",
    );
  }

  const submission = await CandidateAnswer.findOne({
    session: session?._id,
  });

  const securityEvents = await SecurityEvent.find({
    session: session?._id,
  }).sort({
    createdAt: 1,
  });

  res.status(200).json({
    success: true,
    result: {
      session,
      submission: submission ?? null,
      securityEvents,
    },
  });
});

export const expireSession = asyncHandler(async (req, res) => {
  const session = await InterviewSession.findById(req.params.sessionId);

  if (!session) {
    throw new ApiError(404, "Interview session not found");
  }

  if (session.candidate.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You cannot expire this session");
  }

  if (session.status !== "active") {
    return res.status(200).json({
      success: true,
      message: "Session is already closed",
      session,
    });
  }

  if (new Date() < session.expiresAt) {
    throw new ApiError(400, "Interview time has not ended yet");
  }

  session.status = "expired";
  session.submittedAt = new Date();

  await session.save();

  res.status(200).json({
    success: true,
    message: "Interview session expired",
    session,
  });
});

export const getMySessions = asyncHandler(async (req, res) => {
  const sessions = await InterviewSession.find({
    candidate: req.user?._id,
  })
    .populate({
      path: "interview",
      select:
        "title status startsAt endsAt durationMinutes host",
      populate: {
        path: "host",
        select: "name email imageUrl",
      },
    })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    sessions,
  });
});