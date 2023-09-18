import { Handler, NextFunction, Request, Response } from 'express';
import { ValidationChain, validationResult } from 'express-validator';

export const validateInput = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const validation = validationResult(request);
  if (!validation.isEmpty()) {
    const errors = validation.array().map((error) => {
      const { msg, param, value } = error;
      return {
        error: msg,
        message: `ValidationError: parameter "${param}" with value ${value} not valid: ${msg}`,
        [param]: value,
      };
    });

    response.status(400).json(errors);
    response.end();
    return;
  }
  next();
};

export const handleValidation = (validations: ValidationChain[]): Handler[] => {
  return [...validations, validateInput];
};
