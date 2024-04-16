import { Router } from "express";
import { prisma } from "../../prisma/db.setup";
import { v2 as cloudinary } from "cloudinary";
import { validateRequest } from "zod-express-middleware";
import { z } from "zod";

const photosRouter = Router();

photosRouter.get("/", async (req, res) => {
  const allPhotos = await prisma.photo.findMany();
  res.status(200).send(allPhotos);
});

photosRouter.post(
  "/upload",
  validateRequest({
    body: z.object({
      image: z.string(),
      date: z.string(),
    }),
  }),
  async (req, res) => {
    const image = req.body.image;
    const date = req.body.date;
    const newPhoto = await prisma.photo.create({
      data: {
        image,
        date,
      },
    });
    res.status(200).send(newPhoto);
  }
);

export { photosRouter };
