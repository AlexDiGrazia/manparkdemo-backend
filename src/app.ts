import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { prisma } from "../prisma/db.setup";
import { communityPostsRouter } from "./routers/communityPost.router";
import { userRouter } from "./routers/users.router";
import { profileRouter } from "./routers/profiles.router";
import { eventsRouter } from "./routers/events.router";
import { scheduleRouter } from "./routers/schedule.router";
import { photosRouter } from "./routers/photos.router";
import { loginRouter } from "./routers/login.router";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS", "PUT"],
  })
);
app.use(express.json());

app.use("/login", loginRouter);
app.use("/users", userRouter);
app.use("/profiles", profileRouter);
app.use("/community_posts", communityPostsRouter);
app.use("/events", eventsRouter);
app.use("/schedules", scheduleRouter);
app.use("/photos", photosRouter);

app.listen(3000, () => {
  console.log("server is running");
});
