import { PrismaClient } from "@prisma/client";
import { Request, Response, Router } from "express";
import { handleValidation } from "../../lib";
import { secretSantaValidations } from "./validation";

export const createSecretSantaRouter = (prisma: PrismaClient): Router => {
  return Router()
    .get("/all", async (request, response) => {
      try {
        // TODO: add pagination
        const secretSantas = await prisma.secretSanta.findMany({ take: 100 });
        response.json(secretSantas);
      } catch (error) {
        console.error(error);
        response.send(`couldn't find secret-santas`);
      }
    })
    .get(
      "/id/:id",
      handleValidation([secretSantaValidations.id]),
      async (request: Request, response: Response) => {
        try {
          const id = request.params.id;

          const secretSanta = await prisma.secretSanta.findFirstOrThrow({
            where: { id },
          });
          response.json(secretSanta);
        } catch (error) {
          console.error(error);
          response.send(
            `couldn't find secret-santa with id: ${request.params.id}`
          );
        }
      }
    )
    .delete(
      "/christmas_group_id/:christmasGroupId",
      handleValidation([secretSantaValidations.christmasGroupId]),
      async (request: Request, response: Response) => {
        try {
          const christmasGroupId = request.params.christmasGroupId;

          const secretSanta = await prisma.secretSanta.deleteMany({
            where: { christmasGroupId },
          });
          response.json(secretSanta);
        } catch (error) {
          console.error(error);
          response.send(
            `couldn't delete secret-santas from group with id: ${request.params.christmasGroupId}`
          );
        }
      }
    );
};
