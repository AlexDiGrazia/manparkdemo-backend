import { Router } from "express";
import { prisma } from "../../prisma/db.setup";

const profileRouter = Router();

//index
profileRouter.get("/", async (req, res) => {
  const allProfiles = await prisma.profiles.findMany();
  return res.status(200).send(allProfiles);
});

//show
profileRouter.get("/:id", async (req, res) => {
  const id = +req.params.id;
  const singleProfile = await prisma.profiles.findUnique({
    where: {
      id,
    },
  });
  return res.status(200).send(singleProfile);
});

//update
profileRouter.patch("/:id", async (req, res) => {
  const id = +req.params.id;
  const body = req.body;
  const updatedProfile = await prisma.profiles.update({
    where: { id },
    data: {
      ...body,
    },
  });
  return res.status(200).send(updatedProfile);
});

//create
profileRouter.post("/", async (req, res) => {
  console.log(req.body);
  const newProfile = await prisma.profiles.create({
    data: {
      ...req.body,
    },
  });
  return res.status(200).send(newProfile);
});

export { profileRouter };
