import { pool } from "../init.db.js";

export async function createCircle(name) {
  const { rows } = await pool.query(
    `
    INSERT INTO circles (name)
    VALUES ($1)
    RETURNING id, name, created_at
    `,
    [name]
  );

  return rows[0];
}

export async function getCircles() {
  const { rows } = await pool.query(
    `
    SELECT id, name, created_at
    FROM circles
    ORDER BY created_at DESC
    `
  );

  return rows;
}

export async function getCircleById(id) {
  const { rows } = await pool.query(
    `
    SELECT id, name, created_at
    FROM circles
    WHERE id = $1
    `,
    [id]
  );

  return rows[0];
}

export async function updateCircle(id, name) {
  const { rows } = await pool.query(
    `
    UPDATE circles
    SET name = $1
    WHERE id = $2
    RETURNING id, name, created_at
    `,
    [name, id]
  );

  return rows[0];
}

export async function deleteCircle(id) {
  const { rows } = await pool.query(
    `
    DELETE FROM circles
    WHERE id = $1
    RETURNING id, name, created_at
    `,
    [id]
  );

  return rows[0];
}