import { Router } from "express";

import {
  updateMyLocation,
  getCircleLocations,
  getUserLocation,
  getUserLocationHistory,
} from "../controllers/location.controller.js";

import {
  updateLocationValidator,
  circleIdValidator,
  userIdValidator,
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
  "/users/:userId",
  userIdValidator,
  handleValidationErrors,
  getUserLocation
);

router.get(
  "/users/:userId/history",
  locationHistoryValidator,
  handleValidationErrors,
  getUserLocationHistory
);

export default router;