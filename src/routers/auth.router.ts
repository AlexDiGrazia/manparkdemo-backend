import { Router } from "express";
import { prisma } from "../../prisma/db.setup";
import bcrypt from "bcrypt";
import { validateRequest } from "zod-express-middleware";
import { z } from "zod";
import {
  createTokenForUser,
  createUnsecuredUserInformation,
} from "../auth-utils";

const authRouter = Router();

authRouter.post(
  "/auth/login",
  validateRequest({
    body: z.object({
      username: z.string(),
      password: z.string(),
    }),
  }),
  async ({ body: { username, password: bodyPassword } }, res) => {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) return res.status(404).send({ message: "No user found" });

    const isPasswordCorrect = await bcrypt.compare(bodyPassword, user.password);

    if (!isPasswordCorrect)
      return res.status(401).json({ message: "Invalid credentials" });

    const userInformation = createUnsecuredUserInformation(user);
    const token = createTokenForUser(user);
    console.log(token);

    return res.status(200).send({ token, userInformation });
  }
);

export { authRouter };
