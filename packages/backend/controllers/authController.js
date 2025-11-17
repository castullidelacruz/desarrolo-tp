import z from "zod";
import { TipoUsuario } from "../models/enums/TipoUsuario.js";

const userSchema = z.object({
  nombre: z.string().min(2).max(100),
  email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  password: z.string().min(6),
  telefono: z.string(),
  tipo: z.array(z.enum(Object.values(TipoUsuario))),
});

const userLoginSchema = z.object({
  email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  password: z.string().min(6),
});

export class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  async login(req, res) {
    const result = userLoginSchema.safeParse(req.body);
    if (!result.success) {
      return res
        .status(400)
        .json({ error: "Invalid login data", issues: result.error.issues });
    }
    const { email, password } = result.data;
    const data = await this.authService.login(email, password);
    res.json(data);
  }

  async register(req, res) {
    const result = userSchema.safeParse(req.body);
    if (!result.success) {
      return res
        .status(400)
        .json({ error: "Invalid user data", issues: result.error.issues });
    }

    const user = result.data;
    const createdUser = await this.authService.createUser(user);
    res.status(201).json({ user: createdUser });
  }
}
