import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

import { useCreateSecurityEventMutation } from "../../../api/securityApi";

export default function ClipboardGuard({
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

    const reportEvent = async (type, message) => {
      if (reportingRef.current) return;

      reportingRef.current = true;

      try {
        const response = await createSecurityEvent({
          sessionId,
          event: {
            type,
            severity: "medium",
            message,
            metadata: {
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
          "Failed to report clipboard event:",
          error,
        );
      } finally {
        setTimeout(() => {
          reportingRef.current = false;
        }, 3000);
      }
    };

    const handleCopy = (event) => {
      event.preventDefault();

      reportEvent(
        "copy_attempt",
        "Copy attempt detected",
      );
    };

    const handleCut = (event) => {
      event.preventDefault();

      reportEvent(
        "copy_attempt",
        "Cut attempt detected",
      );
    };

    const handlePaste = (event) => {
      event.preventDefault();

      reportEvent(
        "paste_attempt",
        "Paste attempt detected",
      );
    };

    document.addEventListener("copy", handleCopy);
    document.addEventListener("cut", handleCut);
    document.addEventListener("paste", handlePaste);

    return () => {
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("cut", handleCut);
      document.removeEventListener("paste", handlePaste);
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