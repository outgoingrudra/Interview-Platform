import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useCallStateHooks } from "@stream-io/video-react-sdk";

import { useCreateSecurityEventMutation } from "../../../api/securityApi";

const INITIAL_GRACE_PERIOD = 4000;
const REPEAT_WARNING_INTERVAL = 15000;

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

  const timerRef = useRef(null);
  const reportingRef = useRef(false);
  const initialMessageShownRef = useRef(false);
  const terminatedRef = useRef(false);

  useEffect(() => {
    if (!enabled || !sessionId) {
      return;
    }

    /*
      Camera state may initially be undefined while
      Stream is loading, so wait until it becomes known.
    */
    if (typeof isMute !== "boolean") {
      return;
    }

    const clearWarningTimer = () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };

    /*
      Camera is active again:
      stop all repeated warnings and reset the initial notice.
    */
    if (isMute === false) {
      clearWarningTimer();

      reportingRef.current = false;
      initialMessageShownRef.current = false;
      terminatedRef.current = false;

      return;
    }

    /*
      Camera is already disabled when the candidate enters
      the interview. Ask them to enable it immediately,
      but do not create a security warning yet.
    */
    if (!initialMessageShownRef.current) {
      initialMessageShownRef.current = true;

      if (hasBrowserPermission === false) {
        toast.error(
          "Camera permission is required. Please allow camera access to continue.",
          {
            duration: 5000,
          },
        );
      } else {
        toast.error(
          "Your camera is currently off. Please turn it on to continue the interview.",
          {
            duration: 5000,
          },
        );
      }
    }

    const reportCameraDisabled = async () => {
      if (
        reportingRef.current ||
        terminatedRef.current
      ) {
        return;
      }

      reportingRef.current = true;

      const permissionRemoved =
        hasBrowserPermission === false;

      const reason = permissionRemoved
        ? "Camera permission was denied or removed during the interview"
        : "Candidate kept the camera turned off during the interview";

      try {
        const response =
          await createSecurityEvent({
            sessionId,
            event: {
              type: "camera_disconnected",
              severity: "high",
              message: reason,
              metadata: {
                cameraMuted: true,
                browserPermission:
                  hasBrowserPermission ?? null,
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

          clearWarningTimer();

          toast.error(
            "Interview terminated because the camera remained disabled",
          );

          onTerminated?.(
            "Camera remained disabled during the interview",
          );

          return;
        }

        toast.error(
          `Camera is still disabled. Warning ${
            response?.warningCount ?? 0
          }/${response?.warningLimit ?? 0}`,
        );
      } catch (error) {
        console.error(
          "Failed to report camera disconnect:",
          error,
        );
      } finally {
        reportingRef.current = false;
      }

      /*
        If the camera is still disabled, report again
        after the cooldown period.
      */
      if (!terminatedRef.current) {
        timerRef.current =
          window.setTimeout(
            reportCameraDisabled,
            REPEAT_WARNING_INTERVAL,
          );
      }
    };

    /*
      Give the candidate a few seconds to enable the
      camera before creating the first security warning.
    */
    timerRef.current = window.setTimeout(
      reportCameraDisabled,
      INITIAL_GRACE_PERIOD,
    );

    return clearWarningTimer;
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