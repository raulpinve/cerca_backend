import camelcaseKeys from "camelcase-keys";

import {
  updateMyLocation as updateMyLocationRepository,
  getCircleLocations as getCircleLocationsRepository,
  getUserLocation as getUserLocationRepository,
  getUserLocationHistory as getUserLocationHistoryRepository,
} from "../repositories/location.repository.js";

import { respuestaExitosa } from "../utils/response.utils.js";

import { throwNotFoundError } from "../errors/throwHTTPErrors.js";

export async function updateMyLocation(req, res, next) {
  try {
    const {
      latitude,
      longitude,
      accuracyM,
    } = req.body;

    const userId = req.user.id;

    const location = await updateMyLocationRepository(
        userId,
        latitude,
        longitude,
        accuracyM
      );

    if (!location) {
      throwNotFoundError(
        "No se pudo actualizar la ubicación del usuario"
      );
    }

    const formattedLocation = camelcaseKeys(
      location,
      { deep: true }
    );

    return respuestaExitosa(
      res,
      200,
      "Ubicación actualizada correctamente",
      formattedLocation
    );
  } catch (error) {
    next(error);
  }
}

export async function getCircleLocations(req, res, next) {
  try {
    const { circleId } = req.params;
    const userId = req.user.id;

    const locations =
      await getCircleLocationsRepository(
        circleId,
        userId
      );

    const formattedLocations = camelcaseKeys(
      locations,
      { deep: true }
    );

    return respuestaExitosa(
      res,
      200,
      "Ubicaciones del círculo obtenidas correctamente",
      formattedLocations
    );
  } catch (error) {
    next(error);
  }
}

export async function getUserLocation(req, res, next) {
  try {
    const { userId: targetUserId } = req.params;
    const userId = req.user.id;

    const location =
      await getUserLocationRepository(
        targetUserId,
        userId
      );

    if (!location) {
      throwNotFoundError(
        "Ubicación no encontrada o no tienes permiso para consultarla"
      );
    }

    const formattedLocation = camelcaseKeys(
      location,
      { deep: true }
    );

    return respuestaExitosa(
      res,
      200,
      "Ubicación obtenida correctamente",
      formattedLocation
    );
  } catch (error) {
    next(error);
  }
}

export async function getUserLocationHistory(
  req,
  res,
  next
) {
  try {
    const { userId: targetUserId } = req.params;
    const userId = req.user.id;
    const limit = Number(req.query.limit) || 20;

    const locations =
      await getUserLocationHistoryRepository(
        targetUserId,
        userId,
        limit
      );

    const formattedLocations = camelcaseKeys(
      locations,
      { deep: true }
    );

    return respuestaExitosa(
      res,
      200,
      "Historial de ubicaciones obtenido correctamente",
      formattedLocations
    );
  } catch (error) {
    next(error);
  }
}