import { Router } from "express";

import {
  updateMyLocation,
  getFamilyLocations,
  getDeviceLocation,
  getDeviceLocationHistory,
} from "../controllers/location.controller.js";

import {
  updateLocationValidator,
  familyIdValidator,
  deviceIdValidator,
  locationHistoryValidator,
} from "../validators/location.validators.js";

import {
  authenticateToken,
} from "../middlewares/auth.middleware.js";

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
  "/families/:familyId",
  familyIdValidator,
  handleValidationErrors,
  getFamilyLocations
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