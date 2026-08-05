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

const SAMPLE_INTERVAL_MS = 400;

/*
  8 samples × 400 ms = about 3.2 seconds before
  the first warning.
*/
const REQUIRED_SUSPICIOUS_SAMPLES = 8;

/*
  If the candidate continues looking away,
  create another warning every 15 seconds.
*/
const REPEAT_WARNING_INTERVAL_MS = 15000;

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

  const eyeCenter = getMidpoint(
    leftEye,
    rightEye,
  );

  const eyeDistance = Math.max(
    Math.abs(rightEye.x - leftEye.x),
    0.001,
  );

  const faceHeight = Math.max(
    Math.abs(chin.y - forehead.y),
    0.001,
  );

  const yaw =
    (nose.x - eyeCenter.x) /
    eyeDistance;

  const expectedNoseY =
    forehead.y + faceHeight * 0.52;

  const pitch =
    (nose.y - expectedNoseY) /
    faceHeight;

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
  const terminatedRef = useRef(false);

  const lastDirectionRef =
    useRef("center");

  const currentDirectionRef =
    useRef("center");

  const lastWarningAtRef = useRef(0);
  const noticeShownRef = useRef(false);

  const [createSecurityEvent] =
    useCreateSecurityEventMutation();

  useEffect(() => {
    if (!enabled || !sessionId) {
      return;
    }

    let cancelled = false;

    const resetLookingAwayState = () => {
      suspiciousSamplesRef.current = 0;
      lastDirectionRef.current =
        "center";
      currentDirectionRef.current =
        "center";
      lastWarningAtRef.current = 0;
      noticeShownRef.current = false;
    };

    const reportLookingAway = async ({
      direction,
      yaw,
      pitch,
    }) => {
      if (
        reportingRef.current ||
        terminatedRef.current ||
        cancelled
      ) {
        return;
      }

      reportingRef.current = true;

      try {
        const response =
          await createSecurityEvent({
            sessionId,
            event: {
              type: "looking_away",
              severity: "medium",
              message: `Candidate continuously looked ${direction} during the interview`,
              metadata: {
                direction,
                yaw: Number(
                  yaw?.toFixed(3),
                ),
                pitch: Number(
                  pitch?.toFixed(3),
                ),
                durationSeconds:
                  (REQUIRED_SUSPICIOUS_SAMPLES *
                    SAMPLE_INTERVAL_MS) /
                  1000,
                occurredAt:
                  new Date().toISOString(),
              },
            },
          }).unwrap();

        if (
          response?.countedAsWarning !==
          false
        ) {
          onWarning?.(
            response?.warningCount,
          );
        }

        if (response?.terminated) {
          terminatedRef.current = true;

          toast.error(
            "Interview terminated due to repeated looking-away violations",
          );

          onTerminated?.(
            `Repeated looking away detected. Warning limit ${
              response?.warningLimit ?? ""
            } reached.`,
          );

          return;
        }

        toast.error(
          `Candidate kept looking ${direction}. Warning ${
            response?.warningCount ?? 0
          }/${response?.warningLimit ?? 0}`,
        );
      } catch (error) {
        console.error(
          "Failed to report looking-away event:",
          error,
        );
      } finally {
        reportingRef.current = false;
      }
    };

    const initialiseDetection = async () => {
      try {
        const vision =
          await FilesetResolver.forVisionTasks(
            WASM_URL,
          );

        if (cancelled) return;

        const landmarker =
          await FaceLandmarker.createFromOptions(
            vision,
            {
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
              outputFacialTransformationMatrixes:
                false,
            },
          );

        if (cancelled) {
          landmarker?.close?.();
          return;
        }

        landmarkerRef.current =
          landmarker;

        const mediaStream =
          await navigator.mediaDevices.getUserMedia(
            {
              video: {
                facingMode: "user",
                width: {
                  ideal: 640,
                },
                height: {
                  ideal: 480,
                },
              },
              audio: false,
            },
          );

        if (cancelled) {
          mediaStream
            .getTracks()
            .forEach((track) =>
              track.stop(),
            );

          return;
        }

        streamRef.current =
          mediaStream;

        const video =
          videoRef.current;

        if (!video) {
          mediaStream
            .getTracks()
            .forEach((track) =>
              track.stop(),
            );

          return;
        }

        video.srcObject =
          mediaStream;

        await video.play();

        intervalRef.current =
          window.setInterval(() => {
            if (
              cancelled ||
              terminatedRef.current
            ) {
              return;
            }

            const currentVideo =
              videoRef.current;

            const currentLandmarker =
              landmarkerRef.current;

            if (
              !currentVideo ||
              !currentLandmarker ||
              currentVideo.readyState < 2
            ) {
              return;
            }

            let result;

            try {
              result =
                currentLandmarker.detectForVideo(
                  currentVideo,
                  performance.now(),
                );
            } catch (error) {
              console.error(
                "Head direction frame detection failed:",
                error,
              );

              return;
            }

            const landmarks =
              result?.faceLandmarks?.[0];

            /*
              FaceDetectionGuard handles missing
              faces separately, so do not create
              a looking-away warning here.
            */
            if (!landmarks) {
              suspiciousSamplesRef.current = 0;
              lastDirectionRef.current =
                "center";
              currentDirectionRef.current =
                "center";
              noticeShownRef.current = false;
              lastWarningAtRef.current = 0;

              return;
            }

            const headPose =
              getHeadDirection(
                landmarks,
              );

            if (!headPose) return;

            const {
              direction,
              yaw,
              pitch,
            } = headPose;

            currentDirectionRef.current =
              direction;

            /*
              Candidate returned to the centre:
              immediately reset the full warning cycle.
            */
            if (direction === "center") {
              resetLookingAwayState();
              return;
            }

            /*
              If direction changes from left to right,
              up to down, etc., start measuring again.
            */
            if (
              lastDirectionRef.current !==
                "center" &&
              lastDirectionRef.current !==
                direction
            ) {
              suspiciousSamplesRef.current =
                0;

              lastWarningAtRef.current =
                0;

              noticeShownRef.current =
                false;
            }

            lastDirectionRef.current =
              direction;

            suspiciousSamplesRef.current +=
              1;

            /*
              Give an immediate instruction, but do
              not count it as a warning.
            */
            if (
              !noticeShownRef.current
            ) {
              noticeShownRef.current =
                true;

              toast.error(
                `Please look toward the screen. Looking ${direction} was detected.`,
                {
                  duration: 4000,
                },
              );
            }

            const thresholdReached =
              suspiciousSamplesRef.current >=
              REQUIRED_SUSPICIOUS_SAMPLES;

            const now = Date.now();

            const cooldownFinished =
              lastWarningAtRef.current ===
                0 ||
              now -
                lastWarningAtRef.current >=
                REPEAT_WARNING_INTERVAL_MS;

            if (
              thresholdReached &&
              cooldownFinished
            ) {
              lastWarningAtRef.current =
                now;

              reportLookingAway({
                direction,
                yaw,
                pitch,
              });
            }
          }, SAMPLE_INTERVAL_MS);
      } catch (error) {
        console.error(
          "Looking-away detection could not start:",
          error,
        );

        toast.error(
          "Head movement monitoring could not start. Please allow camera access.",
          {
            duration: 6000,
          },
        );
      }
    };

    initialiseDetection();

    return () => {
      cancelled = true;

      if (intervalRef.current) {
        window.clearInterval(
          intervalRef.current,
        );
      }

      streamRef.current
        ?.getTracks()
        ?.forEach((track) =>
          track.stop(),
        );

      landmarkerRef.current?.close?.();

      intervalRef.current = null;
      streamRef.current = null;
      landmarkerRef.current = null;

      reportingRef.current = false;
      terminatedRef.current = false;

      resetLookingAwayState();
    };
  }, [
    enabled,
    sessionId,
    createSecurityEvent,
    onWarning,
    onTerminated,
  ]);

  if (!enabled || !sessionId) {
    return null;
  }

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