import { body, param } from "express-validator";

export const createCircleInvitationValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("El correo electrónico es obligatorio")
    .isEmail()
    .withMessage("El correo electrónico no es válido"),

  body("circleId")
    .notEmpty()
    .withMessage("El ID del círculo es obligatorio")
    .isUUID()
    .withMessage("El ID del círculo no es válido"),
];

export const circleInvitationIdValidator = [
  param("id")
    .isUUID()
    .withMessage("El ID de la invitación no es válido"),
];