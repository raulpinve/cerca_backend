import camelcaseKeys from "camelcase-keys";

import {
  getFamilyMembers,
  deleteFamilyMember,
  leaveFamily,
} from "../repositories/family-member.repository.js";

import {respuestaExitosa} from "../utils/response.utils.js";
import { throwBadRequestError, throwNotFoundError } from "../errors/throwHTTPErrors.js";

export async function getMembers(req, res, next) {
  try {
    const { familyId } = req.params;

    const members = await getFamilyMembers(
      familyId
    );

    const formattedMembers = camelcaseKeys(
      members,
      { deep: true }
    );

    return respuestaExitosa(
      res,
      200,
      "Miembros de la familia obtenidos correctamente",
      formattedMembers
    );
  } catch (error) {
    next(error);
  }
}

export async function removeMember(req, res, next) {
  try {
    const { familyId, userId } = req.params;
    const requesterId = req.user.id;

    // El owner no puede eliminarse a sí mismo
    if (userId === requesterId) {
      throwBadRequestError(undefined, "El owner no puede eliminarse de esta forma");
    }
    const member = await deleteFamilyMember(
      familyId,
      userId,
      requesterId
    );

    if (!member) {
      throwNotFoundError("El miembro no existe o no tienes permisos para eliminarlo");
    }

    const formattedMember = camelcaseKeys(
      member,
      { deep: true }
    );

    return respuestaExitosa(
      res,
      200,
      "Miembro eliminado correctamente",
      formattedMember
    );
  } catch (error) {
    next(error);
  }
}

export async function leave(req, res, next) {
  try {
    const { familyId } = req.params;

    const userId = req.user.id;

    const member = await leaveFamily(
      familyId,
      userId
    );

    if (!member) {
      throwNotFoundError("No perteneces a esta familia");
    }

    const formattedMember = camelcaseKeys(
      member,
      { deep: true }
    );

    return respuestaExitosa(
      res,
      200,
      "Has salido de la familia correctamente",
      formattedMember
    );
  } catch (error) {
    next(error);
  }
}