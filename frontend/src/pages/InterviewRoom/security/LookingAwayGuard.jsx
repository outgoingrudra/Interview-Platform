import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import {
  FaceLandmarker,
  FilesetResolver,
} from "@mediapipe/tasks-vision";

import { useCreateSecurityEventMutation } from "../../../api/securityApi";

const WASM_URL =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm";

const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";

/*
  MediaPipe landmark indexes used:

  1   → nose tip
  33  → left outer eye
  263 → right outer eye
  10  → upper forehead
  152 → chin
*/

const SAMPLE_INTERVAL_MS = 400;
const REQUIRED_SUSPICIOUS_SAMPLES = 4; // About 3 seconds
const REPORT_COOLDOWN_MS = 8000;

const YAW_THRESHOLD = 0.15;
const PITCH_THRESHOLD = 0.14;

const getMidpoint = (pointA, pointB) => ({
  x: (pointA?.x + pointB?.x) / 2,
  y: (pointA?.y + pointB?.y) / 2,
});

const getHeadDirection = (landmarks) => {
  const nose = landmarks?.[1];
  const leftEye = landmarks?.[33];
  const rightEye = landmarks?.[263];
  const forehead = landmarks?.[10];
  const chin = landmarks?.[152];

  if (
    !nose ||
    !leftEye ||
    !rightEye ||
    !forehead ||
    !chin
  ) {
    return null;
  }

  const eyeCenter = getMidpoint(leftEye, rightEye);

  const eyeDistance = Math.max(
    Math.abs(rightEye?.x - leftEye?.x),
    0.001,
  );

  const faceHeight = Math.max(
    Math.abs(chin?.y - forehead?.y),
    0.001,
  );

  /*
    Positive yaw:
    nose moved toward one side relative to eye center.
  */
  const yaw =
    (nose?.x - eyeCenter?.x) / eyeDistance;

  /*
    Compare nose location vertically with an expected
    approximate neutral position between forehead and chin.
  */
  const expectedNoseY =
    forehead?.y + faceHeight * 0.52;

  const pitch =
    (nose?.y - expectedNoseY) / faceHeight;

  let direction = "center";

  if (yaw > YAW_THRESHOLD) {
    direction = "right";
  } else if (yaw < -YAW_THRESHOLD) {
    direction = "left";
  } else if (pitch > PITCH_THRESHOLD) {
    direction = "down";
  } else if (pitch < -PITCH_THRESHOLD) {
    direction = "up";
  }

  return {
    direction,
    yaw,
    pitch,
  };
};

export default function LookingAwayGuard({
  sessionId,
  enabled,
  onWarning,
  onTerminated,
}) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const landmarkerRef = useRef(null);
  const intervalRef = useRef(null);

  const suspiciousSamplesRef = useRef(0);
  const reportingRef = useRef(false);
  const lastDirectionRef = useRef("center");

  const [createSecurityEvent] =
    useCreateSecurityEventMutation();

  useEffect(() => {
    if (!enabled || !sessionId) return;

    let cancelled = false;

    const reportLookingAway = async ({
      direction,
      yaw,
      pitch,
    }) => {
      if (reportingRef.current || cancelled) return;

      reportingRef.current = true;

      try {
        const response = await createSecurityEvent({
          sessionId,
          event: {
            type: "looking_away",
            severity: "medium",
            message: `Candidate continuously looked ${direction} during the interview`,
            metadata: {
              direction,
              yaw: Number(yaw?.toFixed(3)),
              pitch: Number(pitch?.toFixed(3)),
              durationSeconds:
                (REQUIRED_SUSPICIOUS_SAMPLES *
                  SAMPLE_INTERVAL_MS) /
                1000,
              occurredAt: new Date().toISOString(),
            },
          },
        }).unwrap();

        if (response?.countedAsWarning !== false) {
          onWarning?.(response?.warningCount);
        }

        if (response?.terminated) {
          toast.error(
            "Interview terminated due to repeated security violations",
          );

          onTerminated?.(
            `Repeated looking away detected. Warning limit ${response?.warningLimit} reached.`,
          );

          return;
        }

        toast.error(
          `Looking ${direction} detected. Warning ${response?.warningCount}/${response?.warningLimit}`,
        );
      } catch (error) {
        console.error(
          "Failed to report looking-away event:",
          error,
        );
      } finally {
        window.setTimeout(() => {
          reportingRef.current = false;
        }, REPORT_COOLDOWN_MS);
      }
    };

    const initialiseDetection = async () => {
      try {
        const vision =
          await FilesetResolver.forVisionTasks(WASM_URL);

        if (cancelled) return;

        const landmarker =
          await FaceLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: MODEL_URL,
              delegate: "GPU",
            },
            runningMode: "VIDEO",
            numFaces: 1,
            minFaceDetectionConfidence: 0.65,
            minFacePresenceConfidence: 0.65,
            minTrackingConfidence: 0.65,
            outputFaceBlendshapes: false,
            outputFacialTransformationMatrixes: false,
          });

        if (cancelled) {
          landmarker?.close();
          return;
        }

        landmarkerRef.current = landmarker;

        const mediaStream =
          await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: "user",
              width: { ideal: 640 },
              height: { ideal: 480 },
            },
            audio: false,
          });

        if (cancelled) {
          mediaStream
            ?.getTracks()
            ?.forEach((track) => track?.stop());

          return;
        }

        streamRef.current = mediaStream;

        const video = videoRef.current;

        if (!video) {
          mediaStream
            ?.getTracks()
            ?.forEach((track) => track?.stop());

          return;
        }

        video.srcObject = mediaStream;
        await video.play();

        intervalRef.current = window.setInterval(() => {
          const currentVideo = videoRef.current;
          const currentLandmarker =
            landmarkerRef.current;

          if (
            !currentVideo ||
            !currentLandmarker ||
            currentVideo?.readyState < 2
          ) {
            return;
          }

          const result =
            currentLandmarker.detectForVideo(
              currentVideo,
              performance.now(),
            );

          const landmarks =
            result?.faceLandmarks?.[0];

          if (!landmarks) {
            suspiciousSamplesRef.current = 0;
            lastDirectionRef.current = "center";
            return;
          }

          const headPose =
            getHeadDirection(landmarks);

          if (!headPose) return;

          if (headPose?.direction === "center") {
            suspiciousSamplesRef.current = Math.max(
              0,
              suspiciousSamplesRef.current - 2,
            );

            lastDirectionRef.current = "center";
            return;
          }

          /*
            Reset accumulation if the person changes direction.
            This prevents random head movement from becoming
            one continuous warning.
          */
          if (
            lastDirectionRef.current !== "center" &&
            lastDirectionRef.current !==
              headPose?.direction
          ) {
            suspiciousSamplesRef.current = 0;
          }

          lastDirectionRef.current =
            headPose?.direction;

          suspiciousSamplesRef.current += 1;

          if (
            suspiciousSamplesRef.current >=
            REQUIRED_SUSPICIOUS_SAMPLES
          ) {
            suspiciousSamplesRef.current = 0;

            reportLookingAway(headPose);
          }
        }, SAMPLE_INTERVAL_MS);
      } catch (error) {
        console.error(
          "Looking-away detection could not start:",
          error,
        );

        toast.error(
          "Head movement monitoring could not start",
        );
      }
    };

    initialiseDetection();

    return () => {
      cancelled = true;

      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }

      streamRef.current
        ?.getTracks()
        ?.forEach((track) => track?.stop());

      landmarkerRef.current?.close();

      intervalRef.current = null;
      streamRef.current = null;
      landmarkerRef.current = null;

      suspiciousSamplesRef.current = 0;
      reportingRef.current = false;
      lastDirectionRef.current = "center";
    };
  }, [
    enabled,
    sessionId,
    createSecurityEvent,
    onWarning,
    onTerminated,
  ]);

  if (!enabled || !sessionId) return null;

  return (
    <video
      ref={videoRef}
      muted
      playsInline
      className="pointer-events-none fixed h-px w-px opacity-0"
      aria-hidden="true"
    />
  );
}