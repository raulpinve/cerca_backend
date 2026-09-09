import { auth } from "../config/firebase.js";
import { throwForbiddenError } from "../errors/throwHTTPErrors.js";
import { getUserByFirebaseUid } from "../repositories/user.repository.js";

// export async function authenticateToken(req, res, next) {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader?.startsWith("Bearer ")) {
//       throwForbiddenError("Token no proporcionado");
//     }

//     const token = authHeader.split("Bearer ")[1];

//     const decodedToken = await auth.verifyIdToken(token);

//     const user = await getUserByFirebaseUid(decodedToken.uid);

//     if (!user) {
//       throwForbiddenError("Usuario no encontrado");

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
    id: "c3b239a3-ad48-4463-9729-0028b8c92bbf",
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