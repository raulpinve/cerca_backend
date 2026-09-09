import { pool } from "../init.db.js";

export async function getUserByEmail(email) {
  const { rows } = await pool.query(
    `
    SELECT
      id,
      firebase_uid,
      first_name,
      last_name,
      email
    FROM users
    WHERE LOWER(email) = LOWER($1)
    `,
    [email]
  );

  return rows[0];
}

export async function getUserByFirebaseUid(firebaseUid) {
  const { rows } = await pool.query(
    `
    SELECT id, firebase_uid, first_name, last_name, email
    FROM users
    WHERE firebase_uid = $1
    `,
    [firebaseUid]
  );

  return rows[0];
}