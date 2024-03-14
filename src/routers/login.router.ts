import { Router } from "express";
import { prisma } from "../../prisma/db.setup";
import { log } from "console";

const loginRouter = Router();

loginRouter.post("/", async (req, res) => {
  const username = req.body.username;
  const loggedInUser = await prisma.user.findUnique({
    where: { username },
    include: {
      profile: true,
    },
  });
  return res.status(201).send(loggedInUser);
});

export { loginRouter };
