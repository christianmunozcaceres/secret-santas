import { check } from "express-validator";

export const christmasGroupValidations = {
  id: check("id").isUUID().withMessage("id must be of type UUID"),
  christmasGroupId: check("christmasGroupId")
    .isUUID()
    .withMessage("christmasGroupId must be of type UUID"),
  userId: check("userId").isUUID().withMessage("userId must be of type UUID"),
  title: check("title").isString().withMessage("title must be a string"),
  year: check("year").isNumeric().withMessage("year must be a number"),
  emails: check("emails.*").isEmail().withMessage("invalid email format"),
};
