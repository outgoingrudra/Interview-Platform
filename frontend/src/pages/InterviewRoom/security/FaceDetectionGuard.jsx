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
  const consecutiveNoFaceRef = useRef(0);
  const consecutiveMultipleFaceRef = useRef(0);

  const [createSecurityEvent] =
    useCreateSecurityEventMutation();

  useEffect(() => {
    const enabled =
      detectFaceEnabled || detectMultipleFacesEnabled;

    if (!enabled || !sessionId) return;

    let cancelled = false;

    const reportEvent = async ({
      type,
      severity,
      message,
      faceCount,
    }) => {
      if (reportingRef.current) return;

      reportingRef.current = true;

      try {
        const response = await createSecurityEvent({
          sessionId,
          event: {
            type,
            severity,
            message,
            metadata: {
              faceCount,
              occurredAt: new Date().toISOString(),
            },
          },
        }).unwrap();

        onWarning?.(response.warningCount);

        if (response.terminated) {
          toast.error(
            "Interview terminated due to security violations",
          );

          onTerminated?.(message);
        } else {
          toast.error(
            `${message}. Warning ${response.warningCount}/${response.warningLimit}`,
          );
        }
      } catch (error) {
        console.error(
          "Failed to report face detection event:",
          error,
        );
      } finally {
        setTimeout(() => {
          reportingRef.current = false;
        }, 3000);
      }
    };

    const initialiseDetection = async () => {
      try {
        const vision =
          await FilesetResolver.forVisionTasks(WASM_URL);

        if (cancelled) return;

        detectorRef.current =
          await FaceDetector.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: MODEL_URL,
              delegate: "GPU",
            },
            runningMode: "VIDEO",
            minDetectionConfidence: 0.6,
          });

        if (cancelled) return;

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

        if (!video) return;

        video.srcObject = mediaStream;
        await video.play();

        intervalRef.current = window.setInterval(() => {
          if (
            !detectorRef.current ||
            !videoRef.current ||
            videoRef.current.readyState < 2
          ) {
            return;
          }

          const result =
            detectorRef.current.detectForVideo(
              videoRef.current,
              performance.now(),
            );

          const faceCount = result.detections?.length ?? 0;

          if (detectFaceEnabled && faceCount === 0) {
            consecutiveNoFaceRef.current += 1;
          } else {
            consecutiveNoFaceRef.current = 0;
          }

          if (
            detectMultipleFacesEnabled &&
            faceCount > 1
          ) {
            consecutiveMultipleFaceRef.current += 1;
          } else {
            consecutiveMultipleFaceRef.current = 0;
          }

          // About 6 seconds when checking every 2 seconds.
          if (consecutiveNoFaceRef.current >= 3) {
            consecutiveNoFaceRef.current = 0;

            reportEvent({
              type: "face_not_detected",
              severity: "medium",
              message: "Candidate face was not detected",
              faceCount,
            });
          }

          if (
            consecutiveMultipleFaceRef.current >= 2
          ) {
            consecutiveMultipleFaceRef.current = 0;

            reportEvent({
              type: "multiple_faces",
              severity: "high",
              message: "Multiple faces were detected",
              faceCount,
            });
          }
        }, 2000);
      } catch (error) {
        console.error(
          "Face detection could not start:",
          error,
        );

        toast.error(
          "Camera-based security monitoring could not start",
        );
      }
    };

    initialiseDetection();

    return () => {
      cancelled = true;

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      streamRef.current
        ?.getTracks()
        .forEach((track) => track.stop());

      detectorRef.current?.close();

      intervalRef.current = null;
      streamRef.current = null;
      detectorRef.current = null;
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