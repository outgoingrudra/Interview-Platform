import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import errorHandler from "./middlewares/errorHandler.js";
import { clerkMiddleware } from "@clerk/express";
import interviewRoutes from "./routes/interview.routes.js";
import sessionRoutes from "./routes/session.routes.js";
import securityEventRoutes from "./routes/securityEvent.routes.js";
import streamRoutes from "./routes/stream.routes.js";
const app = express();
app.use(clerkMiddleware());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(helmet());

app.use(morgan("dev"));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);



app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Interview Platform API Running 🚀",
  });
});

// Routes will come here
app.use("/api/interviews", interviewRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/security-events", securityEventRoutes);
app.use("/api/stream", streamRoutes);



app.use(errorHandler);

export default app;