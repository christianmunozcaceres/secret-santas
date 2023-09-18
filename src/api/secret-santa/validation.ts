import { check } from "express-validator";

export const secretSantaValidations = {
  id: check("id").isUUID().withMessage("id must be of type UUID"),
  christmasGroupId: check("christmasGroupId")
    .isUUID()
    .withMessage("christmasGroupId must be of type UUID"),
  userId: check("userId").isUUID().withMessage("userId must be of type UUID"),
};
