import { StreamClient } from "@stream-io/node-sdk";
import { StreamChat } from "stream-chat";

const apiKey = process.env.STREAM_API_KEY;
const secretKey = process.env.STREAM_SECRET_KEY;

if (!apiKey || !secretKey) {
  throw new Error("Stream API key or secret is missing");
}

// Video server client
export const streamVideoClient = new StreamClient(
  apiKey,
  secretKey,
  {
    timeout: 10000, // 10 seconds
  },
);

// Chat server client
export const streamChatClient = StreamChat.getInstance(
  apiKey,
  secretKey,
);