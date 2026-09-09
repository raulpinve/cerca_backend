import { auth } from "../config/firebase.js";

// export async function autenticarToken(req, res, next) {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader?.startsWith("Bearer ")) {
//       return res.status(401).json({
//         error: "Token no proporcionado",
//       });
//     }

//     const token = authHeader.split("Bearer ")[1];

//     const decodedToken = await auth.verifyIdToken(token);

//     req.user = decodedToken;

//     next();
//   } catch (error) {
//     console.error("Error verificando token:", error);

//     return res.status(401).json({
//       error: "Token inválido o expirado",
//     });
//   }
// }

export function authenticateToken(req, res, next) {
  req.user = {
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