import { verifyToken } from "../utils/auth.js";
import { TipoUsuario } from "../models/enums/TipoUsuario.js";
import z from "zod";

const authSchema = z.object({
  headers: z.object({
    authorization: z.string().startsWith("Bearer ").min(20).max(500),
  }),
});

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Invalid authorization header" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = verifyToken(token);
    if (!decoded || decoded instanceof Error) {
      return res.status(403).send({ error: "Invalid token" });
    }
    req.user = decoded;
    return next();
  } catch (_err) {
    return res.status(403).send({ error: "Invalid token" });
  }
}

export function vendedorMiddleware(req, res, next) {
  if (
    req.user &&
    req.user.tipo &&
    req.user.tipo.includes(TipoUsuario.Vendedor)
  ) {
    next();
  } else {
    return res.status(403).send("Access denied. Vendedor tipo required.");
  }
}
