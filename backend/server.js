// import "dotenv/config";


// import app from "./app.js";
// import connectDB from "./configs/db.js";
// import { connectRedis } from "./configs/redis.js";

// const PORT = process.env.PORT || 3000;

// const startServer = async () => {
//   await connectDB();
//   await connectRedis()

//   app.listen(PORT, () => {
//     console.log(`🚀 Server running on http://localhost:${PORT}`);
//   });
// };

// startServer();

import "dotenv/config";

import app from "./app.js";
import redis from "./configs/redis.js";
import connectDB from "./configs/db.js";

const PORT = process.env.PORT || 5000;

const testRedisConnection = async () => {
  await redis.set("talent-iq:redis-test", "connected", {
    ex: 60,
  });

  const value = await redis.get("talent-iq:redis-test");

  if (value !== "connected") {
    throw new Error("Redis test returned an unexpected value");
  }

  console.log("✅ Upstash Redis connected successfully");
};

const startServer = async () => {
  try {
    await connectDB();

    await testRedisConnection();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server startup failed:", error);
    process.exit(1);
  }
};

startServer();
