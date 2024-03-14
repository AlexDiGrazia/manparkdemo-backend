import { Router } from "express";
import { prisma } from "../../prisma/db.setup";

const photosRouter = Router();

photosRouter.get("/", async (req, res) => {
  const allPhotos = await prisma.photo.findMany();
  res.status(200).send(allPhotos);
});

export { photosRouter };
