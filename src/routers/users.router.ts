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

//login
// userRouter.post("/login", async (req, res) => {
//   const username = req.body.username;
//   console.log(username);
//   const singleUser = await prisma.user.findUnique({
//     where: {
//       username,
//     },
//   });
//   console.log(singleUser);

//   return res.status(200).send(singleUser);
// });

//create
userRouter.post("/", async (req, res) => {
  // console.log(req.body);
  const newUser = await prisma.user.create({
    data: {
      ...req.body,
    },
  });
  console.log(newUser);
  return res.status(200).send(newUser);
});

export { userRouter };
