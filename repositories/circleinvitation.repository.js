import { pool } from "../init.db.js";

export async function createCircleInvitation(
  circleId,
  invitedUserId,
  invitedBy
) {
  const { rows } = await pool.query(
    `
    INSERT INTO circle_invitations (
      circle_id,
      invited_user_id,
      invited_by
    )
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [
      circleId,
      invitedUserId,
      invitedBy,
    ]
  );

  return rows[0];
}

export async function getPendingInvitations(userId) {
  const { rows } = await pool.query(
    `
    SELECT
      ci.id,
      ci.token,
      ci.status,
      ci.expires_at,
      ci.created_at,
      c.id AS circle_id,
      c.name AS circle_name,
      u.id AS invited_by_id,
      u.first_name AS invited_by_first_name,
      u.last_name AS invited_by_last_name
    FROM circle_invitations ci
    INNER JOIN circles c
      ON c.id = ci.circle_id
    INNER JOIN users u
      ON u.id = ci.invited_by
    WHERE ci.invited_user_id = $1
      AND ci.status = 'pending'
      AND ci.expires_at > NOW()
    ORDER BY ci.created_at DESC
    `,
    [userId]
  );

  return rows;
}

export async function getInvitationById(id) {
  const { rows } = await pool.query(
    `
    SELECT
      id,
      circle_id,
      invited_user_id,
      invited_by,
      token,
      status,
      expires_at,
      accepted_at,
      created_at
    FROM circle_invitations
    WHERE id = $1
    `,
    [id]
  );

  return rows[0];
}

export async function rejectCircleInvitation(id, userId) {
  const { rows } = await pool.query(
    `
    UPDATE circle_invitations
    SET status = 'rejected'
    WHERE id = $1
      AND invited_user_id = $2
      AND status = 'pending'
    RETURNING
      id,
      circle_id,
      invited_user_id,
      invited_by,
      token,
      status,
      expires_at,
      accepted_at,
      created_at
    `,
    [id, userId]
  );

  return rows[0];
}

export async function cancelCircleInvitation(id, userId) {
  const { rows } = await pool.query(
    `
    UPDATE circle_invitations
    SET status = 'cancelled'
    WHERE id = $1
      AND invited_by = $2
      AND status = 'pending'
    RETURNING
      id,
      circle_id,
      invited_user_id,
      invited_by,
      token,
      status,
      expires_at,
      accepted_at,
      created_at
    `,
    [id, userId]
  );

  return rows[0];
}

export async function expireCircleInvitations() {
  const { rows } = await pool.query(
    `
    UPDATE circle_invitations
    SET status = 'expired'
    WHERE status = 'pending'
      AND expires_at <= NOW()
    RETURNING id
    `
  );

  return rows;
}

export async function acceptCircleInvitation(id, userId) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const invitationResult = await client.query(
      `
      SELECT
        id,
        circle_id,
        invited_user_id,
        status,
        expires_at
      FROM circle_invitations
      WHERE id = $1
      FOR UPDATE
      `,
      [id]
    );

    const invitation = invitationResult.rows[0];

    if (!invitation) {
      await client.query("ROLLBACK");
      return null;
    }

    if (invitation.invited_user_id !== userId) {
      await client.query("ROLLBACK");

      const error = new Error(
        "No tienes permiso para aceptar esta invitación"
      );

      error.statusCode = 403;

      throw error;
    }

    if (invitation.status !== "pending") {
      await client.query("ROLLBACK");

      const error = new Error(
        "La invitación ya no está pendiente"
      );

      error.statusCode = 400;

      throw error;
    }

    if (new Date(invitation.expires_at) <= new Date()) {
      await client.query(
        `
        UPDATE circle_invitations
        SET status = 'expired'
        WHERE id = $1
        `,
        [id]
      );

      await client.query("COMMIT");

      const error = new Error(
        "La invitación ha expirado"
      );

      error.statusCode = 400;

      throw error;
    }

    await client.query(
      `
      INSERT INTO circle_members (
        circle_id,
        user_id,
        role
      )
      VALUES ($1, $2, 'member')
      ON CONFLICT (circle_id, user_id)
      DO NOTHING
      `,
      [
        invitation.circle_id,
        invitation.invited_user_id,
      ]
    );

    const result = await client.query(
      `
      UPDATE circle_invitations
      SET
        status = 'accepted',
        accepted_at = NOW()
      WHERE id = $1
      RETURNING
        id,
        circle_id,
        invited_user_id,
        invited_by,
        token,
        status,
        expires_at,
        accepted_at,
        created_at
      `,
      [id]
    );

    await client.query("COMMIT");

    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}