import { pool } from "../init.db.js";

export async function updateMyLocation(
  deviceId,
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
      INSERT INTO location_history (
        device_id,
        latitude,
        longitude,
        accuracy_m
      )
      SELECT
        d.id,
        $3,
        $4,
        $5
      FROM devices d
      WHERE d.id = $1
        AND d.user_id = $2
      RETURNING
        id,
        device_id,
        latitude,
        longitude,
        accuracy_m,
        recorded_at
      `,
      [
        deviceId,
        userId,
        latitude,
        longitude,
        accuracyM,
      ]
    );

    if (historyRows.length === 0) {
      await client.query("ROLLBACK");
      return null;
    }

    // 2. Actualizar ubicación actual
    const { rows } = await client.query(
      `
      INSERT INTO current_locations (
        device_id,
        latitude,
        longitude,
        accuracy_m
      )
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (device_id)
      DO UPDATE SET
        latitude = EXCLUDED.latitude,
        longitude = EXCLUDED.longitude,
        accuracy_m = EXCLUDED.accuracy_m,
        updated_at = NOW()
      RETURNING
        device_id,
        latitude,
        longitude,
        accuracy_m,
        updated_at
      `,
      [
        deviceId,
        latitude,
        longitude,
        accuracyM,
      ]
    );

    // 3. Actualizar última conexión del dispositivo
    await client.query(
      `
      UPDATE devices
      SET last_seen_at = NOW()
      WHERE id = $1
        AND user_id = $2
      `,
      [deviceId, userId]
    );

    await client.query("COMMIT");

    return rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function getCircleLocations(
  circleId,
  userId
) {
  const { rows } = await pool.query(
    `
    SELECT
      cl.device_id,
      d.user_id,
      d.device_name,
      d.platform,
      d.is_active,
      d.last_seen_at,
      cl.latitude,
      cl.longitude,
      cl.accuracy_m,
      cl.updated_at
    FROM current_locations cl
    INNER JOIN devices d
      ON d.id = cl.device_id
    INNER JOIN circle_members cm
      ON cm.user_id = d.user_id
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

export async function getDeviceLocation(
  deviceId,
  userId
) {
  const { rows } = await pool.query(
    `
    SELECT
      cl.device_id,
      d.user_id,
      d.device_name,
      d.platform,
      d.is_active,
      d.last_seen_at,
      cl.latitude,
      cl.longitude,
      cl.accuracy_m,
      cl.updated_at
    FROM current_locations cl
    INNER JOIN devices d
      ON d.id = cl.device_id
    WHERE cl.device_id = $1
      AND (
        d.user_id = $2
        OR EXISTS (
          SELECT 1
          FROM circle_members cm1
          INNER JOIN circle_members cm2
            ON cm2.circle_id = cm1.circle_id
          WHERE cm1.user_id = d.user_id
            AND cm2.user_id = $2
        )
      )
    `,
    [deviceId, userId]
  );

  return rows[0];
}

export async function getDeviceLocationHistory(
  deviceId,
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
    INNER JOIN devices d
      ON d.id = lh.device_id
    WHERE lh.device_id = $1
      AND (
        d.user_id = $2
        OR EXISTS (
          SELECT 1
          FROM circle_members cm1
          INNER JOIN circle_members cm2
            ON cm2.circle_id = cm1.circle_id
          WHERE cm1.user_id = d.user_id
            AND cm2.user_id = $2
        )
      )
    ORDER BY lh.recorded_at DESC
    LIMIT $3
    `,
    [deviceId, userId, limit]
  );

  return rows;
}