import { Router } from "express";

import {
  updateMyLocation,
  getCircleLocations,
  getDeviceLocation,
  getDeviceLocationHistory,
} from "../controllers/location.controller.js";

import {
  updateLocationValidator,
  circleIdValidator,
  deviceIdValidator,
  locationHistoryValidator,
} from "../validators/location.validators.js";

import { authenticateToken } from "../middlewares/auth.middleware.js";

import handleValidationErrors from "../middlewares/error.validators.middleware.js";

const router = Router();

router.use(authenticateToken);

router.put(
  "/me",
  updateLocationValidator,
  handleValidationErrors,
  updateMyLocation
);

router.get(
  "/circles/:circleId",
  circleIdValidator,
  handleValidationErrors,
  getCircleLocations
);

router.get(
  "/devices/:deviceId",
  deviceIdValidator,
  handleValidationErrors,
  getDeviceLocation
);

router.get(
  "/devices/:deviceId/history",
  locationHistoryValidator,
  handleValidationErrors,
  getDeviceLocationHistory
);

export default router;