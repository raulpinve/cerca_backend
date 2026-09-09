import { Router } from "express";

import {
  getMembers,
  removeMember,
  leave,
} from "../controllers/family-member.controller.js";

import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticateToken);

router.get(
  "/:familyId/members",
  getMembers
);

router.delete(
  "/:familyId/members/me",
  leave
);

router.delete(
  "/:familyId/members/:userId",
  removeMember
);


export default router;