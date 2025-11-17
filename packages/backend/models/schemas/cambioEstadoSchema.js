import mongoose from "mongoose";
import { EstadoPedido } from "../enums/EstadoPedido.js";

const cambioEstadoSchema = new mongoose.Schema(
  {
    fecha: { type: Date, required: true },
    estado: { type: String, enum: Object.values(EstadoPedido), required: true },
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    motivo: { type: String },
  },
  { _id: false },
);

export default cambioEstadoSchema;
