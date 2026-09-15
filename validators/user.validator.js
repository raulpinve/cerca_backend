import { body } from "express-validator";

export const updateUserValidator = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .isLength({ max: 100 })
    .withMessage("El nombre no puede superar los 100 caracteres"),
  body("lastName")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage("El apellido no puede superar los 100 caracteres"),
];