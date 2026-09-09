import camelcaseKeys from "camelcase-keys";

import {
  createFamily,
  getFamilies,
  getFamilyById,
  updateFamily,
  deleteFamily,
} from "../repositories/family.repository.js";

import { respuestaExitosa } from "../utils/response.utils.js";
import { throwNotFoundError } from "../errors/throwHTTPErrors.js";

export async function create(req, res, next) {
  try {
    const { name } = req.body;
    const family = await createFamily(name);
    const formattedFamily = camelcaseKeys(family, { deep: true });

    return respuestaExitosa(
      res,
      201,
      "Familia creada correctamente",
      formattedFamily
    );
  } catch (error) {
    next(error);
  }
}

export async function getAll(req, res, next) {
  try {
    const families = await getFamilies();

    return respuestaExitosa(
      res,
      200,
      "Familias obtenidas correctamente",
      camelcaseKeys(families, { deep: true }),
    );
  } catch (error) {
    next(error);
  }
}

export async function getById(req, res, next) {
  try {
    const { id } = req.params;

    const family = await getFamilyById(id);

    if (!family) {
      throwNotFoundError("Familia no encontrada");
    }

    return respuestaExitosa(
      res,
      200,
      "Familia obtenida correctamente",
      camelcaseKeys(family, { deep: true })
    );
  } catch (error) {
    next(error);
  }
}

export async function update(req, res, next) {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const family = await updateFamily(id, name);

    if (!family) {
      throwNotFoundError("Familia no encontrada");
    }

    return respuestaExitosa(
      res,
      200,
      "Familia actualizada correctamente",
      camelcaseKeys(family, { deep: true })
    );
  } catch (error) {
    next(error);
  }
}

export async function remove(req, res, next) {
  try {
    const { id } = req.params;

    const family = await deleteFamily(id);

    if (!family) {
      throwNotFoundError("Familia no encontrada");
    }

    return respuestaExitosa(
      res,
      200,
      "Familia eliminada correctamente",
      camelcaseKeys(family, { deep: true })
    );
  } catch (error) {
    next(error);
  }
}