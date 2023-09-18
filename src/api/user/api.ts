import { PrismaClient, User } from "@prisma/client";
import { Request, Response, Router } from "express";
import { handleValidation } from "../../lib";
import { userValidations } from "./validation";

export const createUserRouter = (prisma: PrismaClient): Router => {
  return Router()
    .post(
      "/",
      handleValidation([userValidations.email, userValidations.name]),
      async (request: Request, response: Response) => {
        try {
          const { email, name } = request.body as User;

          const result = await prisma.user.create({ data: { email, name } });

          response.json(result);
        } catch (error) {
          console.error({ error });
          response.send(`failed to create user`);
        }
      }
    )
    .get("/all", async (request, response) => {
      try {
        // TODO: add pagination
        const users = await prisma.user.findMany({ take: 100 });
        response.json(users);
      } catch (error) {
        console.error(error);
        response.send(`couldn't find users`);
      }
    })
    .get(
      "/id/:id",
      handleValidation([userValidations.id]),
      async (request: Request, response: Response) => {
        try {
          const id = request.params.id;

          const user = await prisma.user.findFirstOrThrow({ where: { id } });
          response.json(user);
        } catch (error) {
          console.error(error);
          response.send(`couldn't find user with id: ${request.params.id}`);
        }
      }
    )
    .get(
      "/email/:email",
      handleValidation([userValidations.email]),
      async (request: Request, response: Response) => {
        try {
          const email = request.params.email;

          const user = await prisma.user.findFirstOrThrow({ where: { email } });
          response.json(user);
        } catch (error) {
          console.error(error);
          response.send(
            `couldn't find user with email: ${request.params.email}`
          );
        }
      }
    )
    .patch(
      "/",
      handleValidation([
        userValidations.id,
        userValidations.email.optional(),
        userValidations.name.optional(),
      ]),
      async (request: Request, response: Response) => {
        try {
          const { id, name, email } = request.body as {
            id: string;
            name?: string;
            email?: string;
          };
          const result = await prisma.user.update({
            where: { id },
            data: { name, email },
          });

          response.json(result);
        } catch (error) {
          console.error(error);
          response.json({
            message: "Couldn't update user",
            payload: request.body,
          });
        }
      }
    )
    .delete(
      "/id/:id",
      handleValidation([userValidations.id]),
      async (request: Request, response: Response) => {
        try {
          const id = request.params.id;
          await prisma.user.delete({ where: { id } });
          response.send(`successfully deleted user with id ${id}`);
        } catch (error) {
          console.error(error);
          response.send(`failed to delete user with id ${request.params.id}`);
        }
      }
    );
};
