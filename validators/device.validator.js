import { body, param } from "express-validator";

export const createDeviceValidator = [
  body("deviceName")
    .optional()
    .isString()
    .withMessage(
      "El nombre del dispositivo debe ser un texto"
    )
    .trim()
    .isLength({ max: 100 })
    .withMessage(
      "El nombre del dispositivo no puede superar los 100 caracteres"
    ),

  body("platform")
    .optional()
    .isString()
    .withMessage(
      "La plataforma debe ser un texto"
    )
    .trim()
    .isLength({ max: 20 })
    .withMessage(
      "La plataforma no puede superar los 20 caracteres"
    ),
];

export const updateDeviceValidator = [
  param("id")
    .isUUID()
    .withMessage(
      "El ID del dispositivo no es válido"
    ),

  body("deviceName")
    .optional()
    .isString()
    .withMessage(
      "El nombre del dispositivo debe ser un texto"
    )
    .trim()
    .isLength({ max: 100 })
    .withMessage(
      "El nombre del dispositivo no puede superar los 100 caracteres"
    ),

  body("platform")
    .optional()
    .isString()
    .withMessage(
      "La plataforma debe ser un texto"
    )
    .trim()
    .isLength({ max: 20 })
    .withMessage(
      "La plataforma no puede superar los 20 caracteres"
    ),
];

export const deviceIdValidator = [
  param("id")
    .isUUID()
    .withMessage(
      "El ID del dispositivo no es válido"
    ),
];