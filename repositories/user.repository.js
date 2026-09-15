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

export async function updateUserByFirebaseUid(firebaseUid, { firstName, lastName }) {
  const { rows } = await pool.query(
    `
    UPDATE users
    SET first_name = $2, last_name = $3
    WHERE firebase_uid = $1
    RETURNING id, firebase_uid, first_name, last_name, email
    `,
    [firebaseUid, firstName, lastName]
  );

  return rows[0];
}