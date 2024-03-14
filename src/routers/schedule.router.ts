import { Router } from "express";
import { prisma } from "../../prisma/db.setup";

const scheduleRouter = Router();

scheduleRouter.get("/", async (req, res) => {
  const allSchedules = await prisma.schedule.findMany();
  res.status(200).send(allSchedules);
});

export { scheduleRouter };
