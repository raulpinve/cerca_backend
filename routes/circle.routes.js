import { Router } from "express";

import {
  create,
  getAll,
  getById,
  update,
  remove,
} from "../controllers/circle.controller.js";

import { authenticateToken } from "../middlewares/auth.middleware.js";

import validate from "../middlewares/error.validators.middleware.js";

import {
  createCircleValidator,
  updateCircleValidator,
  getCircleValidator,
} from "../validators/circle.validator.js";

const router = Router();

router.use(authenticateToken);

router.post(
  "/",
  createCircleValidator,
  validate,
  create
);

router.get(
  "/",
  getAll
);

router.get(
  "/:id",
  getCircleValidator,
  validate,
  getById
);

router.put(
  "/:id",
  updateCircleValidator,
  validate,
  update
);

router.delete(
  "/:id",
  getCircleValidator,
  validate,
  remove
);

export default router;