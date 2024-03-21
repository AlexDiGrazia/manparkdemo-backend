import { Router } from "express";
import { prisma } from "../../prisma/db.setup";
import { resolve } from "path";

const scheduleRouter = Router();

//show
scheduleRouter.get("/:user", async (req, res) => {
  const user = req.params.user;
  const currentProfileScheduleData = await prisma.schedule.findMany({
    where: {
      user,
    },
  });
  res.status(200).send(currentProfileScheduleData);
});

// Post
scheduleRouter.post("/", async (req, res) => {
  const day = +req.body.day;
  const newAppointment = await prisma.schedule.create({
    data: {
      ...req.body,
      day,
    },
  });
  res.status(200).send(newAppointment);
});

// Update
scheduleRouter.patch("/:id", async (req, res) => {
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
});

// Delete one or many appointments
scheduleRouter.post("/delete", async (req, res) => {
  const deletionQueue = req.body.deletionQueue;
  const deletedAppointments = await prisma.schedule.deleteMany({
    where: {
      id: {
        in: deletionQueue,
      },
    },
  });
  res.status(200).send(deletedAppointments);
});

export { scheduleRouter };
