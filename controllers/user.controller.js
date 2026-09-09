import { pool } from "../init.db.js";
import { respuestaExitosa } from "../utils/response.utils.js";

export async function registrarUsuario(req, res) {
  try {
    const firebaseUid = req.user.uid;
    const email = req.user.email;
    const nombreCompleto = req.user.name;

    const partesNombre = nombreCompleto?.trim().split(/\s+/) || [];

    const firstName = partesNombre.shift() || null;
    const lastName = partesNombre.join(" ") || null;

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
        email = EXCLUDED.email
      RETURNING
        id,
        firebase_uid,
        first_name,
        last_name,
        email,
        created_at
      `,
      [
        firebaseUid,
        firstName,
        lastName,
        email,
      ]
    );

    return respuestaExitosa(
      res,
      200,
      "Usuario autenticado y registrado correctamente",
      rows[0]
    );

  } catch (error) {
    console.error("Error al registrar usuario:", error);

    next(error);
  }
}