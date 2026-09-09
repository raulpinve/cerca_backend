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

import {
  respuestaExitosa,
  respuestaError,
} from "../utils/response.utils.js";

export async function create(req, res, next) {
  try {
    const { familyId, email } = req.body;

    const invitedUser = await getUserByEmail(email);

    if (!invitedUser) {
      return respuestaError(
        res,
        404,
        "El usuario no existe"
      );
    }

    if (invitedUser.id === req.user.id) {
      return respuestaError(
        res,
        400,
        "No puedes invitarte a ti mismo"
      );
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
      return respuestaError(
        res,
        404,
        "Invitación no encontrada"
      );
    }

    if (invitation.invited_user_id !== userId) {
      return respuestaError(
        res,
        403,
        "No tienes permiso para aceptar esta invitación"
      );
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
      return respuestaError(
        res,
        404,
        "Invitación no encontrada"
      );
    }

    if (invitation.invited_user_id !== userId) {
      return respuestaError(
        res,
        403,
        "No tienes permiso para rechazar esta invitación"
      );
    }

    if (invitation.status !== "pending") {
      return respuestaError(
        res,
        400,
        "La invitación ya no está pendiente"
      );
    }

    const rejectedInvitation =
      await rejectFamilyInvitation(id, userId);

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
      return respuestaError(
        res,
        404,
        "Invitación no encontrada"
      );
    }

    if (invitation.invited_by !== userId) {
      return respuestaError(
        res,
        403,
        "No tienes permiso para cancelar esta invitación"
      );
    }

    if (invitation.status !== "pending") {
      return respuestaError(
        res,
        400,
        "La invitación ya no está pendiente"
      );
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