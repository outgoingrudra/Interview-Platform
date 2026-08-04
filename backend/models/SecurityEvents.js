import mongoose from "mongoose";

const securityEventSchema = new mongoose.Schema(
  {
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InterviewSession",
      required: true,
    },

    type: {
      type: String,
      enum: [
        "tab_switch",
        "copy_attempt",
        "paste_attempt",
        "fullscreen_exit",
        "face_not_detected",
        "multiple_faces",
        "camera_disconnected",
        "suspicious_gesture",

        // Keep these only if you plan to use them later
        "looking_away",
        "microphone_off",
      ],
      required: true,
    },

    severity: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },

    message: {
      type: String,
      default: "",
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model(
  "SecurityEvent",
  securityEventSchema,
);