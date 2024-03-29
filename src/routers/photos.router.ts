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

// photosRouter.post("/upload", async (req, res) => {
//   console.log("end point connected");
//   cloudinary.uploader.upload(
//     "https://m.media-amazon.com/images/I/51hIdMnn1mS._AC_.jpg",
//     { public_id: "cactus", folder: "Man Park Gallary" },

//     function (error, result) {
//       console.log(result);
//       res.status(200).send(result);
//     }
//   );
// });

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
