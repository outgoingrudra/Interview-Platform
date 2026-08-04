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

const distance = (pointA, pointB) => {
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
  const suspiciousFramesRef = useRef(0);
  const reportingRef = useRef(false);

  const [createSecurityEvent] =
    useCreateSecurityEventMutation();

  useEffect(() => {
    if (!enabled || !sessionId) return;

    let cancelled = false;

    const reportSuspiciousGesture = async () => {
      if (reportingRef.current || cancelled) return;

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
              occurredAt: new Date().toISOString(),
            },
          },
        }).unwrap();

        toast("Unusual hand movement recorded for review", {
          icon: "⚠️",
          duration: 3000,
        });
      } catch (error) {
        console.error(
          "Failed to record suspicious gesture:",
          error,
        );
      } finally {
        window.setTimeout(() => {
          reportingRef.current = false;
        }, 8000);
      }
    };

    const initialiseGestureDetection = async () => {
      try {
        const vision =
          await FilesetResolver.forVisionTasks(WASM_URL);

        if (cancelled) return;

        const landmarker =
          await HandLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: MODEL_URL,
              delegate: "GPU",
            },
            runningMode: "VIDEO",
            numHands: 2,
            minHandDetectionConfidence: 0.6,
            minHandPresenceConfidence: 0.6,
            minTrackingConfidence: 0.6,
          });

        if (cancelled) {
          landmarker.close();
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
            .getTracks()
            .forEach((track) => track.stop());

          return;
        }

        streamRef.current = mediaStream;

        const video = videoRef.current;

        if (!video) {
          mediaStream
            .getTracks()
            .forEach((track) => track.stop());

          return;
        }

        video.srcObject = mediaStream;
        await video.play();

        intervalRef.current = window.setInterval(() => {
          const currentVideo = videoRef.current;
          const currentLandmarker = landmarkerRef.current;

          if (
            !currentLandmarker ||
            !currentVideo ||
            currentVideo.readyState < 2
          ) {
            return;
          }

          const result = currentLandmarker.detectForVideo(
            currentVideo,
            performance.now(),
          );

          const firstHand = result.landmarks?.[0];

          if (!firstHand) {
            previousWristRef.current = null;
            suspiciousFramesRef.current = 0;
            return;
          }

          const wrist = firstHand[0];
          const indexTip = firstHand[8];
          const previousWrist = previousWristRef.current;

          const wristMovement = previousWrist
            ? distance(wrist, previousWrist)
            : 0;

          const handNearUpperFrame =
            wrist.y < 0.45 || indexTip.y < 0.35;

          const rapidMovement = wristMovement > 0.12;

          if (handNearUpperFrame && rapidMovement) {
            suspiciousFramesRef.current += 1;
          } else {
            suspiciousFramesRef.current = Math.max(
              0,
              suspiciousFramesRef.current - 1,
            );
          }

          previousWristRef.current = {
            x: wrist.x,
            y: wrist.y,
          };

          if (suspiciousFramesRef.current >= 4) {
            suspiciousFramesRef.current = 0;
            reportSuspiciousGesture();
          }
        }, 700);
      } catch (error) {
        console.error(
          "Gesture detection could not start:",
          error,
        );

        toast.error("Gesture monitoring could not start");
      }
    };

    initialiseGestureDetection();

    return () => {
      cancelled = true;

      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }

      streamRef.current
        ?.getTracks()
        .forEach((track) => track.stop());

      landmarkerRef.current?.close();

      intervalRef.current = null;
      streamRef.current = null;
      landmarkerRef.current = null;
      previousWristRef.current = null;
      suspiciousFramesRef.current = 0;
      reportingRef.current = false;
    };
  }, [enabled, sessionId, createSecurityEvent]);

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