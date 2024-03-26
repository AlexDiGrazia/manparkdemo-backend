import { Router } from "express";
import { prisma } from "../../prisma/db.setup";
import { validateRequest } from "zod-express-middleware";
import { z } from "zod";
import { authMiddleware } from "../auth-utils";

const eventsRouter = Router();

eventsRouter.get("/", async (req, res) => {
  const allEvents = await prisma.event.findMany();
  res.status(200).send(allEvents);
});

eventsRouter.post(
  "/",
  validateRequest({
    body: z.object({
      date: z.string().datetime(),
      title: z.string(),
      details: z.string(),
    }),
  }),
  authMiddleware,
  async (req, res) => {
    const { date, title, details } = req.body;
    const user = req.user!.username;
    const newEvent = await prisma.event.create({
      data: {
        user,
        date,
        title,
        details,
      },
    });

    res.status(200).send(newEvent);
  }
);

//TO_DO consider narrowing down to only accept the details of the body
//NEW TO_DO verify syntax for narrowing down to only details is correct. I was sleepy when I wrote this
eventsRouter.patch(
  "/:id",
  validateRequest({
    params: z.object({
      id: z.coerce.number(),
    }),
    body: z.object({
      details: z.string(),
    }),
  }),
  async (req, res) => {
    const body = req.body;
    const details = req.body.details;
    const id = +req.params.id;
    const updatedEventDetails = await prisma.event.update({
      where: { id },
      data: {
        details,
      },
    });
    res.status(200).send(updatedEventDetails);
  }
);

eventsRouter.delete(
  "/:id",
  validateRequest({
    params: z.object({
      id: z.coerce.number(),
    }),
  }),
  async (req, res) => {
    const id = +req.params.id;
    const deletedEvent = await prisma.event.delete({
      where: { id },
    });
    res.status(200).send(deletedEvent);
  }
);

export { eventsRouter };
