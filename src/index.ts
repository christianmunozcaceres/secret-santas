import { PrismaClient } from "@prisma/client";
import bodyParser from "body-parser";
import express from "express";
import {
  createChristmasGroupRouter,
  createSecretSantaRouter,
  createUserRouter,
} from "./api";
import { SendgridClient } from "./lib";
require("dotenv").config();

const startServer = async () => {
  const server = express();
  server.use(bodyParser.json());

  // Dependencies
  const prisma = new PrismaClient();
  const mailer = new SendgridClient({
    apiKey: envOrError("SENDGRID_API_KEY"),
    fromEmail: envOrError("FROM_EMAIL"),
  });

  // Routes
  server.get("/", (req, res) => {
    res.send("up and running, sir!");
  });
  server.use("/user", createUserRouter(prisma));
  server.use(
    "/christmas_group",
    createChristmasGroupRouter({ prisma, mailer })
  );
  server.use("/secret_santa", createSecretSantaRouter(prisma));

  // Start server
  const port = envOrError("PORT");
  server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}, sir!`);
  });
};

const envOrError = (variable: string): string => {
  if (process.env[variable]) {
    return process.env[variable] as string;
  }

  throw Error(`Environment variable ${variable} is not set!`);
};

startServer();
