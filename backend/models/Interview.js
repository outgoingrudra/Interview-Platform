import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },

    options: {
      type: [String],
      required: true,
      validate: [
        {
          validator: (options) =>
            options?.length >= 2 &&
            options?.length <= 6 &&
            options?.every(
              (option) => option?.trim()?.length > 0,
            ),
          message:
            "Question must have 2 to 6 non-empty options.",
        },
        {
          validator: (options) =>
            new Set(
              options?.map((option) =>
                option?.trim()?.toLowerCase(),
              ),
            ).size === options?.length,
          message: "Duplicate options are not allowed.",
        },
      ],
    },

    correctOption: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: function (value) {
          return value < this.options?.length;
        },
        message: "Invalid correct option index.",
      },
    },

    marks: {
      type: Number,
      default: 1,
      min: 1,
    },
  },
  {
    _id: true,
  },
);

const securitySettingsSchema = new mongoose.Schema(
  {
    preventCopyPaste: {
      type: Boolean,
      default: false,
    },

    detectTabSwitch: {
      type: Boolean,
      default: false,
    },

    requireFullscreen: {
      type: Boolean,
      default: false,
    },

    detectFace: {
      type: Boolean,
      default: false,
    },

    detectMultipleFaces: {
      type: Boolean,
      default: false,
    },

    detectSuspiciousGesture: {
      type: Boolean,
      default: false,
    },

    detectCameraDisconnect: {
      type: Boolean,
      default: false,
    },

    warningLimit: {
      type: Number,
      default: 3,
      min: 1,
    },
  },
  {
    _id: false,
  },
);

const interviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    durationMinutes: {
      type: Number,
      required: true,
      min: 1,
    },

    status: {
      type: String,
      enum: [
        "draft",
        "scheduled",
        "live",
        "completed",
        "cancelled",
      ],
      default: "draft",
    },

    questions: {
      type: [questionSchema],
      default: [],
    },

    securitySettings: {
      type: securitySettingsSchema,
      default: () => ({}),
    },

    startsAt: {
      type: Date,
      default: null,
    },

    endsAt: {
      type: Date,
      default: null,
    },

    meetingId: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  },
);

interviewSchema.pre("validate", function () {
  if (
    this.startsAt &&
    this.endsAt &&
    this.endsAt <= this.startsAt
  ) {
    throw new Error("endsAt must be after startsAt");
  }
});

export default mongoose.model(
  "Interview",
  interviewSchema,
);