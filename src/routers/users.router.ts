import { Router } from "express";
import { prisma } from "../../prisma/db.setup";

const userRouter = Router();

//index
userRouter.get("/", async (req, res) => {
  const allUsers = await prisma.user.findMany();
  return res.status(200).send(allUsers);
});

//TO_DO
//Show endpoint
userRouter.get("/:id", async (req, res) => {
  const id = +req.params.id;
  const uniqueUser = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  return res.status(201).send(uniqueUser);
});

//create
userRouter.post("/", async (req, res) => {
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
});

export { userRouter };
