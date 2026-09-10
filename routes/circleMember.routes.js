import { Router } from "express";

import {
  getMembers,
  removeMember,
  leave,
} from "../controllers/circleMember.controller.js";

import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticateToken);

router.get(
  "/:circleId/members",
  getMembers
);

router.delete(
  "/:circleId/members/me",
  leave
);

router.delete(
  "/:circleId/members/:userId",
  removeMember
);

export default router;