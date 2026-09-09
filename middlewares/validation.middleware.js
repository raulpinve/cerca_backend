import { validationResult } from "express-validator";

export function validate(req, res, next) {
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Datos inválidos",
      errors: errores.array(),
    });
  }

  next();
}