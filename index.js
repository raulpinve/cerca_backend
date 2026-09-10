import express from 'express';
import "dotenv/config";
const app = express();
const port = 3000;

app.use(express.json());

// Rutas 
import circleRoutes from "./routes/circle.routes.js";
import userRoutes from './routes/user.routes.js';
import handleErrorResponse from "./errors/handleErrorResponse.js";
import circleInvitationRoutes from "./routes/circleInvitation.routes.js";
import familyMemberRoutes from "./routes/family-member.routes.js";
import deviceRoutes from "./routes/device.routes.js";
import locationRoutes from "./routes/location.routes.js";

// import {
//   startFamilyInvitationExpirationJob,
// } from "./jobs/family-invitation-expiration.job.js";

app.use("/circles", circleRoutes);
app.use("/circle-invitations", circleInvitationRoutes);

app.use("/families", familyMemberRoutes);
app.use("/devices", deviceRoutes);
app.use("/users", userRoutes);
app.use("/locations", locationRoutes);
app.use(handleErrorResponse);

app.get('/status', (req, res) => {
  res.send('OK!!!');
});

// startFamilyInvitationExpirationJob();

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
