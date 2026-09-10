import { pool } from "../init.db.js";

export async function createCircle(name, userId) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const { rows: circleRows } = await client.query(
      `
      INSERT INTO circles (name)
      VALUES ($1)
      RETURNING id, name, created_at
      `,
      [name]
    );

    const circle = circleRows[0];

    await client.query(
      `
      INSERT INTO circle_members (
        circle_id,
        user_id,
        role
      )
      VALUES ($1, $2, 'owner')
      `,
      [circle.id, userId]
    );

    await client.query("COMMIT");

    return circle;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
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