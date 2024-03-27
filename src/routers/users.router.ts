import { Router } from "express";
import { prisma } from "../../prisma/db.setup";
import { validateRequest } from "zod-express-middleware";
import { z } from "zod";
import { authMiddleware } from "../auth-utils";

const userRouter = Router();

userRouter.post(
  "/login",
  validateRequest({
    body: z.object({
      username: z.string(),
    }),
  }),
  authMiddleware,
  async (req, res) => {
    const username = req.body.username;
    const loggedInUser = await prisma.user.findUnique({
      where: { username },
      include: {
        profile: true,
      },
    });

    return res.status(201).send(loggedInUser);
  }
);

//create
//does nested creates to POST user AND associated profile
userRouter.post(
  "/",
  validateRequest({
    body: z.object({
      username: z.string(),
      password: z.string(),
      profile: z.object({
        username: z.string(),
        picture: z.string(),
        bio: z.string(),
        home: z.string(),
        occupation: z.string(),
        birthday: z.string().datetime(),
      }),
    }),
  }),
  async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const profile = req.body.profile;
    const newUser = await prisma.user.create({
      data: {
        username,
        password,
        profile: {
          create: { ...profile },
        },
      },
      include: {
        profile: true,
      },
    });

    return res.status(200).send(newUser);
  }
);

export { userRouter };
