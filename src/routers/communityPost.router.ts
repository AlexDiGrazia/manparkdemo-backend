import { Router, Request, Response, NextFunction } from "express";
import { prisma } from "../../prisma/db.setup";
import { validateRequest } from "zod-express-middleware";
import { z } from "zod";
import { authMiddleware } from "../auth-utils";
import { limiter } from "../rate-limiter";

const communityPostsRouter = Router();

communityPostsRouter.get("/", limiter, async (req, res) => {
  const communityPosts = await prisma.communityPost.findMany();
  return res.status(200).send(communityPosts);
});

communityPostsRouter.post(
  "/",
  validateRequest({
    body: z
      .object({
        text: z.string(),
      })
      .strict(),
  }),
  authMiddleware,
  async (req, res) => {
    const { text } = req.body;
    const newPost = await prisma.communityPost.create({
      data: {
        user: req.user!.username,
        text,
        authorId: req.user!.id,
      },
    });
    res.status(200).send(newPost);
  }
);

communityPostsRouter.patch(
  "/:id",
  validateRequest({
    params: z.object({
      id: z.coerce.number(),
    }),
    body: z
      .object({
        text: z.string(),
      })
      .strict(),
  }),
  authMiddleware,
  async (req, res) => {
    const id = +req.params.id;
    const body = req.body;
    const updatedPost = await prisma.communityPost.update({
      where: {
        id,
      },
      data: {
        ...body,
      },
    });
    res.status(200).send(updatedPost);
  }
);

communityPostsRouter.delete(
  "/:id",
  validateRequest({
    params: z.object({
      id: z.coerce.number(),
    }),
  }),
  authMiddleware,
  async (req, res) => {
    const id = +req.params.id;
    const deletedPost = await prisma.communityPost.delete({
      where: { id },
    });
    res.status(200).send(deletedPost);
  }
);

export { communityPostsRouter };
