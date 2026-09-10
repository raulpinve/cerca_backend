import { pool } from "../init.db.js";

export async function getCircleMembers(circleId) {
  const { rows } = await pool.query(
    `
    SELECT
      cm.id,
      cm.circle_id,
      cm.user_id,
      cm.role,
      cm.created_at,
      u.first_name,
      u.last_name,
      u.email
    FROM circle_members cm
    INNER JOIN users u
      ON u.id = cm.user_id
    WHERE cm.circle_id = $1
    ORDER BY cm.created_at ASC
    `,
    [circleId]
  );

  return rows;
}

export async function deleteCircleMember(
  circleId,
  userId,
  requesterId
) {
  const { rows } = await pool.query(
    `
    DELETE FROM circle_members
    WHERE circle_id = $1
      AND user_id = $2
      AND EXISTS (
        SELECT 1
        FROM circle_members
        WHERE circle_id = $1
          AND user_id = $3
          AND role = 'owner'
      )
    RETURNING
      id,
      circle_id,
      user_id,
      role,
      created_at
    `,
    [
      circleId,
      userId,
      requesterId,
    ]
  );

  return rows[0];
}

export async function leaveCircle(
  circleId,
  userId
) {
  const { rows } = await pool.query(
    `
    DELETE FROM circle_members
    WHERE circle_id = $1
      AND user_id = $2
    RETURNING
      id,
      circle_id,
      user_id,
      role,
      created_at
    `,
    [
      circleId,
      userId,
    ]
  );

  return rows[0];
}