import { Router } from "express";

import {
  create,
  getAll,
  getById,
  update,
  remove,
} from "../controllers/family.controller.js";

import { authenticateToken } from "../middlewares/auth.middleware.js";

import validate from "../middlewares/error.validators.middleware.js";

import {
  createFamilyValidator,
  updateFamilyValidator,
  getFamilyValidator,
} from "../validators/family.validator.js";

const router = Router();

router.use(authenticateToken);

router.post(
  "/",
  createFamilyValidator,
  validate,
  create
);

router.get(
  "/",
  getAll
);

router.get(
  "/:id",
  getFamilyValidator,
  validate,
  getById
);

router.put(
  "/:id",
  updateFamilyValidator,
  validate,
  update
);

router.delete(
  "/:id",
  getFamilyValidator,
  validate,
  remove
);

export default router;