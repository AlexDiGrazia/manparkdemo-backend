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
  if (loggedInUser) console.log(loggedInUser.profile?.id);
  return res.status(201).send(loggedInUser);
});

export { loginRouter };
