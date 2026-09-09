import { body, param } from "express-validator";

export const createCircleValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("El nombre del círculo es obligatorio")
    .isLength({ max: 100 })
    .withMessage("El nombre no puede superar los 100 caracteres"),
];

export const updateCircleValidator = [
  param("id")
    .isUUID()
    .withMessage("El ID del círculo no es válido"),

  body("name")
    .trim()
    .notEmpty()
    .withMessage("El nombre del círculo es obligatorio")
    .isLength({ max: 100 })
    .withMessage("El nombre no puede superar los 100 caracteres"),
];

export const getCircleValidator = [
  param("id")
    .isUUID()
    .withMessage("El ID del círculo no es válido"),
];