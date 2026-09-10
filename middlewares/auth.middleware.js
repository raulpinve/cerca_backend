import { getAuth } from "firebase-admin/auth";
import { app } from "../config/firebase.js";
import { throwForbiddenError } from "../errors/throwHTTPErrors.js";
import { getUserByFirebaseUid } from "../repositories/user.repository.js";

export async function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Token no proporcionado",
      });
    }
    const token = authHeader.split("Bearer ")[1];

    const decodedToken = await getAuth(app).verifyIdToken(token);

    req.user = decodedToken;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      error: "Token inválido o expirado",
    });
  }
}

// export function authenticateToken(req, res, next) {
//   req.user = {
//     id: "05516ece-a9f5-4aa9-bdea-e7e98fd1df1b",
//     uid: "google-user-123",
//     email: "prueba@gmail.com",
//     email_verified: true,
//     name: "Usuario Prueba",
//     firebase: {
//       sign_in_provider: "google.com",
//     },
//   };

//   next();
// }