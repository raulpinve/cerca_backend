import cron from "node-cron";

import {
  expireFamilyInvitations,
} from "../repositories/family-invitation.repository.js";

export function startFamilyInvitationExpirationJob() {
  cron.schedule("0 * * * *", async () => {
    try {
      const expiredInvitations =
        await expireFamilyInvitations();

      if (expiredInvitations.length > 0) {
        console.log(
          `${expiredInvitations.length} invitación(es) expiraron`
        );
      }
    } catch (error) {
      console.error(
        "Error expirando invitaciones:",
        error
      );
    }
  });
}