import camelcaseKeys from "camelcase-keys";
import { throwNotFoundError } from "../errors/throwHTTPErrors.js";
import { updateUserByFirebaseUid } from "../repositories/user.repository.js";
import { respuestaExitosa } from "../utils/response.utils.js";

export async function getMe(req, res, next) {
  try {
    return respuestaExitosa(res, 200, "OK", req.user);
  } catch (error) {
    next(error);
  }
}

export async function updateMe(req, res, next) {
  try {
    const { firstName, lastName } = req.body;

    const updated = await updateUserByFirebaseUid(req.user.firebaseUid, {
      firstName,
      lastName: lastName || null,
    });

    if (!updated) {
      throwNotFoundError("Usuario no encontrado");
    }

    const formattedUser = camelcaseKeys(updated, { deep: true });

    return respuestaExitosa(
      res,
      200,
      "Perfil actualizado correctamente",
      formattedUser
    );
  } catch (error) {
    next(error);
  }
}