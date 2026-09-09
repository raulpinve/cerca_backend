import { pool } from "../init.db.js";

export async function getFamilyMembers(familyId) {
  const { rows } = await pool.query(
    `
    SELECT
      fm.id,
      fm.family_id,
      fm.user_id,
      fm.role,
      fm.created_at,

      u.first_name,
      u.last_name,
      u.email

    FROM family_members fm

    INNER JOIN users u
      ON u.id = fm.user_id

    WHERE fm.family_id = $1

    ORDER BY fm.created_at ASC
    `,
    [familyId]
  );

  return rows;
}

export async function deleteFamilyMember(
  familyId,
  userId,
  requesterId
) {
  const { rows } = await pool.query(
    `
    DELETE FROM family_members
    WHERE family_id = $1
      AND user_id = $2
      AND EXISTS (
        SELECT 1
        FROM family_members
        WHERE family_id = $1
          AND user_id = $3
          AND role = 'owner'
      )
    RETURNING
      id,
      family_id,
      user_id,
      role,
      created_at
    `,
    [
      familyId,
      userId,
      requesterId,
    ]
  );

  return rows[0];
}

export async function leaveFamily(
  familyId,
  userId
) {
  const { rows } = await pool.query(
    `
    DELETE FROM family_members
    WHERE family_id = $1
      AND user_id = $2

    RETURNING
      id,
      family_id,
      user_id,
      role,
      created_at
    `,
    [
      familyId,
      userId,
    ]
  );

  return rows[0];
}