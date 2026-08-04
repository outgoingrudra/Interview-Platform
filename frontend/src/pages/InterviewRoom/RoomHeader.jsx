import {
  AlertTriangleIcon,
  ArrowLeftIcon,
  Clock3Icon,
  MessageSquareIcon,
  ShieldCheckIcon,
  SquareIcon,
  UserRoundCheckIcon,
} from "lucide-react";

import SubmitInterviewButton from "./SubmitInterviewButton";
import InterviewTimer from "./InterviewTimer";

export default function RoomHeader({
  room,
  sessionId,
  answers,
  expiresAt,
  onExpired,
  warningCount = 0,
  onOpenChat,
  onGoBack,
  onEndInterview,
  isEndingInterview = false,
}) {
  const isCandidate = Boolean(sessionId);
  const isHost = Boolean(room?.isHost);

  return (
    <header className="sticky top-0 z-40 border-b border-base-300 bg-base-100/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-3 px-3 py-3 sm:px-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          {isHost && (
            <button
              type="button"
              onClick={onGoBack}
              className="btn btn-ghost btn-circle btn-sm"
              aria-label="Go back"
            >
              <ArrowLeftIcon className="size-4" />
            </button>
          )}

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black sm:text-lg">
                Live Interview Room
              </h1>

              {isHost && (
                <span className="badge badge-primary badge-sm gap-1">
                  <UserRoundCheckIcon className="size-3.5" />
                  Host
                </span>
              )}
            </div>

            <p className="max-w-64 truncate text-xs text-base-content/60 sm:max-w-md">
              Room: {room?.meetingId || "Not available"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="badge badge-success badge-sm gap-1">
            <ShieldCheckIcon className="size-3.5" />
            Secure
          </span>

          {isCandidate && (
            <>
              <span
                className={`badge badge-sm gap-1 ${
                  warningCount > 0
                    ? "badge-warning"
                    : "badge-ghost"
                }`}
              >
                <AlertTriangleIcon className="size-3.5" />
                {warningCount} Warnings
              </span>

              <InterviewTimer
                sessionId={sessionId}
                expiresAt={expiresAt}
                onExpired={onExpired}
              />
            </>
          )}

          {isHost && (
            <span className="badge badge-info badge-sm gap-1">
              <Clock3Icon className="size-3.5" />
              Interview Live
            </span>
          )}

          <button
            type="button"
            onClick={onOpenChat}
            className="btn btn-secondary btn-sm"
          >
            <MessageSquareIcon className="size-4" />
            Chat
          </button>

          {isCandidate && (
            <SubmitInterviewButton
              sessionId={sessionId}
              answers={answers}
            />
          )}

          {isHost && (
            <button
              type="button"
              onClick={onEndInterview}
              disabled={isEndingInterview}
              className="btn btn-error btn-sm"
            >
              {isEndingInterview ? (
                <>
                  <span className="loading loading-spinner loading-xs" />
                  Ending...
                </>
              ) : (
                <>
                  <SquareIcon className="size-4" />
                  End Interview
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}