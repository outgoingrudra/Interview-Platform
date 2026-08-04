import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

import { useCreateSecurityEventMutation } from "../../../api/securityApi";

const ALLOW_FULLSCREEN_EXIT_EVENT =
  "talent-iq:allow-fullscreen-exit";

export default function FullscreenGuard({
  sessionId,
  enabled,
  onWarning,
  onTerminated,
}) {
  const [createSecurityEvent] =
    useCreateSecurityEventMutation();

  const reportingRef = useRef(false);
  const enteredFullscreenRef = useRef(false);
  const allowNextExitRef = useRef(false);

  useEffect(() => {
    if (!enabled || !sessionId) return;

    const allowNextFullscreenExit = () => {
      allowNextExitRef.current = true;
    };

    const reportFullscreenExit = async () => {
      if (reportingRef.current) return;

      reportingRef.current = true;

      try {
        const response = await createSecurityEvent({
          sessionId,
          event: {
            type: "fullscreen_exit",
            severity: "medium",
            message: "Candidate exited fullscreen mode",
            metadata: {
              occurredAt: new Date().toISOString(),
            },
          },
        }).unwrap();

        if (response?.countedAsWarning !== false) {
          onWarning?.(response?.warningCount);
        }

        if (response?.terminated) {
          toast.error(
            "Interview terminated due to security violations",
          );

          onTerminated?.(
            "Fullscreen warning limit exceeded",
          );

          return;
        }

        toast.error(
          `Fullscreen exited. Warning ${response?.warningCount}/${response?.warningLimit}`,
        );
      } catch (error) {
        console.error(
          "Failed to report fullscreen exit:",
          error,
        );
      } finally {
        window.setTimeout(() => {
          reportingRef.current = false;
        }, 3000);
      }
    };

    const handleFullscreenChange = () => {
      const isFullscreen = Boolean(
        document?.fullscreenElement,
      );

      if (isFullscreen) {
        enteredFullscreenRef.current = true;
        allowNextExitRef.current = false;
        return;
      }

      if (!enteredFullscreenRef.current) return;

      enteredFullscreenRef.current = false;

      if (allowNextExitRef.current) {
        allowNextExitRef.current = false;
        return;
      }

      reportFullscreenExit();
    };

    window.addEventListener(
      ALLOW_FULLSCREEN_EXIT_EVENT,
      allowNextFullscreenExit,
    );

    document.addEventListener(
      "fullscreenchange",
      handleFullscreenChange,
    );

    return () => {
      window.removeEventListener(
        ALLOW_FULLSCREEN_EXIT_EVENT,
        allowNextFullscreenExit,
      );

      document.removeEventListener(
        "fullscreenchange",
        handleFullscreenChange,
      );
    };
  }, [
    enabled,
    sessionId,
    createSecurityEvent,
    onWarning,
    onTerminated,
  ]);

  return null;
}