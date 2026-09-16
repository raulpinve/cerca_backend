import express from 'express';
import "dotenv/config";
import http from "http";
import { initSocketServer } from './src/sockets/socketServer.js';

const app = express();
const port = 3000;
app.use(express.json());

const httpServer = http.createServer(app);
initSocketServer(httpServer);

import circleRoutes from "./routes/circle.routes.js";
import handleErrorResponse from "./errors/handleErrorResponse.js";
import circleInvitationRoutes from "./routes/circleInvitation.routes.js";
import circleMemberRoutes from "./routes/circleMember.routes.js";
import locationRoutes from "./routes/location.routes.js";
import userRoutes from "./routes/user.routes.js";

app.use("/circles", circleMemberRoutes);
app.use("/circles", circleRoutes);
app.use("/circle-invitations", circleInvitationRoutes);
app.use("/locations", locationRoutes);
app.use("/routes", userRoutes);
app.use("/users", userRoutes); 
app.use(handleErrorResponse);

app.get('/status', (req, res) => {
  res.send('OK!!!');
});

httpServer.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

