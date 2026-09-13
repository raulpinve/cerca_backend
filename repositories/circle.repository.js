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

export async function getCircles(userId) {
  const { rows } = await pool.query(
    `
    SELECT
      c.id,
      c.name,
      c.created_at,
      COUNT(cm2.user_id) AS member_count,
      ARRAY_AGG(
        UPPER(LEFT(u2.first_name, 1) || COALESCE(LEFT(u2.last_name, 1), ''))
        ORDER BY cm2.created_at
      ) AS member_initials
    FROM circles c
    INNER JOIN circle_members cm
      ON cm.circle_id = c.id AND cm.user_id = $1
    INNER JOIN circle_members cm2
      ON cm2.circle_id = c.id
    INNER JOIN users u2
      ON u2.id = cm2.user_id
    GROUP BY c.id, c.name, c.created_at
    ORDER BY c.name
    `,
    [userId]
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