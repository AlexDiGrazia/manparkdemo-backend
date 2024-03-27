import { Router } from "express";
import { prisma } from "../../prisma/db.setup";
import { resolve } from "path";
import { validateRequest } from "zod-express-middleware";
import { z } from "zod";
import { authMiddleware } from "../auth-utils";

const scheduleRouter = Router();

//show
scheduleRouter.get(
  "/:user",
  validateRequest({
    params: z.object({
      user: z.string(),
    }),
  }),
  async (req, res) => {
    const user = req.params.user;
    const currentProfileScheduleData = await prisma.schedule.findMany({
      where: {
        user,
      },
    });
    res.status(200).send(currentProfileScheduleData);
  }
);

// Post
scheduleRouter.post(
  "/",
  validateRequest({
    body: z.object({
      day: z.number(),
      event: z.string(),
    }),
  }),
  authMiddleware,
  async (req, res) => {
    const day = +req.body.day;
    const user = req.user!.username;
    const newAppointment = await prisma.schedule.create({
      data: {
        ...req.body,
        user,
        day,
      },
    });
    res.status(200).send(newAppointment);
  }
);

// Update
scheduleRouter.patch(
  "/:id",
  validateRequest({
    params: z.object({
      id: z.coerce.number(),
    }),
    body: z.object({
      event: z.string(),
    }),
  }),
  authMiddleware,
  async (req, res) => {
    const id = +req.params.id;
    const event = req.body.event;
    const appointmentUpdate = await prisma.schedule.update({
      where: {
        id,
      },
      data: {
        event,
      },
    });
    res.status(200).send(appointmentUpdate);
  }
);

// Delete one or many appointments
scheduleRouter.post(
  "/delete",
  validateRequest({
    body: z.object({
      deletionQueue: z.array(z.number()),
    }),
  }),
  authMiddleware,
  async (req, res) => {
    const deletionQueue = req.body.deletionQueue;
    const deletedAppointments = await prisma.schedule.deleteMany({
      where: {
        id: {
          in: deletionQueue,
        },
      },
    });
    res.status(200).send(deletedAppointments);
  }
);

export { scheduleRouter };
