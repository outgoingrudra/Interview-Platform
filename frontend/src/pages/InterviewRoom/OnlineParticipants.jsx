import {
  MicIcon,
  MicOffIcon,
  UsersIcon,
  VideoIcon,
  VideoOffIcon,
} from "lucide-react";
import {
  hasAudio,
  hasVideo,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

export default function OnlineParticipants() {
  const { useParticipants } = useCallStateHooks();
  const participants = useParticipants();

  return (
    <aside className="rounded-xl border border-white/10 bg-black/40 p-3 text-white">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UsersIcon className="size-4" />

          <h3 className="text-sm font-bold">
            Online Participants
          </h3>
        </div>

        <span className="badge badge-success badge-sm">
          {participants.length}
        </span>
      </div>

      <div className="max-h-40 space-y-2 overflow-y-auto">
        {participants.map((participant) => {
          const cameraOn = hasVideo(participant);
          const microphoneOn = hasAudio(participant);

          return (
            <div
              key={participant.sessionId}
              className="flex items-center justify-between gap-3 rounded-lg bg-white/10 px-3 py-2"
            >
              <div className="flex min-w-0 items-center gap-2">
                <div className="avatar placeholder">
                  <div className="size-7 rounded-full bg-primary text-primary-content">
                    {participant.image ? (
                      <img
                        src={participant.image}
                        alt={participant.name || "Participant"}
                      />
                    ) : (
                      <span className="text-xs">
                        {participant.name
                          ?.charAt(0)
                          ?.toUpperCase() || "U"}
                      </span>
                    )}
                  </div>
                </div>

                <span className="truncate text-xs font-medium">
                  {participant.name || "Participant"}
                  {participant.isLocalParticipant && " (You)"}
                </span>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                {microphoneOn ? (
                  <MicIcon className="size-3.5 text-success" />
                ) : (
                  <MicOffIcon className="size-3.5 text-error" />
                )}

                {cameraOn ? (
                  <VideoIcon className="size-3.5 text-success" />
                ) : (
                  <VideoOffIcon className="size-3.5 text-error" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}