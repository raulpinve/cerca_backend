import camelcaseKeys from "camelcase-keys";

import {
  updateMyLocation as updateMyLocationRepository,
  getCircleLocations as getCircleLocationsRepository,
  getDeviceLocation as getDeviceLocationRepository,
  getDeviceLocationHistory as getDeviceLocationHistoryRepository,
} from "../repositories/location.repository.js";

import { respuestaExitosa } from "../utils/response.utils.js";

import { throwNotFoundError } from "../errors/throwHTTPErrors.js";

export async function updateMyLocation(req, res, next) {
  try {
    const {
      deviceId,
      latitude,
      longitude,
      accuracyM,
    } = req.body;

    const userId = req.user.id;

    const location =
      await updateMyLocationRepository(
        deviceId,
        userId,
        latitude,
        longitude,
        accuracyM
      );

    if (!location) {
      throwNotFoundError(
        "El dispositivo no existe o no pertenece al usuario"
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

export async function getDeviceLocation(req, res, next) {
  try {
    const { deviceId } = req.params;
    const userId = req.user.id;

    const location =
      await getDeviceLocationRepository(
        deviceId,
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

export async function getDeviceLocationHistory(
  req,
  res,
  next
) {
  try {
    const { deviceId } = req.params;
    const userId = req.user.id;
    const limit = Number(req.query.limit) || 20;

    const locations =
      await getDeviceLocationHistoryRepository(
        deviceId,
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