import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useCallStateHooks } from "@stream-io/video-react-sdk";

import { useCreateSecurityEventMutation } from "../../../api/securityApi";

export default function CameraDisconnectGuard({
  sessionId,
  enabled,
  onWarning,
  onTerminated,
}) {
  const { useCameraState } = useCallStateHooks();

  const cameraState = useCameraState();

  const isMute = cameraState?.isMute;
  const hasBrowserPermission =
    cameraState?.hasBrowserPermission;

  const [createSecurityEvent] =
    useCreateSecurityEventMutation();

  const reportingRef = useRef(false);
  const cameraWasActiveRef = useRef(false);
  const alreadyReportedRef = useRef(false);

  useEffect(() => {
    if (!enabled || !sessionId) return;

    if (isMute === false) {
      cameraWasActiveRef.current = true;
      alreadyReportedRef.current = false;
      return;
    }

    if (
      isMute !== true ||
      !cameraWasActiveRef.current ||
      alreadyReportedRef.current
    ) {
      return;
    }

    const timer = window.setTimeout(async () => {
      if (
        reportingRef.current ||
        alreadyReportedRef.current ||
        isMute !== true
      ) {
        return;
      }

      reportingRef.current = true;
      alreadyReportedRef.current = true;

      const reason =
        hasBrowserPermission === false
          ? "Camera permission was removed during the interview"
          : "Candidate turned off or disconnected the camera";

      try {
        const response = await createSecurityEvent({
          sessionId,
          event: {
            type: "camera_disconnected",
            severity: "high",
            message: reason,
            metadata: {
              cameraMuted: Boolean(isMute),
              browserPermission:
                hasBrowserPermission ?? null,
              occurredAt: new Date().toISOString(),
            },
          },
        }).unwrap();

        if (response?.countedAsWarning !== false) {
          onWarning?.(response?.warningCount);
        }

        if (response?.terminated) {
          toast.error(
            "Interview terminated because the camera was disabled",
          );

          onTerminated?.(
            "Camera was disabled during the interview",
          );

          return;
        }

        toast.error(
          `Camera disabled. Warning ${response?.warningCount}/${response?.warningLimit}`,
        );
      } catch (error) {
        alreadyReportedRef.current = false;

        console.error(
          "Failed to report camera disconnect:",
          error,
        );
      } finally {
        reportingRef.current = false;
      }
    }, 1500);

    return () => {
      window.clearTimeout(timer);
    };
  }, [
    enabled,
    sessionId,
    isMute,
    hasBrowserPermission,
    createSecurityEvent,
    onWarning,
    onTerminated,
  ]);

  return null;
}