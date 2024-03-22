import { Router, Request, Response, NextFunction } from "express";
import { prisma } from "../../prisma/db.setup";
import { validateRequest } from "zod-express-middleware";
import { z } from "zod";

const profileRouter = Router();

//index
profileRouter.get("/", async (req, res) => {
  const allProfiles = await prisma.profile.findMany();
  return res.status(200).send(allProfiles);
});

//show
profileRouter.get(
  "/:id",
  validateRequest({
    params: z.object({
      id: z.coerce.number(),
    }),
  }),
  async (req, res) => {
    const id = +req.params.id;
    const singleProfile = await prisma.profile.findUnique({
      where: {
        id,
      },
    });
    return res.status(200).send(singleProfile);
  }
);

//update
profileRouter.patch(
  "/:id",
  validateRequest({
    params: z.object({
      id: z.coerce.number(),
    }),
    body: z
      .object({
        // TO_DO verify future proofing by including picture doesn't break anything
        picture: z.string(),
        bio: z.string(),
        home: z.string(),
        occupation: z.string(),
        birthday: z.string().datetime(),
      })
      .partial(),
  }),
  async (req, res) => {
    const id = +req.params.id;
    const body = req.body;
    const updatedProfile = await prisma.profile.update({
      where: { id },
      data: {
        ...body,
      },
    });
    return res.status(200).send(updatedProfile);
  }
);

//create
// Profiles get created in the same call as userRouter.post() as a nested create
// Also see front-end userAPI createNewUserAndAssociateProfile()

export { profileRouter };
