import { respuestaError } from "../utils/response.utils.js";

export function manejarErrores(error, req, res, next) {
  console.error(error);

  return respuestaError(
    res,
    500,
    "Error interno del servidor"
  );
}