import mongoose from "mongoose";
import { TipoUsuario } from "../enums/TipoUsuario.js";
import { Usuario } from "../entities/Usuario.js";

const usuarioSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    email: { type: String, required: true },
    telefono: { type: String, required: true },
    password: { type: String, required: true },
    tipo: {
      type: [String],
      enum: Object.values(TipoUsuario),
      required: true,
      default: [TipoUsuario.Comprador],
    },
    fechaAlta: { type: Date, default: Date.now },
  },
  { timestamps: true, collection: "usuarios" },
);
usuarioSchema.loadClass(Usuario);
export const UsuarioModel = mongoose.model("Usuario", usuarioSchema);
