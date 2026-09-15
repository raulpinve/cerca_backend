import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { updateUserValidator } from "../validators/user.validator.js";
import { getMe, updateMe } from "../controllers/user.controller.js";
import handleValidationErrors from "../middlewares/error.validators.middleware.js";

const router = Router();

router.get("/me", authenticateToken, getMe);
router.patch(
  "/me",
  authenticateToken,
  updateUserValidator,
  handleValidationErrors,
  updateMe
);

export default router;