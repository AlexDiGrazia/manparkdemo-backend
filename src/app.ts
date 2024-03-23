import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { prisma } from "../prisma/db.setup";
import { communityPostsRouter } from "./routers/communityPost.router";
import { userRouter } from "./routers/users.router";
import { profileRouter } from "./routers/profiles.router";
import { eventsRouter } from "./routers/events.router";
import { scheduleRouter } from "./routers/schedule.router";
import { photosRouter } from "./routers/photos.router";
import { authRouter } from "./routers/auth.router";
import { TUser } from "./types";

const app = express();

declare global {
  namespace Express {
    interface Request {
      user?: TUser;
    }
  }
  namespace NodeJS {
    export interface ProcessEnv {
      SUPABASE_API_KEY: string;
      DATABASE_URL: string;
      JWT_SECRET: string;
    }
  }
}

["DATABASE_URL", "JWT_SECRET"].forEach((key) => {
  if (process.env[key] === undefined)
    throw new Error(`Missing environment variable ${key}`);
});

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS", "PUT"],
  })
);
app.use(express.json());

app.use(authRouter);
app.use("/users", userRouter);
app.use("/profiles", profileRouter);
app.use("/community_posts", communityPostsRouter);
app.use("/events", eventsRouter);
app.use("/schedules", scheduleRouter);
app.use("/photos", photosRouter);

app.listen(3000, () => {
  console.log("server is running");
});
