import camelcaseKeys from "camelcase-keys";

import {
  getCircleMembers,
  deleteCircleMember,
  leaveCircle,
} from "../repositories/circleMember.repository.js";

import { respuestaExitosa } from "../utils/response.utils.js";

import {
  throwBadRequestError,
  throwNotFoundError,
} from "../errors/throwHTTPErrors.js";

export async function getMembers(req, res, next) {
  try {
    const { circleId } = req.params;

    const members = await getCircleMembers(circleId);

    const formattedMembers = camelcaseKeys(
      members,
      { deep: true }
    );

    return respuestaExitosa(
      res,
      200,
      "Miembros del círculo obtenidos correctamente",
      formattedMembers
    );
  } catch (error) {
    next(error);
  }
}

export async function removeMember(req, res, next) {
  try {
    const { circleId, userId } = req.params;
    const requesterId = req.user.id;

    // El owner no puede eliminarse a sí mismo
    if (userId === requesterId) {
      throwBadRequestError(
        undefined,
        "El owner no puede eliminarse de esta forma"
      );
    }

    const member = await deleteCircleMember(
      circleId,
      userId,
      requesterId
    );

    if (!member) {
      throwNotFoundError(
        "El miembro no existe o no tienes permisos para eliminarlo"
      );
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
    const { circleId } = req.params;
    const userId = req.user.id;

    const member = await leaveCircle(
      circleId,
      userId
    );

    if (!member) {
      throwNotFoundError(
        "No perteneces a este círculo"
      );
    }

    const formattedMember = camelcaseKeys(
      member,
      { deep: true }
    );

    return respuestaExitosa(
      res,
      200,
      "Has salido del círculo correctamente",
      formattedMember
    );
  } catch (error) {
    next(error);
  }
}