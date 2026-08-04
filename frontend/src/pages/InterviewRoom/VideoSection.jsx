import {
  CallControls,
  SpeakerLayout,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
} from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";

import OnlineParticipants from "./OnlineParticipants";
import CameraDisconnectGuard from "./security/CameraDisconnectGuard";

export default function VideoSection({
  apiKey,
  user,
  token,
  meetingId,
  callType = "default",
  isHost = false,
  sessionId,
  detectCameraDisconnect = false,
  onWarning,
  onTerminated,
}) {
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (
      !apiKey ||
      !user?.id ||
      !token ||
      !meetingId
    ) {
      return;
    }

    let cancelled = false;

    const videoClient = new StreamVideoClient({
      apiKey,
      user,
      token,
    });

    const currentCall = videoClient.call(
      callType,
      meetingId,
    );

    const connect = async () => {
      try {
        setError("");

        await currentCall.join({
          create: false,
        });

        if (!cancelled) {
          setClient(videoClient);
          setCall(currentCall);
        }
      } catch (error) {
        console.error(
          "Failed to join call:",
          error,
        );

        if (!cancelled) {
          setError(
            error?.message ||
              "Failed to join video call",
          );
        }
      }
    };

    connect();

    return () => {
      cancelled = true;

      currentCall
        ?.leave?.()
        ?.catch?.(console.error);

      videoClient
        ?.disconnectUser?.()
        ?.catch?.(console.error);
    };
  }, [
    apiKey,
    user?.id,
    token,
    meetingId,
    callType,
  ]);

  if (error) {
    return (
      <section className="card min-h-[420px] border border-error bg-base-100">
        <div className="card-body grid place-items-center">
          <div className="alert alert-error">
            {error}
          </div>
        </div>
      </section>
    );
  }

  if (!client || !call) {
    return (
      <section className="card min-h-[420px] border border-base-300 bg-base-100">
        <div className="card-body grid place-items-center">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-base-300 bg-black">
      <StreamVideo client={client}>
        <StreamCall call={call}>
          <CameraDisconnectGuard
            sessionId={sessionId}
            enabled={
              Boolean(sessionId) &&
              Boolean(detectCameraDisconnect) &&
              !Boolean(isHost)
            }
            onWarning={onWarning}
            onTerminated={onTerminated}
          />

          <StreamTheme>
            <div className="flex min-h-[500px] flex-col">
              <div className="grid min-h-0 flex-1 gap-3 p-3 lg:grid-cols-[minmax(0,1fr)_240px]">
                <div className="min-h-0">
                  <SpeakerLayout />
                </div>

                {isHost && (
                  <OnlineParticipants />
                )}
              </div>

              <div className="border-t border-white/10 p-2">
                <CallControls />
              </div>
            </div>
          </StreamTheme>
        </StreamCall>
      </StreamVideo>
    </section>
  );
}