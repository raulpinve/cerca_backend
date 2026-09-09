import { Router } from "express";

import {
  create,
  getPending,
  accept,
  reject,
  cancel,
} from "../controllers/family-invitation.controller.js";

import {
  authenticateToken,
} from "../middlewares/auth.middleware.js";

import validate from "../middlewares/error.validators.middleware.js";

import {
  createFamilyInvitationValidator,
  familyInvitationIdValidator,
} from "../validators/family-invitation.validator.js";

const router = Router();

router.use(authenticateToken);

router.post(
  "/",
  createFamilyInvitationValidator,
  validate,
  create
);

router.get(
  "/",
  getPending
);

router.put(
  "/:id/accept",
  familyInvitationIdValidator,
  validate,
  accept
);

router.put(
  "/:id/reject",
  familyInvitationIdValidator,
  validate,
  reject
);

router.delete(
  "/:id",
  familyInvitationIdValidator,
  validate,
  cancel
);

export default router;  