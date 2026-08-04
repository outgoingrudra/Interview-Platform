import { useEffect, useRef, useState } from "react";
import { Clock3Icon } from "lucide-react";
import toast from "react-hot-toast";

import { useExpireSessionMutation } from "../../api/sessionApi";

const getRemainingSeconds = (expiresAt) => {
  if (!expiresAt) return 0;

  return Math.max(
    0,
    Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000),
  );
};

const formatTime = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
};

export default function InterviewTimer({
  sessionId,
  expiresAt,
  onExpired,
}) {
  const [remainingSeconds, setRemainingSeconds] = useState(() =>
    getRemainingSeconds(expiresAt),
  );

  const [expireSession] = useExpireSessionMutation();
  const expiredRef = useRef(false);

  useEffect(() => {
    setRemainingSeconds(getRemainingSeconds(expiresAt));
    expiredRef.current = false;
  }, [expiresAt]);

  useEffect(() => {
    if (!expiresAt || !sessionId) return;

    const timer = setInterval(() => {
      setRemainingSeconds(getRemainingSeconds(expiresAt));
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt, sessionId]);

  useEffect(() => {
    if (
      !sessionId ||
      remainingSeconds > 0 ||
      expiredRef.current
    ) {
      return;
    }

    expiredRef.current = true;

    const expire = async () => {
      try {
        await expireSession(sessionId).unwrap();

        toast.error("Interview time has ended");

        onExpired?.();
      } catch (error) {
        toast.error(
          error?.data?.message || "Failed to expire session",
        );
      }
    };

    expire();
  }, [
    remainingSeconds,
    sessionId,
    expireSession,
    onExpired,
  ]);

  const urgent = remainingSeconds <= 300;

  return (
    <span
      className={`badge badge-sm gap-1 ${
        urgent ? "badge-error" : "badge-primary"
      }`}
    >
      <Clock3Icon className="size-3.5" />
      {formatTime(remainingSeconds)}
    </span>
  );
}