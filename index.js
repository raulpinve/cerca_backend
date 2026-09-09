import express from 'express';
import "dotenv/config";
const app = express();
const port = 3000;

app.use(express.json());

// Rutas 
import userRoutes from './routes/user.routes.js';
import familyRoutes from "./routes/family.routes.js";
import handleErrorResponse from "./errors/handleErrorResponse.js";
import familyInvitationRoutes from "./routes/family-invitation.routes.js";
import familyMemberRoutes from "./routes/family-member.routes.js";
import deviceRoutes from "./routes/device.routes.js";

// import {
//   startFamilyInvitationExpirationJob,
// } from "./jobs/family-invitation-expiration.job.js";

app.use("/family-invitations", familyInvitationRoutes);
app.use("/families", familyMemberRoutes);
app.use("/families", familyRoutes);
app.use("/devices", deviceRoutes);
app.use("/users", userRoutes);
app.use(handleErrorResponse);

app.get('/status', (req, res) => {
  res.send('OK!!!');
});

// startFamilyInvitationExpirationJob();

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
