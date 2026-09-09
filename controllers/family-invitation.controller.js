import camelcaseKeys from "camelcase-keys";

import {
  getUserByEmail,
} from "../repositories/user.repository.js";

import {
  createFamilyInvitation,
  getPendingInvitations,
  getInvitationById,
  acceptFamilyInvitation,
  rejectFamilyInvitation,
  cancelFamilyInvitation,
} from "../repositories/family-invitation.repository.js";

import { respuestaExitosa } from "../utils/response.utils.js";
import { throwBadRequestError, throwForbiddenError, throwNotFoundError, throwUnauthorizedError } from "../errors/throwHTTPErrors.js";

export async function create(req, res, next) {
  try {
    const { familyId, email } = req.body;
    const invitedUser = await getUserByEmail(email);

    if (!invitedUser) {
      throwNotFoundError("El usuario no existe");
    }

    if (invitedUser.id === req.user.id) {
      throwBadRequestError(undefined, "No puedes invitarte a ti mismo");
    }

    const invitation = await createFamilyInvitation(
      familyId,
      invitedUser.id,
      req.user.id
    );

    return respuestaExitosa(
      res,
      201,
      "Invitación creada correctamente",
      invitation
    );
  } catch (error) {
    next(error);
  }
}

export async function getPending(req, res, next) {
  try {
    const userId = req.user.id;

    const invitations = await getPendingInvitations(
      userId
    );

    const formattedInvitations = camelcaseKeys(
      invitations,
      { deep: true }
    );

    return respuestaExitosa(
      res,
      200,
      "Invitaciones pendientes obtenidas correctamente",
      formattedInvitations
    );
  } catch (error) {
    next(error);
  }
}

export async function accept(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const invitation = await getInvitationById(id);

    if (!invitation) {
      throwBadRequestError(undefined, "Invitación no encontrada");
    }

    if (invitation.invited_user_id !== userId) {
      throwForbiddenError(undefined, "No tienes permiso para aceptar esta invitación");
    }

    const acceptedInvitation =
      await acceptFamilyInvitation(id, userId);

    const formattedInvitation = camelcaseKeys(
      acceptedInvitation,
      { deep: true }
    );

    return respuestaExitosa(
      res,
      200,
      "Invitación aceptada correctamente",
      formattedInvitation
    );
  } catch (error) {
    next(error);
  }
}

export async function reject(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const invitation = await getInvitationById(id);
    if (!invitation) {
      throwNotFoundError("Invitación no encontrada");
    }

    if (invitation.invited_user_id !== userId) {
      throwForbiddenError("No tienes permiso para rechazar esta invitación");
    }

    if (invitation.status !== "pending") {
      throwBadRequestError(undefined, "No tienes permiso para rechazar esta invitación");
    }

    const rejectedInvitation = await rejectFamilyInvitation(id, userId);
    const formattedInvitation = camelcaseKeys(
      rejectedInvitation,
      { deep: true }
    );

    return respuestaExitosa(
      res,
      200,
      "Invitación rechazada correctamente",
      formattedInvitation
    );
  } catch (error) {
    next(error);
  }
}

export async function cancel(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const invitation = await getInvitationById(id);

    if (!invitation) {
      throwNotFoundError("Invitación no encontrada");
    }

    if (invitation.invited_by !== userId) {
      throwForbiddenError("No tienes permiso para cancelar esta invitación");
    }

    if (invitation.status !== "pending") {
      throwBadRequestError(undefined,  "La invitación ya no está pendiente");
    }

    const cancelledInvitation =
      await cancelFamilyInvitation(id, userId);

    const formattedInvitation = camelcaseKeys(
      cancelledInvitation,
      { deep: true }
    );

    return respuestaExitosa(
      res,
      200,
      "Invitación cancelada correctamente",
      formattedInvitation
    );
  } catch (error) {
    next(error);
  }
}