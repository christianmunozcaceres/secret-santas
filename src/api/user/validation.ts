import { check } from 'express-validator';

export const userValidations = {
  id: check('id').isUUID().withMessage('id must be of type UUID'),
  email: check('email').isEmail().withMessage('invalid email format'),
  name: check('name').isString().withMessage('name must be of type String'),
};
