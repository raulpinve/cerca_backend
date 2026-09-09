import { auth } from "../config/firebase.js";
import { getUserByFirebaseUid } from "../repositories/user.repository.js";
import { respuestaError } from "../utils/response.utils.js";

// export async function authenticateToken(req, res, next) {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader?.startsWith("Bearer ")) {
//       return respuestaError(res, 401, "Token no proporcionado");
//     }

//     const token = authHeader.split("Bearer ")[1];

//     const decodedToken = await auth.verifyIdToken(token);

//     const user = await getUserByFirebaseUid(decodedToken.uid);

//     if (!user) {
//       return respuestaError(res, 401, "Usuario no encontrado");
//     }

//     req.firebaseUser = decodedToken;
//     req.user = user;

//     next();
//   } catch (error) {
//     next(error);
//   }
// }

export function authenticateToken(req, res, next) {
  req.user = {
    id: "1cbecc1f-f619-40a2-8e04-8ee91afde3fa",
    uid: "google-user-123",
    email: "prueba@gmail.com",
    email_verified: true,
    name: "Usuario Prueba",
    firebase: {
      sign_in_provider: "google.com",
    },
  };

  next();
}