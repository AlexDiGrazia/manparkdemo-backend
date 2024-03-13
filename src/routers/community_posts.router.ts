import { Router } from "express";
import { prisma } from "../../prisma/db.setup";

const communityPostsRouter = Router();

communityPostsRouter.get("/", async (req, res) => {
  const communityPosts = await prisma.community_posts.findMany();
  return res.status(200).send(communityPosts);
});

communityPostsRouter.post("/", async (req, res) => {
  const { user, text } = req.body;
  const newPost = await prisma.community_posts.create({
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
  const updatedPost = await prisma.community_posts.update({
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
  const deletedPost = await prisma.community_posts.delete({
    where: { id },
  });
  res.status(200).send(deletedPost);
});

export { communityPostsRouter };
