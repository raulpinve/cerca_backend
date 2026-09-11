import { getAuth } from "firebase-admin/auth";
import { app } from "../config/firebase.js";
import { pool } from "../init.db.js";

export async function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Token no proporcionado",
      });
    }

    const token = authHeader.split("Bearer ")[1];

    // 1. Verificar token de Firebase
    const decodedToken = await getAuth(app).verifyIdToken(token);

    const firebaseUid = decodedToken.uid;
    const email = decodedToken.email ?? null;
    const nombreCompleto = decodedToken.name ?? "";

    // 2. Separar nombre y apellidos
    const partesNombre = nombreCompleto.trim().split(/\s+/).filter(Boolean);

    const firstName = partesNombre.shift() || "Usuario";
    const lastName = partesNombre.join(" ") || null;

    // 3. Crear usuario si no existe; si ya existe, lo actualiza y devuelve
    const { rows } = await pool.query(
      `
      INSERT INTO users (
        firebase_uid,
        first_name,
        last_name,
        email
      )
      VALUES ($1, $2, $3, $4)

      ON CONFLICT (firebase_uid)
      DO UPDATE SET
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        email = EXCLUDED.email

      RETURNING
        id,
        firebase_uid,
        first_name,
        last_name,
        email,
        created_at
      `,
      [firebaseUid, firstName, lastName, email]
    );

    const dbUser = rows[0];

    req.user = {
      id: dbUser.id,
      firebaseUid: dbUser.firebase_uid,
      firstName: dbUser.first_name,
      lastName: dbUser.last_name,
      email: dbUser.email,
      createdAt: dbUser.created_at,
    };

    // 5. Continuar
    next();
  } catch (error) {
    console.error("Error en authenticateToken:", error);

    return res.status(401).json({
      error: "Token inválido o error autenticando usuario",
    });
  }
}