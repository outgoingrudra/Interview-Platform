import mongoose from "mongoose";

const interviewSessionSchema = new mongoose.Schema(
  {
    interview: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interview",
      required: true,
    },

    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    startedAt: {
      type: Date,
      default: null,
    },

    expiresAt: {
      type: Date,
      default: null,
    },

    submittedAt: {
      type: Date,
      default: null,
    },

    warningCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: [
        "waiting",
        "active",
        "submitted",
        "expired",
        "terminated",
        "completed",
      ],
      default: "waiting",
    },

    terminationReason: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("InterviewSession", interviewSessionSchema);
