import { Router } from "express";
import { prisma } from "../../prisma/db.setup";

const eventsRouter = Router();

eventsRouter.get("/", async (req, res) => {
  const allEvents = await prisma.events.findMany();
  res.status(200).send(allEvents);
});

eventsRouter.post("/", async (req, res) => {
  const { user, date, title, details } = req.body;
  const newEvent = await prisma.events.create({
    data: {
      user,
      date,
      title,
      details,
    },
  });

  res.status(200).send(newEvent);
});

eventsRouter.patch("/:id", async (req, res) => {
  const body = req.body;
  const id = +req.params.id;
  const updatedEventDetails = await prisma.events.update({
    where: { id },
    data: {
      ...body,
    },
  });
  res.status(200).send(updatedEventDetails);
});

eventsRouter.delete("/:id", async (req, res) => {
  const id = +req.params.id;
  const deletedEvent = await prisma.events.delete({
    where: { id },
  });
  res.status(200).send(deletedEvent);
});

export { eventsRouter };
