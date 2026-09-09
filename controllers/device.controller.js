import camelcaseKeys from "camelcase-keys";

import {
  createDevice,
  getUserDevices,
  updateDevice,
  deactivateDevice,
  deleteDevice,
} from "../repositories/device.repository.js";

import {
  respuestaExitosa,
  respuestaError,
} from "../utils/response.utils.js";

export async function create(req, res, next) {
  try {
    const {
      deviceName,
      platform,
    } = req.body;

    const userId = req.user.id;

    const device = await createDevice(
      userId,
      deviceName,
      platform
    );

    const formattedDevice = camelcaseKeys(
      device,
      { deep: true }
    );

    return respuestaExitosa(
      res,
      201,
      "Dispositivo registrado correctamente",
      formattedDevice
    );
  } catch (error) {
    next(error);
  }
}

export async function getAll(req, res, next) {
  try {
    const userId = req.user.id;

    const devices = await getUserDevices(
      userId
    );

    const formattedDevices = camelcaseKeys(
      devices,
      { deep: true }
    );

    return respuestaExitosa(
      res,
      200,
      "Dispositivos obtenidos correctamente",
      formattedDevices
    );
  } catch (error) {
    next(error);
  }
}

export async function update(req, res, next) {
  try {
    const { id } = req.params;

    const {
      deviceName,
      platform,
    } = req.body;

    const userId = req.user.id;

    const device = await updateDevice(
      id,
      userId,
      deviceName,
      platform
    );

    if (!device) {
      return respuestaError(
        res,
        404,
        "Dispositivo no encontrado"
      );
    }

    const formattedDevice = camelcaseKeys(
      device,
      { deep: true }
    );

    return respuestaExitosa(
      res,
      200,
      "Dispositivo actualizado correctamente",
      formattedDevice
    );
  } catch (error) {
    next(error);
  }
}

export async function deactivate(
  req,
  res,
  next
) {
  try {
    const { id } = req.params;

    const userId = req.user.id;

    const device = await deactivateDevice(
      id,
      userId
    );

    if (!device) {
      return respuestaError(
        res,
        404,
        "Dispositivo no encontrado"
      );
    }

    const formattedDevice = camelcaseKeys(
      device,
      { deep: true }
    );

    return respuestaExitosa(
      res,
      200,
      "Dispositivo desactivado correctamente",
      formattedDevice
    );
  } catch (error) {
    next(error);
  }
}

export async function remove(
  req,
  res,
  next
) {
  try {
    const { id } = req.params;

    const userId = req.user.id;

    const device = await deleteDevice(
      id,
      userId
    );

    if (!device) {
      return respuestaError(
        res,
        404,
        "Dispositivo no encontrado"
      );
    }

    const formattedDevice = camelcaseKeys(
      device,
      { deep: true }
    );

    return respuestaExitosa(
      res,
      200,
      "Dispositivo eliminado correctamente",
      formattedDevice
    );
  } catch (error) {
    next(error);
  }
}