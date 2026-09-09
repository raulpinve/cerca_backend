import { body, param } from "express-validator";

export const createFamilyInvitationValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("El correo electrónico es obligatorio")
    .isEmail()
    .withMessage("El correo electrónico no es válido"),

  body("familyId")
    .notEmpty()
    .withMessage("El ID de la familia es obligatorio")
    .isUUID()
    .withMessage("El ID de la familia no es válido"),
];

export const familyInvitationIdValidator = [
  param("id")
    .isUUID()
    .withMessage("El ID de la invitación no es válido"),
];