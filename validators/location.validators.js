import { body, param, query } from "express-validator";

export const updateLocationValidator = [
  body("deviceId")
    .isUUID()
    .withMessage("El ID del dispositivo no es válido"),

  body("latitude")
    .isFloat({ min: -90, max: 90 })
    .withMessage("La latitud debe ser un número entre -90 y 90"),

  body("longitude")
    .isFloat({ min: -180, max: 180 })
    .withMessage("La longitud debe ser un número entre -180 y 180"),

  body("accuracyM")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("La precisión debe ser un número mayor o igual a 0"),
];

export const circleIdValidator = [
  param("circleId")
    .isUUID()
    .withMessage("El ID del círculo no es válido"),
];

export const deviceIdValidator = [
  param("deviceId")
    .isUUID()
    .withMessage("El ID del dispositivo no es válido"),
];

export const locationHistoryValidator = [
  ...deviceIdValidator,

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("El límite debe ser un número entre 1 y 100"),
];