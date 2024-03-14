import { Router } from "express";
import { prisma } from "../../prisma/db.setup";

const communityPostsRouter = Router();

communityPostsRouter.get("/", async (req, res) => {
  const communityPosts = await prisma.communityPost.findMany();
  return res.status(200).send(communityPosts);
});

communityPostsRouter.post("/", async (req, res) => {
  const { user, text } = req.body;
  const newPost = await prisma.communityPost.create({
    data: {
      user,
      text,
    },
  });
  res.status(200).send(newPost);
});

communityPostsRouter.patch("/:id", async (req, res) => {
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
});

communityPostsRouter.delete("/:id", async (req, res) => {
  const id = +req.params.id;
  const deletedPost = await prisma.communityPost.delete({
    where: { id },
  });
  res.status(200).send(deletedPost);
});

export { communityPostsRouter };
