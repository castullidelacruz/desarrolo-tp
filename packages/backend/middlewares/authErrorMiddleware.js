import InvalidCredentialsError from "../errors/invalidCredentials.js";

export function authErrorMiddleware(err, _req, res, _next) {
  console.error("Error de autenticación:", err);

  if (err instanceof InvalidCredentialsError) {
    return res.status(401).json({ success: false, error: err.message });
  }

  res
    .status(500)
    .json({ success: false, error: "Ups. Algo sucedio en el servidor." });
}
