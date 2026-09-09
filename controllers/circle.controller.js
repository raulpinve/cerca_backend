import camelcaseKeys from "camelcase-keys";

import {
  createCircle,
  getCircles,
  getCircleById,
  updateCircle,
  deleteCircle,
} from "../repositories/circle.repository.js";

import { respuestaExitosa } from "../utils/response.utils.js";

import { throwNotFoundError } from "../errors/throwHTTPErrors.js";

export async function create(req, res, next) {
  try {
    const { name } = req.body;

    const circle = await createCircle(name);

    const formattedCircle = camelcaseKeys(
      circle,
      { deep: true }
    );

    return respuestaExitosa(
      res,
      201,
      "Círculo creado correctamente",
      formattedCircle
    );
  } catch (error) {
    next(error);
  }
}

export async function getAll(req, res, next) {
  try {
    const circles = await getCircles();

    return respuestaExitosa(
      res,
      200,
      "Círculos obtenidos correctamente",
      camelcaseKeys(circles, { deep: true })
    );
  } catch (error) {
    next(error);
  }
}

export async function getById(req, res, next) {
  try {
    const { id } = req.params;

    const circle = await getCircleById(id);

    if (!circle) {
      throwNotFoundError("Círculo no encontrado");
    }

    return respuestaExitosa(
      res,
      200,
      "Círculo obtenido correctamente",
      camelcaseKeys(circle, { deep: true })
    );
  } catch (error) {
    next(error);
  }
}

export async function update(req, res, next) {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const circle = await updateCircle(id, name);

    if (!circle) {
      throwNotFoundError("Círculo no encontrado");
    }

    return respuestaExitosa(
      res,
      200,
      "Círculo actualizado correctamente",
      camelcaseKeys(circle, { deep: true })
    );
  } catch (error) {
    next(error);
  }
}

export async function remove(req, res, next) {
  try {
    const { id } = req.params;

    const circle = await deleteCircle(id);

    if (!circle) {
      throwNotFoundError("Círculo no encontrado");
    }

    return respuestaExitosa(
      res,
      200,
      "Círculo eliminado correctamente",
      camelcaseKeys(circle, { deep: true })
    );
  } catch (error) {
    next(error);
  }
}