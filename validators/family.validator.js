import { body, param } from "express-validator";

export const createFamilyValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("El nombre de la familia es obligatorio")
    .isLength({ max: 100 })
    .withMessage("El nombre no puede superar los 100 caracteres"),
];

export const updateFamilyValidator = [
  param("id")
    .isUUID()
    .withMessage("El ID de la familia no es válido"),

  body("name")
    .trim()
    .notEmpty()
    .withMessage("El nombre de la familia es obligatorio")
    .isLength({ max: 100 })
    .withMessage("El nombre no puede superar los 100 caracteres"),
];

export const getFamilyValidator = [
  param("id")
    .isUUID()
    .withMessage("El ID de la familia no es válido"),
];