import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    selectedOption: {
      type: Number,
      required: true,
      min: 0,
    },

    isCorrect: {
      type: Boolean,
      default: false,
    },

    marksAwarded: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { _id: false },
);

const candidateAnswerSchema = new mongoose.Schema(
  {
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InterviewSession",
      required: true,
      unique: true,
    },

    answers: {
      type: [answerSchema],
      default: [],
    },

    totalMarks: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("CandidateAnswer", candidateAnswerSchema);