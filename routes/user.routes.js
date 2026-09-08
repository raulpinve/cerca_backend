import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { registrarUsuario } from "../controllers/user.controller.js";
const router = Router();

router.post(
  "/",
  authenticateToken,
  registrarUsuario
);

export default router;