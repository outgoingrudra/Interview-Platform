import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import {
  FilesetResolver,
  HandLandmarker,
} from "@mediapipe/tasks-vision";

import { useCreateSecurityEventMutation } from "../../../api/securityApi";

const WASM_URL =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm";

const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";

const SAMPLE_INTERVAL_MS = 700;

/*
  Four suspicious samples at 700 ms each is approximately
  2.8 seconds of repeated movement.
*/
const REQUIRED_SUSPICIOUS_SAMPLES = 4;

/*
  Avoid repeatedly recording the same continuous gesture.
*/
const REPORT_COOLDOWN_MS = 20000;

/*
  Require a few normal frames before considering the
  previous suspicious sequence finished.
*/
const REQUIRED_CLEAR_SAMPLES = 3;

const RAPID_MOVEMENT_THRESHOLD = 0.12;

const distance = (pointA, pointB) => {
  if (!pointA || !pointB) return 0;

  const x = pointA.x - pointB.x;
  const y = pointA.y - pointB.y;

  return Math.sqrt(x * x + y * y);
};

export default function SuspiciousGestureGuard({
  sessionId,
  enabled,
}) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const landmarkerRef = useRef(null);
  const intervalRef = useRef(null);

  const previousWristRef = useRef(null);
  const suspiciousSamplesRef = useRef(0);
  const clearSamplesRef = useRef(0);

  const reportingRef = useRef(false);
  const lastReportedAtRef = useRef(0);

  /*
    Prevents the same continuous movement from repeatedly
    generating events. It resets only after normal frames.
  */
  const waitingForMovementToClearRef =
    useRef(false);

  const [createSecurityEvent] =
    useCreateSecurityEventMutation();

  useEffect(() => {
    if (!enabled || !sessionId) return;

    let cancelled = false;

    const resetGestureTracking = () => {
      previousWristRef.current = null;
      suspiciousSamplesRef.current = 0;
      clearSamplesRef.current = 0;
      waitingForMovementToClearRef.current = false;
    };

    const reportSuspiciousGesture = async ({
      wristMovement,
      handCount,
    }) => {
      if (
        reportingRef.current ||
        cancelled
      ) {
        return;
      }

      reportingRef.current = true;

      try {
        await createSecurityEvent({
          sessionId,
          event: {
            type: "suspicious_gesture",
            severity: "low",
            message:
              "Repeated unusual hand movement was detected",
            metadata: {
              wristMovement: Number(
                wristMovement?.toFixed?.(3) ?? 0,
              ),
              handCount,
              observedDurationSeconds:
                (REQUIRED_SUSPICIOUS_SAMPLES *
                  SAMPLE_INTERVAL_MS) /
                1000,
              occurredAt:
                new Date().toISOString(),
            },
          },
        }).unwrap();

        /*
          This is intentionally a review event rather than
          a high-severity warning or termination reason.
        */
        toast(
          "Unusual hand movement was recorded for host review",
          {
            icon: "⚠️",
            duration: 3500,
          },
        );
      } catch (error) {
        console.error(
          "Failed to record suspicious gesture:",
          error,
        );

        /*
          Allow another attempt if reporting failed.
        */
        waitingForMovementToClearRef.current =
          false;
      } finally {
        reportingRef.current = false;
      }
    };

    const initialiseGestureDetection =
      async () => {
        try {
          const vision =
            await FilesetResolver.forVisionTasks(
              WASM_URL,
            );

          if (cancelled) return;

          const landmarker =
            await HandLandmarker.createFromOptions(
              vision,
              {
                baseOptions: {
                  modelAssetPath: MODEL_URL,
                  delegate: "GPU",
                },
                runningMode: "VIDEO",
                numHands: 2,
                minHandDetectionConfidence: 0.6,
                minHandPresenceConfidence: 0.6,
                minTrackingConfidence: 0.6,
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
              if (cancelled) return;

              const currentVideo =
                videoRef.current;

              const currentLandmarker =
                landmarkerRef.current;

              if (
                !currentLandmarker ||
                !currentVideo ||
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
                  "Gesture frame detection failed:",
                  error,
                );

                return;
              }

              const hands =
                result?.landmarks ?? [];

              const firstHand =
                hands?.[0];

              /*
                No hand is visible. This is considered a
                normal frame and helps reset the sequence.
              */
              if (!firstHand) {
                previousWristRef.current =
                  null;

                suspiciousSamplesRef.current =
                  0;

                clearSamplesRef.current +=
                  1;

                if (
                  clearSamplesRef.current >=
                  REQUIRED_CLEAR_SAMPLES
                ) {
                  waitingForMovementToClearRef.current =
                    false;
                }

                return;
              }

              const wrist =
                firstHand?.[0];

              const indexTip =
                firstHand?.[8];

              if (!wrist || !indexTip) {
                return;
              }

              const previousWrist =
                previousWristRef.current;

              const wristMovement =
                previousWrist
                  ? distance(
                      wrist,
                      previousWrist,
                    )
                  : 0;

              const handNearUpperFrame =
                wrist.y < 0.45 ||
                indexTip.y < 0.35;

              const rapidMovement =
                wristMovement >
                RAPID_MOVEMENT_THRESHOLD;

              const suspiciousMovement =
                handNearUpperFrame &&
                rapidMovement;

              if (suspiciousMovement) {
                clearSamplesRef.current =
                  0;

                if (
                  !waitingForMovementToClearRef.current
                ) {
                  suspiciousSamplesRef.current +=
                    1;
                }
              } else {
                suspiciousSamplesRef.current =
                  Math.max(
                    0,
                    suspiciousSamplesRef.current -
                      1,
                  );

                clearSamplesRef.current +=
                  1;

                if (
                  clearSamplesRef.current >=
                  REQUIRED_CLEAR_SAMPLES
                ) {
                  waitingForMovementToClearRef.current =
                    false;
                }
              }

              previousWristRef.current = {
                x: wrist.x,
                y: wrist.y,
              };

              const thresholdReached =
                suspiciousSamplesRef.current >=
                REQUIRED_SUSPICIOUS_SAMPLES;

              const cooldownFinished =
                Date.now() -
                  lastReportedAtRef.current >=
                REPORT_COOLDOWN_MS;

              if (
                thresholdReached &&
                cooldownFinished &&
                !waitingForMovementToClearRef.current
              ) {
                suspiciousSamplesRef.current =
                  0;

                lastReportedAtRef.current =
                  Date.now();

                waitingForMovementToClearRef.current =
                  true;

                reportSuspiciousGesture({
                  wristMovement,
                  handCount:
                    hands.length,
                });
              }
            }, SAMPLE_INTERVAL_MS);
        } catch (error) {
          console.error(
            "Gesture detection could not start:",
            error,
          );

          toast.error(
            "Gesture monitoring could not start",
          );
        }
      };

    initialiseGestureDetection();

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
      lastReportedAtRef.current = 0;

      resetGestureTracking();
    };
  }, [
    enabled,
    sessionId,
    createSecurityEvent,
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