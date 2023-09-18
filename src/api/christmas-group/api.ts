import { ChristmasGroup, PrismaClient, SecretSanta } from "@prisma/client";
import { Request, Response, Router } from "express";
import { Mailer, handleValidation } from "../../lib";
import { dumbAssignGivers } from "./assign-givers.dumb";
import { cleanAndSortSecretSantas } from "./clean-sort-secret-santas";
import { mailGivers } from "./mail-givers";
import { SecretSantaWithUsers } from "./types";
import { christmasGroupValidations } from "./validation";

export const createChristmasGroupRouter = (deps: {
  prisma: PrismaClient;
  mailer: Mailer;
}): Router => {
  const { prisma, mailer } = deps;
  return Router()
    .post(
      "/",
      handleValidation([
        christmasGroupValidations.title,
        christmasGroupValidations.year,
      ]),
      async (request: Request, response: Response) => {
        try {
          const { title, year } = request.body as ChristmasGroup;

          const result = await prisma.christmasGroup.create({
            data: { title, year },
            include: { participants: true, SecretSanta: true },
          });

          response.json(result);
        } catch (error) {
          console.error({ error });
          response.send(`failed to create christmas-group`);
        }
      }
    )
    .get("/all", async (request, response) => {
      try {
        // TODO: add pagination
        const christmasGroups = await prisma.christmasGroup.findMany({
          take: 100,
          include: { participants: true, SecretSanta: true },
        });
        response.json(christmasGroups);
      } catch (error) {
        console.error(error);
        response.send(`couldn't find christmas-groups`);
      }
    })
    .get(
      "/id/:id",
      handleValidation([christmasGroupValidations.id]),
      async (request: Request, response: Response) => {
        try {
          const id = request.params.id;

          const christmasGroup = await prisma.christmasGroup.findFirstOrThrow({
            where: { id },
            include: { participants: true, SecretSanta: true },
          });
          response.json(christmasGroup);
        } catch (error) {
          console.error(error);
          response.send(
            `couldn't find christmas-group with id: ${request.params.id}`
          );
        }
      }
    )
    .patch(
      "/id/:id",
      handleValidation([
        christmasGroupValidations.id,
        christmasGroupValidations.title.optional(),
        christmasGroupValidations.year.optional(),
      ]),
      async (request: Request, response: Response) => {
        try {
          const id = request.params.id;
          const { title, year } = request.body as {
            title?: string;
            year?: number;
          };
          const result = await prisma.christmasGroup.update({
            where: { id },
            data: { title, year },
            include: { participants: true, SecretSanta: true },
          });
          response.json(result);
        } catch (error) {
          console.error(error);
          response.send(
            `failed to update christmas-group with id ${request.params.id}`
          );
        }
      }
    )
    .patch(
      "/add_participant/",
      handleValidation([
        christmasGroupValidations.christmasGroupId,
        christmasGroupValidations.userId,
      ]),
      async (request: Request, response: Response) => {
        try {
          const { christmasGroupId, userId } = request.body as {
            christmasGroupId: string;
            userId: string;
          };
          const result = await prisma.christmasGroup.update({
            where: { id: christmasGroupId },
            data: { participants: { connect: { id: userId } } },
            include: { participants: true, SecretSanta: true },
          });
          response.json(result);
        } catch (error) {
          console.error(error);
          response.send(
            `failed to update christmas-group with id ${request.params.id}`
          );
        }
      }
    )
    .patch(
      "/remove_participant/",
      handleValidation([
        christmasGroupValidations.christmasGroupId,
        christmasGroupValidations.userId,
      ]),
      async (request: Request, response: Response) => {
        try {
          const { christmasGroupId, userId } = request.body as {
            christmasGroupId: string;
            userId: string;
          };
          const result = await prisma.christmasGroup.update({
            where: { id: christmasGroupId },
            data: { participants: { disconnect: { id: userId } } },
            include: { participants: true, SecretSanta: true },
          });
          response.json(result);
        } catch (error) {
          console.error(error);
          response.send(
            `failed to update christmas-group with id ${request.params.id}`
          );
        }
      }
    )
    .delete(
      "/id/:id",
      handleValidation([christmasGroupValidations.id]),
      async (request: Request, response: Response) => {
        try {
          const id = request.params.id;
          await prisma.christmasGroup.delete({ where: { id } });
          response.send(`successfully deleted christmas-group with id ${id}`);
        } catch (error) {
          console.error(error);
          response.send(
            `failed to delete christmas-group with id ${request.params.id}`
          );
        }
      }
    )
    .post(
      "/resend_emails",
      handleValidation([
        christmasGroupValidations.id,
        christmasGroupValidations.emails,
      ]),
      async (request: Request, response: Response) => {
        try {
          const { id, emails } = request.body as {
            id: string;
            emails: string[];
          };

          const secretSantas: SecretSantaWithUsers[] =
            await prisma.secretSanta.findMany({
              where: {
                christmasGroupId: id,
                AND: { giver: { email: { in: emails } } },
              },
              include: { giver: true, receiver: true },
            });

          const mailResult = await mailGivers(
            { giveList: secretSantas },
            { mailer }
          );

          response.json(mailResult);
        } catch (error) {
          console.error({ error });
          response.send(`failed to create christmas-group`);
        }
      }
    )
    .post(
      "/assign_givers/:id",
      handleValidation([christmasGroupValidations.id]),
      async (request: Request, response: Response) => {
        try {
          const christmasGroupId = request.params.id;

          const { participants, SecretSanta: giftHistory } =
            await prisma.christmasGroup.findFirstOrThrow({
              select: { participants: true, SecretSanta: true },
              where: { id: christmasGroupId },
            });
          if (giftHistory.length > 0) {
            throw Error("ChristmasGroup givers has already been assigned");
          }
          const participantIds = participants.map((p) => p.id);

          let secretSantas: SecretSanta[] = [];

          for (const id of participantIds) {
            const usersHistory = await prisma.secretSanta.findMany({
              where: { giverId: id, receiverId: { in: participantIds } },
              orderBy: { christmasGroup: { year: "asc" } },
            });
            secretSantas.push(...usersHistory);
          }

          const cleanedGiftHistory = cleanAndSortSecretSantas({
            secretSantas,
            participantIds,
          });

          const assignResult = dumbAssignGivers(cleanedGiftHistory);

          const prismaData = assignResult.map((r) => {
            const { giverId, receiverId } = r;
            return {
              christmasGroupId,
              giverId,
              receiverId,
            };
          });
          const writeResult = await prisma.secretSanta.createMany({
            data: prismaData,
          });

          const giveList: SecretSantaWithUsers[] =
            await prisma.secretSanta.findMany({
              where: { christmasGroupId },
              include: { giver: true, receiver: true },
            });

          const mailResult = await mailGivers({ giveList }, { mailer });

          response.json({ writeResult, mailResult });
        } catch (error) {
          console.error({ error });
          response.send(`failed`);
        }
      }
    );
};
