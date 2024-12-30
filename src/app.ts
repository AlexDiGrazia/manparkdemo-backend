import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { communityPostsRouter } from "./routers/communityPost.router";
import { userRouter } from "./routers/users.router";
import { profileRouter } from "./routers/profiles.router";
import { eventsRouter } from "./routers/events.router";
import { scheduleRouter } from "./routers/schedule.router";
import { photosRouter } from "./routers/photos.router";
import { authRouter } from "./routers/auth.router";
import { TUser } from "./types";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
      CLOUDINARY_CLOUD: string;
      CLOUDINARY_API_KEY: string;
      CLOUDINARY_API_SECRET: string;
    }
  }
}

["DATABASE_URL", "JWT_SECRET"].forEach((key) => {
  if (process.env[key] === undefined)
    throw new Error(`Missing environment variable ${key}`);
});

app.use(
  cors({
    origin: process.env.ORIGIN,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS", "PUT"],
  })
);

app.options("*", cors());

app.set("trust proxy", 1 /* number of proxies between user and server */);

app.get("/ip", (request, response) => response.send(request.ip));

// app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  return res.status(200).send("wow dude, nice!");
});

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
