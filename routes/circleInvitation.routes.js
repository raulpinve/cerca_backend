import { Router } from "express";

import {
  create,
  getPending,
  accept,
  reject,
  cancel,
} from "../controllers/circleInvitation.controller.js";

import {
  authenticateToken,
} from "../middlewares/auth.middleware.js";

import validate from "../middlewares/error.validators.middleware.js";

import {
  createCircleInvitationValidator,
  circleInvitationIdValidator,
} from "../validators/circleInvitation.validator.js";

const router = Router();

router.use(authenticateToken);

router.post(
  "/",
  createCircleInvitationValidator,
  validate,
  create
);

router.get(
  "/",
  getPending
);

router.put(
  "/:id/accept",
  circleInvitationIdValidator,
  validate,
  accept
);

router.put(
  "/:id/reject",
  circleInvitationIdValidator,
  validate,
  reject
);

router.delete(
  "/:id",
  circleInvitationIdValidator,
  validate,
  cancel
);

export default router;