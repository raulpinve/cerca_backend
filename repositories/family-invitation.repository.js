import { pool } from "../init.db.js";

export async function createFamilyInvitation(
  familyId,
  invitedUserId,
  invitedBy
) {
  const { rows } = await pool.query(
    `
    INSERT INTO family_invitations (
      family_id,
      invited_user_id,
      invited_by
    )
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [
      familyId,
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
      fi.id,
      fi.token,
      fi.status,
      fi.expires_at,
      fi.created_at,

      f.id AS family_id,
      f.name AS family_name,

      u.id AS invited_by_id,
      u.first_name AS invited_by_first_name,
      u.last_name AS invited_by_last_name

    FROM family_invitations fi

    INNER JOIN families f
      ON f.id = fi.family_id

    INNER JOIN users u
      ON u.id = fi.invited_by

    WHERE fi.invited_user_id = $1
      AND fi.status = 'pending'
      AND fi.expires_at > NOW()

    ORDER BY fi.created_at DESC
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
      family_id,
      invited_user_id,
      invited_by,
      token,
      status,
      expires_at,
      accepted_at,
      created_at
    FROM family_invitations
    WHERE id = $1
    `,
    [id]
  );

  return rows[0];
}

export async function rejectFamilyInvitation(id, userId) {
  const { rows } = await pool.query(
    `
    UPDATE family_invitations
    SET status = 'rejected'
    WHERE id = $1
      AND invited_user_id = $2
      AND status = 'pending'
    RETURNING
      id,
      family_id,
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

export async function cancelFamilyInvitation(id, userId) {
  const { rows } = await pool.query(
    `
    UPDATE family_invitations
    SET status = 'cancelled'
    WHERE id = $1
      AND invited_by = $2
      AND status = 'pending'
    RETURNING
      id,
      family_id,
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

export async function expireFamilyInvitations() {
  const { rows } = await pool.query(
    `
    UPDATE family_invitations
    SET status = 'expired'
    WHERE status = 'pending'
      AND expires_at <= NOW()
    RETURNING id
    `
  );

  return rows;
}

export async function acceptFamilyInvitation(id, userId) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const invitationResult = await client.query(
      `
      SELECT
        id,
        family_id,
        invited_user_id,
        status,
        expires_at
      FROM family_invitations
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
        UPDATE family_invitations
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
      INSERT INTO family_members (
        family_id,
        user_id,
        role
      )
      VALUES ($1, $2, 'member')
      ON CONFLICT (family_id, user_id)
      DO NOTHING
      `,
      [
        invitation.family_id,
        invitation.invited_user_id,
      ]
    );

    const result = await client.query(
      `
      UPDATE family_invitations
      SET
        status = 'accepted',
        accepted_at = NOW()
      WHERE id = $1
      RETURNING
        id,
        family_id,
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