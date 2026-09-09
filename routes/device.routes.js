import { Router } from "express";

import {
  create,
  getAll,
  update,
  deactivate,
  remove,
} from "../controllers/device.controller.js";

import {
  createDeviceValidator,
  updateDeviceValidator,
  deviceIdValidator,
} from "../validators/device.validator.js";

import {
  authenticateToken,
} from "../middlewares/auth.middleware.js";

import validate from "../middlewares/error.validators.middleware.js";

const router = Router();

router.use(authenticateToken);

router.post(
  "/",
  createDeviceValidator,
  validate,
  create
);

router.get(
  "/",
  getAll
);

router.put(
  "/:id",
  updateDeviceValidator,
  validate,
  update
);

router.patch(
  "/:id/deactivate",
  deviceIdValidator,
  validate,
  deactivate
);

router.delete(
  "/:id",
  deviceIdValidator,
  validate,
  remove
);

export default router;