import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

import { useCreateSecurityEventMutation } from "../../../api/securityApi";

export default function TabSwitchDetector({
  sessionId,
  enabled,
  onWarning,
  onTerminated,
}) {
  const [createSecurityEvent] =
    useCreateSecurityEventMutation();

  const reportingRef = useRef(false);

  useEffect(() => {
    if (!enabled || !sessionId) return;

    const handleVisibilityChange = async () => {
      if (
        document.visibilityState !== "hidden" ||
        reportingRef.current
      ) {
        return;
      }

      reportingRef.current = true;

      try {
        const response = await createSecurityEvent({
          sessionId,
          event: {
            type: "tab_switch",
            severity: "medium",
            message: "Candidate switched away from the interview tab",
            metadata: {
              occurredAt: new Date().toISOString(),
            },
          },
        }).unwrap();

        onWarning?.(response.warningCount);

        if (response.terminated) {
          toast.error("Interview terminated due to security violations");
          onTerminated?.();
        } else {
          toast.error(
            `Tab switch detected. Warning ${response.warningCount}/${response.warningLimit}`,
          );
        }
      } catch (error) {
        console.error("Failed to report tab switch:", error);
      } finally {
        setTimeout(() => {
          reportingRef.current = false;
        }, 3000);
      }
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange,
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
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