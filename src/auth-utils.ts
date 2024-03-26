import bcrypt from "bcrypt";
import { TUser } from "./types";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { Request, Response, NextFunction } from "express";
import { prisma } from "../prisma/db.setup";
import dotenv from "dotenv";

dotenv.config();

const saltRounds = 11;

export const encryptPassword = (password: string) => {
  return bcrypt.hash(password, saltRounds);
};

export const createUnsecuredUserInformation = (user: TUser) => ({
  id: user.id,
  username: user.username,
  profile: user.profile,
});

export const createTokenForUser = (user: TUser) => {
  return jwt.sign(
    createUnsecuredUserInformation(user),
    process.env.JWT_SECRET as string
  );
};

const jwtInfoSchema = z.object({
  username: z.string(),
  id: z.number(),
  iat: z.number(),
  profile: z.object({
    username: z.string(),
    picture: z.string(),
    bio: z.string(),
    home: z.string(),
    occupation: z.string(),
    birthday: z.string().datetime(),
  }),
});

export const getDataFromAuthToken = (token?: string) => {
  if (!token) return null;
  try {
    return jwtInfoSchema.parse(
      jwt.verify(token, process.env.JWT_SECRET as string)
    );
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const authMiddleware = async (
  req: Request<{ id: number }>,
  res: Response,
  next: NextFunction
) => {
  const [, token] = req.headers.authorization?.split(" ") || [];
  const myJwtData = getDataFromAuthToken(token);

  if (!myJwtData) return res.status(401).json({ message: "Invalid token" });

  const userFromJwt = await prisma.user.findFirst({
    where: {
      username: myJwtData.username,
    },
    include: { profile: true },
  });

  if (!userFromJwt) return res.status(401).json({ message: "User not found" });

  (req as any).user = createUnsecuredUserInformation(userFromJwt);
  next();
};
