import { pool } from "../init.db.js";

export async function createDevice(
  userId,
  deviceName,
  platform
) {
  const { rows } = await pool.query(
    `
    INSERT INTO devices (
      user_id,
      device_name,
      platform
    )
    VALUES ($1, $2, $3)
    RETURNING
      id,
      user_id,
      device_name,
      platform,
      is_active,
      created_at,
      last_seen_at
    `,
    [
      userId,
      deviceName,
      platform,
    ]
  );

  return rows[0];
}

export async function getUserDevices(userId) {
  const { rows } = await pool.query(
    `
    SELECT
      id,
      user_id,
      device_name,
      platform,
      is_active,
      created_at,
      last_seen_at
    FROM devices
    WHERE user_id = $1
    ORDER BY created_at DESC
    `,
    [userId]
  );

  return rows;
}

export async function getDeviceById(
  id,
  userId
) {
  const { rows } = await pool.query(
    `
    SELECT
      id,
      user_id,
      device_name,
      platform,
      is_active,
      created_at,
      last_seen_at
    FROM devices
    WHERE id = $1
      AND user_id = $2
    `,
    [
      id,
      userId,
    ]
  );

  return rows[0];
}

export async function updateDevice(
  id,
  userId,
  deviceName,
  platform
) {
  const { rows } = await pool.query(
    `
    UPDATE devices
    SET
      device_name = $1,
      platform = $2
    WHERE id = $3
      AND user_id = $4
    RETURNING
      id,
      user_id,
      device_name,
      platform,
      is_active,
      created_at,
      last_seen_at
    `,
    [
      deviceName,
      platform,
      id,
      userId,
    ]
  );

  return rows[0];
}

export async function deactivateDevice(
  id,
  userId
) {
  const { rows } = await pool.query(
    `
    UPDATE devices
    SET
      is_active = FALSE
    WHERE id = $1
      AND user_id = $2
    RETURNING
      id,
      user_id,
      device_name,
      platform,
      is_active,
      created_at,
      last_seen_at
    `,
    [
      id,
      userId,
    ]
  );

  return rows[0];
}

export async function deleteDevice(
  id,
  userId
) {
  const { rows } = await pool.query(
    `
    DELETE FROM devices
    WHERE id = $1
      AND user_id = $2
    RETURNING
      id,
      user_id,
      device_name,
      platform,
      is_active,
      created_at,
      last_seen_at
    `,
    [
      id,
      userId,
    ]
  );

  return rows[0];
}