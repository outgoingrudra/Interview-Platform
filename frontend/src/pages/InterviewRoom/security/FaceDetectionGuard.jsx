import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import {
  FaceDetector,
  FilesetResolver,
} from "@mediapipe/tasks-vision";

import { useCreateSecurityEventMutation } from "../../../api/securityApi";

const WASM_URL =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm";

const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite";

/*
  Detection runs approximately every 700 ms.

  No face:
  5 consecutive checks ≈ 3.5 seconds.

  Multiple faces:
  3 consecutive checks ≈ 2.1 seconds.
*/
const DETECTION_INTERVAL = 700;
const NO_FACE_THRESHOLD = 5;
const MULTIPLE_FACE_THRESHOLD = 3;

/*
  Once a violation is reported, report it again only
  if the same violation continues for this duration.
*/
const REPEAT_WARNING_INTERVAL = 15000;

export default function FaceDetectionGuard({
  sessionId,
  detectFaceEnabled,
  detectMultipleFacesEnabled,
  onWarning,
  onTerminated,
}) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const detectorRef = useRef(null);
  const intervalRef = useRef(null);

  const reportingRef = useRef(false);
  const terminatedRef = useRef(false);

  const consecutiveNoFaceRef = useRef(0);
  const consecutiveMultipleFaceRef = useRef(0);

  const lastNoFaceWarningAtRef = useRef(0);
  const lastMultipleFaceWarningAtRef = useRef(0);

  const noFaceNoticeShownRef = useRef(false);
  const multipleFaceNoticeShownRef = useRef(false);

  const [createSecurityEvent] =
    useCreateSecurityEventMutation();

  useEffect(() => {
    const enabled =
      detectFaceEnabled ||
      detectMultipleFacesEnabled;

    if (!enabled || !sessionId) {
      return;
    }

    let cancelled = false;

    const resetNoFaceState = () => {
      consecutiveNoFaceRef.current = 0;
      lastNoFaceWarningAtRef.current = 0;
      noFaceNoticeShownRef.current = false;
    };

    const resetMultipleFaceState = () => {
      consecutiveMultipleFaceRef.current = 0;
      lastMultipleFaceWarningAtRef.current = 0;
      multipleFaceNoticeShownRef.current = false;
    };

    const reportEvent = async ({
      type,
      severity,
      message,
      faceCount,
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
              type,
              severity,
              message,
              metadata: {
                faceCount,
                occurredAt:
                  new Date().toISOString(),
              },
            },
          }).unwrap();

        if (
          response?.countedAsWarning !== false
        ) {
          onWarning?.(
            response?.warningCount,
          );
        }

        if (response?.terminated) {
          terminatedRef.current = true;

          toast.error(
            "Interview terminated due to repeated face-monitoring violations",
          );

          onTerminated?.(message);

          return;
        }

        toast.error(
          `${message}. Warning ${
            response?.warningCount ?? 0
          }/${response?.warningLimit ?? 0}`,
        );
      } catch (error) {
        console.error(
          "Failed to report face detection event:",
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

        detectorRef.current =
          await FaceDetector.createFromOptions(
            vision,
            {
              baseOptions: {
                modelAssetPath: MODEL_URL,
                delegate: "GPU",
              },
              runningMode: "VIDEO",
              minDetectionConfidence: 0.6,
            },
          );

        if (cancelled) return;

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

        streamRef.current = mediaStream;

        const video = videoRef.current;

        if (!video) return;

        video.srcObject = mediaStream;

        await video.play();

        intervalRef.current =
          window.setInterval(() => {
            if (
              cancelled ||
              terminatedRef.current ||
              !detectorRef.current ||
              !videoRef.current ||
              videoRef.current.readyState < 2
            ) {
              return;
            }

            let result;

            try {
              result =
                detectorRef.current.detectForVideo(
                  videoRef.current,
                  performance.now(),
                );
            } catch (error) {
              console.error(
                "Face detection frame failed:",
                error,
              );

              return;
            }

            const faceCount =
              result?.detections?.length ?? 0;

            const now = Date.now();

            /*
              No-face detection
            */
            if (
              detectFaceEnabled &&
              faceCount === 0
            ) {
              consecutiveNoFaceRef.current += 1;

              if (
                !noFaceNoticeShownRef.current
              ) {
                noFaceNoticeShownRef.current =
                  true;

                toast.error(
                  "Your face is not visible. Please face the camera.",
                  {
                    duration: 4000,
                  },
                );
              }

              const thresholdReached =
                consecutiveNoFaceRef.current >=
                NO_FACE_THRESHOLD;

              const cooldownFinished =
                lastNoFaceWarningAtRef.current ===
                  0 ||
                now -
                  lastNoFaceWarningAtRef.current >=
                  REPEAT_WARNING_INTERVAL;

              if (
                thresholdReached &&
                cooldownFinished
              ) {
                lastNoFaceWarningAtRef.current =
                  now;

                reportEvent({
                  type: "face_not_detected",
                  severity: "medium",
                  message:
                    "Candidate face was not detected",
                  faceCount,
                });
              }
            } else {
              resetNoFaceState();
            }

            /*
              Multiple-face detection
            */
            if (
              detectMultipleFacesEnabled &&
              faceCount > 1
            ) {
              consecutiveMultipleFaceRef.current +=
                1;

              if (
                !multipleFaceNoticeShownRef.current
              ) {
                multipleFaceNoticeShownRef.current =
                  true;

                toast.error(
                  "Multiple faces are visible. Only the candidate should remain on camera.",
                  {
                    duration: 4000,
                  },
                );
              }

              const thresholdReached =
                consecutiveMultipleFaceRef.current >=
                MULTIPLE_FACE_THRESHOLD;

              const cooldownFinished =
                lastMultipleFaceWarningAtRef.current ===
                  0 ||
                now -
                  lastMultipleFaceWarningAtRef.current >=
                  REPEAT_WARNING_INTERVAL;

              if (
                thresholdReached &&
                cooldownFinished
              ) {
                lastMultipleFaceWarningAtRef.current =
                  now;

                reportEvent({
                  type: "multiple_faces",
                  severity: "high",
                  message:
                    "Multiple faces were detected",
                  faceCount,
                });
              }
            } else {
              resetMultipleFaceState();
            }
          }, DETECTION_INTERVAL);
      } catch (error) {
        console.error(
          "Face detection could not start:",
          error,
        );

        toast.error(
          "Camera access is required for face monitoring. Please enable your camera and allow permission.",
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

      detectorRef.current?.close?.();

      intervalRef.current = null;
      streamRef.current = null;
      detectorRef.current = null;

      reportingRef.current = false;
      terminatedRef.current = false;

      resetNoFaceState();
      resetMultipleFaceState();
    };
  }, [
    sessionId,
    detectFaceEnabled,
    detectMultipleFacesEnabled,
    createSecurityEvent,
    onWarning,
    onTerminated,
  ]);

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