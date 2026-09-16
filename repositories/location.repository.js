import { pool } from "../init.db.js";
import { emitLocationUpdate } from "../src/sockets/socketServer.js";

export async function updateMyLocation(
  userId,
  latitude,
  longitude,
  accuracyM
) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Guardar ubicación en historial
    const { rows: historyRows } = await client.query(
      `
      INSERT INTO location_history (user_id, latitude, longitude, accuracy_m)
      VALUES ($1, $2, $3, $4)
      RETURNING id, user_id, latitude, longitude, accuracy_m, recorded_at
      `,
      [userId, latitude, longitude, accuracyM]
    );

    // 2. Actualizar ubicación actual
    const { rows } = await client.query(
      `
      INSERT INTO current_locations (user_id, latitude, longitude, accuracy_m)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (user_id)
      DO UPDATE SET
        latitude = EXCLUDED.latitude,
        longitude = EXCLUDED.longitude,
        accuracy_m = EXCLUDED.accuracy_m,
        updated_at = NOW()
      RETURNING user_id, latitude, longitude, accuracy_m, updated_at
      `,
      [userId, latitude, longitude, accuracyM]
    );

    await client.query("COMMIT");

    // 3. Emite el update por socket a todos los círculos del usuario
    const { rows: circleRows } = await pool.query(
      `SELECT circle_id FROM circle_members WHERE user_id = $1`,
      [userId]
    );

    for (const { circle_id } of circleRows) {
      emitLocationUpdate(circle_id, {
        userId,
        latitude,
        longitude,
        accuracyM,
        updatedAt: rows[0].updated_at,
      });
    }

    return rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function getCircleLocations(circleId, userId) {
  const { rows } = await pool.query(
    `
    SELECT
      cl.user_id,
      u.first_name,
      u.last_name,

      UPPER(
        CASE
          WHEN u.first_name IS NOT NULL OR u.last_name IS NOT NULL THEN
            LEFT(COALESCE(u.first_name, ''), 1) ||
            LEFT(COALESCE(u.last_name, ''), 1)
          ELSE
            LEFT(u.email, 2)
        END
      ) AS member_initials,

      cl.latitude,
      cl.longitude,
      cl.accuracy_m,
      cl.updated_at,

      COALESCE(trail.points, '[]'::json) AS recent_trail

    FROM current_locations cl

    INNER JOIN users u
      ON u.id = cl.user_id

    INNER JOIN circle_members cm
      ON cm.user_id = cl.user_id

    LEFT JOIN LATERAL (
      SELECT json_agg(
        json_build_object(
          'latitude', h.latitude,
          'longitude', h.longitude
        )
        ORDER BY h.recorded_at ASC
      ) AS points
      FROM (
        SELECT
          latitude,
          longitude,
          recorded_at
        FROM location_history
        WHERE user_id = cl.user_id
          AND recorded_at >= NOW() - INTERVAL '30 minutes'
        ORDER BY recorded_at DESC
        LIMIT 10
      ) h
    ) trail ON true

    WHERE cm.circle_id = $1
      AND EXISTS (
        SELECT 1
        FROM circle_members requester_cm
        WHERE requester_cm.circle_id = $1
          AND requester_cm.user_id = $2
      )

    ORDER BY cl.updated_at DESC
    `,
    [circleId, userId]
  );

  return rows;
}

export async function getUserLocation(
  targetUserId,
  userId
) {
  const { rows } = await pool.query(
    `
    SELECT
      cl.user_id,
      cl.latitude,
      cl.longitude,
      cl.accuracy_m,
      cl.updated_at
    FROM current_locations cl
    WHERE cl.user_id = $1
      AND (
        cl.user_id = $2
        OR EXISTS (
          SELECT 1
          FROM circle_members cm1
          INNER JOIN circle_members cm2
            ON cm2.circle_id = cm1.circle_id
          WHERE cm1.user_id = cl.user_id
            AND cm2.user_id = $2
        )
      )
    `,
    [targetUserId, userId]
  );

  return rows[0];
}

export async function getUserLocationHistory(
  targetUserId,
  userId,
  limit
) {
  const { rows } = await pool.query(
    `
    SELECT
      lh.latitude,
      lh.longitude,
      lh.accuracy_m,
      lh.recorded_at
    FROM location_history lh
    WHERE lh.user_id = $1
      AND (
        lh.user_id = $2
        OR EXISTS (
          SELECT 1
          FROM circle_members cm1
          INNER JOIN circle_members cm2
            ON cm2.circle_id = cm1.circle_id
          WHERE cm1.user_id = lh.user_id
            AND cm2.user_id = $2
        )
      )
    ORDER BY lh.recorded_at DESC
    LIMIT $3
    `,
    [targetUserId, userId, limit]
  );

  return rows;
}