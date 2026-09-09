import { pool } from "../init.db.js";

export async function createFamily(name) {
  const { rows } = await pool.query(
    `
    INSERT INTO families (name)
    VALUES ($1)
    RETURNING id, name, created_at
    `,
    [name]
  );

  return rows[0];
}

export async function getFamilies() {
  const { rows } = await pool.query(
    `
    SELECT id, name, created_at
    FROM families
    ORDER BY created_at DESC
    `
  );

  return rows;
}

export async function getFamilyById(id) {
  const { rows } = await pool.query(
    `
    SELECT id, name, created_at
    FROM families
    WHERE id = $1
    `,
    [id]
  );

  return rows[0];
}

export async function updateFamily(id, name) {
  const { rows } = await pool.query(
    `
    UPDATE families
    SET name = $1
    WHERE id = $2
    RETURNING id, name, created_at
    `,
    [name, id]
  );

  return rows[0];
}

export async function deleteFamily(id) {
  const { rows } = await pool.query(
    `
    DELETE FROM families
    WHERE id = $1
    RETURNING id, name, created_at
    `,
    [id]
  );

  return rows[0];
}