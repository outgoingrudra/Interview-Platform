import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import {
  useGetInterviewRoomQuery,
  useGetStreamTokenQuery,
} from "../../api/streamApi";
import toast from "react-hot-toast";
import { useCompleteInterviewMutation } from "../../api/interviewApi";
import { useGetSessionByIdQuery } from "../../api/sessionApi";

import RoomHeader from "./RoomHeader";
import VideoSection from "./VideoSection";
import ChatDrawer from "./ChatDrawer";
import McqPanel from "./McqPanel";

import SecurityGuards from "./security/SecurityGuards";
import FullscreenRequirementModal from "./security/FullscreenRequirementModal";

export default function InterviewRoomPage() {
  const navigate = useNavigate();
  const { id: interviewId } = useParams();
  const [searchParams] = useSearchParams();

  const sessionId = searchParams.get("sessionId");

  const [answers, setAnswers] = useState({});
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [warningCount, setWarningCount] = useState(0);

  const {
    data: roomData,
    isLoading: isRoomLoading,
    isError: isRoomError,
    error: roomError,
  } = useGetInterviewRoomQuery(interviewId);

  const {
    data: sessionData,
    isLoading: isSessionLoading,
    isError: isSessionError,
    error: sessionError,
  } = useGetSessionByIdQuery(sessionId, {
    skip: !sessionId,
  });

  const {
    data: streamData,
    isLoading: isStreamLoading,
    isError: isStreamError,
    error: streamError,
  } = useGetStreamTokenQuery();
  const [completeInterview, { isLoading: isEndingInterview }] =
    useCompleteInterviewMutation();

  const handleEndInterview = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to end this interview?",
    );

    if (!confirmed) return;

    try {
      await completeInterview(interviewId).unwrap();

      toast.success("Interview completed successfully");

      navigate(`/interviews/${interviewId}`, {
        replace: true,
      });
    } catch (error) {
      toast.error(error?.data?.message || "Failed to end interview");
    }
  };

  useEffect(() => {
    const currentWarningCount = sessionData?.session?.warningCount;

    if (currentWarningCount !== undefined) {
      setWarningCount(currentWarningCount);
    }
  }, [sessionData?.session?.warningCount]);

  if (isRoomLoading || isStreamLoading || (sessionId && isSessionLoading)) {
    return (
      <div className="grid min-h-screen place-items-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (isRoomError || !roomData?.room) {
    return (
      <main className="min-h-screen bg-base-200 p-4">
        <div className="alert alert-error mx-auto max-w-3xl">
          {roomError?.data?.message || "Interview room could not be loaded"}
        </div>
      </main>
    );
  }

  if (sessionId && isSessionError) {
    return (
      <main className="min-h-screen bg-base-200 p-4">
        <div className="alert alert-error mx-auto max-w-3xl">
          {sessionError?.data?.message ||
            "Interview session could not be loaded"}
        </div>
      </main>
    );
  }

  if (isStreamError || !streamData) {
    return (
      <main className="min-h-screen bg-base-200 p-4">
        <div className="alert alert-error mx-auto max-w-3xl">
          {streamError?.data?.message ||
            "Stream connection details could not be loaded"}
        </div>
      </main>
    );
  }

  const room = roomData?.room;
  const session = sessionData?.session;
  const interview = session?.interview;

  const questions = interview?.questions ?? [];
  const securitySettings = interview?.securitySettings ?? {};

  const isCandidate = Boolean(sessionId);
  const requiresFullscreen = Boolean(securitySettings?.requireFullscreen);

  const handleTerminated = (reason) => {
    navigate("/interview-terminated", {
      replace: true,
      state: {
        reason: reason || "Security warning limit exceeded",
      },
    });
  };

  return (
    <main className="min-h-screen bg-base-200">
      <RoomHeader
        room={room}
        sessionId={sessionId}
        answers={answers}
        warningCount={warningCount}
        expiresAt={session?.expiresAt}
        onExpired={() => navigate("/dashboard", { replace: true })}
        onOpenChat={() => setIsChatOpen(true)}
        onGoBack={() => navigate(`/interviews/${interviewId}`)}
        onEndInterview={handleEndInterview}
        isEndingInterview={isEndingInterview}
      />

      {isCandidate && (
        <FullscreenRequirementModal enabled={requiresFullscreen} />
      )}

      <div className="mx-auto grid max-w-[1600px] gap-4 p-3 sm:p-4 lg:grid-cols-[minmax(0,2fr)_minmax(340px,1fr)]">
        <VideoSection
          apiKey={streamData?.apiKey}
          user={streamData?.user}
          token={streamData?.videoToken}
          meetingId={room?.meetingId}
          callType={room?.callType}
          isHost={Boolean(room?.isHost)}
          sessionId={sessionId}
          detectCameraDisconnect={Boolean(
            securitySettings?.detectCameraDisconnect,
          )}
          onWarning={setWarningCount}
          onTerminated={handleTerminated}
        />

        {isCandidate ? (
          <McqPanel
            questions={questions}
            answers={answers}
            setAnswers={setAnswers}
          />
        ) : (
          <aside className="card border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title">Host Controls</h2>

              <p className="text-base-content/60">
                Candidate progress and controls will appear here.
              </p>
            </div>
          </aside>
        )}
      </div>

      <ChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        meetingId={room?.meetingId}
        channelType={room?.channelType}
        apiKey={streamData?.apiKey}
        user={streamData?.user}
        chatToken={streamData?.chatToken}
      />

      {isCandidate && (
        <SecurityGuards
          sessionId={sessionId}
          settings={securitySettings}
          onWarning={setWarningCount}
          onTerminated={handleTerminated}
        />
      )}
    </main>
  );
}
