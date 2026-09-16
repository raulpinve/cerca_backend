import { Server } from "socket.io";
import { getAuth } from "firebase-admin/auth";
import { pool } from "../../init.db.js";

let io;

export function initSocketServer(httpServer) {
  io = new Server(httpServer, {
    cors: { origin: "*" }, 
  });

  // Middleware de autenticación para sockets (igual que tu authenticateToken, pero para sockets)
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("No token provided"));

      const decodedToken = await getAuth().verifyIdToken(token);
      const { rows } = await pool.query(
        `SELECT id FROM users WHERE firebase_uid = $1`,
        [decodedToken.uid]
      );

      if (rows.length === 0) return next(new Error("Usuario no encontrado"));

      socket.userId = rows[0].id;
      next();
    } catch (error) {
      next(new Error("Token inválido"));
    }
  });

  io.on("connection", async (socket) => {
    console.log(`Usuario conectado: ${socket.userId}`);

    // Une al usuario a las rooms de todos sus círculos
    const { rows: circles } = await pool.query(
      `SELECT circle_id FROM circle_members WHERE user_id = $1`,
      [socket.userId]
    );

    circles.forEach((c) => socket.join(`circle:${c.circle_id}`));

    socket.on("disconnect", () => {
      console.log(`Usuario desconectado: ${socket.userId}`);
    });
  });

  return io;
}

// Función para emitir un update de ubicación a todos los miembros de un círculo
export async function emitLocationUpdate(circleId, locationData) {
  if (!io) return;
  io.to(`circle:${circleId}`).emit("location:update", locationData);
}