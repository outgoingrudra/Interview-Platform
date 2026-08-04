import { useEffect, useState } from "react";
import { MessageSquareIcon, XIcon } from "lucide-react";
import { StreamChat } from "stream-chat";
import {
  Channel,
  Chat,
  MessageComposer,
  MessageList,
  Window,
} from "stream-chat-react";

export default function ChatDrawer({
  isOpen,
  onClose,
  apiKey,
  user,
  chatToken,
  meetingId,
  channelType = "messaging",
}) {
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [chatError, setChatError] = useState("");

  useEffect(() => {
    if (!apiKey || !user?.id || !chatToken || !meetingId) return;

    let cancelled = false;

    const client = new StreamChat(apiKey);

    const connectChat = async () => {
      try {
        await client.connectUser(user, chatToken);

        const currentChannel = client.channel(
          channelType,
          meetingId,
        );

        await currentChannel.watch();

        if (!cancelled) {
          setChatClient(client);
          setChannel(currentChannel);
        }
      } catch (error) {
        console.error("Failed to connect Stream Chat:", error);

        if (!cancelled) {
          setChatError(
            error?.message || "Failed to connect interview chat",
          );
        }
      }
    };

    connectChat();

    return () => {
      cancelled = true;

      client.disconnectUser().catch(console.error);
    };
  }, [
    apiKey,
    user?.id,
    chatToken,
    meetingId,
    channelType,
  ]);

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close chat"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40"
        />
      )}

      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full flex-col border-l border-base-300 bg-base-100 shadow-2xl transition-transform duration-300 sm:w-[400px] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex shrink-0 items-center justify-between border-b border-base-300 p-3">
          <div className="flex min-w-0 items-center gap-2">
            <MessageSquareIcon className="size-5 shrink-0 text-secondary" />

            <div className="min-w-0">
              <h2 className="text-sm font-bold">
                Interview Chat
              </h2>

              <p className="truncate text-xs text-base-content/60">
                Room: {meetingId}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost btn-circle btn-sm"
            aria-label="Close chat"
          >
            <XIcon className="size-5" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-hidden">
          {chatError ? (
            <div className="p-4">
              <div className="alert alert-error text-sm">
                {chatError}
              </div>
            </div>
          ) : !chatClient || !channel ? (
            <div className="grid h-full place-items-center">
              <span className="loading loading-spinner loading-md text-secondary" />
            </div>
          ) : (
            <Chat client={chatClient}>
              <Channel channel={channel}>
                <Window>
                  <MessageList />
                  <MessageComposer />
                </Window>
              </Channel>
            </Chat>
          )}
        </div>
      </aside>
    </>
  );
}